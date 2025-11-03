import type { LocationObject } from "expo-location";
import type { DirectionsHeaderProps } from "../components/DirectionsHeader";
import type { GetRouteResponse } from "../@types/api";
import { interpolateCoords } from "./functions";

const EARTH_RADIUS_METERS = 6371000;
const DEG_TO_RAD = Math.PI / 180;

type DirectionValue = DirectionsHeaderProps["directions"][number];

export interface NormalizedInstruction {
  instruction: DirectionValue;
  coordinate: [number, number];
  cumulativeMeters: number;
}

export interface NormalizedSegment {
  coordinates: [number, number][];
  type?: string;
  startSegmentIndex: number;
}

export interface NormalizedRoute {
  segments: NormalizedSegment[];
  polyline: [number, number][];
  instructions: NormalizedInstruction[];
  totalDistanceMeters: number;
}

export interface PolylineSnapResult {
  point: [number, number];
  distanceAlong: number;
  distanceToLine: number;
  segmentIndex: number;
  segmentT: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const toDirectionValue = (raw: any): DirectionValue => {
  if (!raw) return "forward";
  if (typeof raw === "string") return raw as DirectionValue;
  const type = raw.type as DirectionValue;
  if (raw.label && typeof raw.label === "string")
    return { type, label: raw.label };
  return type;
};

const toLonLat = (candidate: any): [number, number] | null => {
  if (!candidate) return null;
  const { longitude, latitude } = candidate;
  if (
    typeof longitude !== "number" ||
    Number.isNaN(longitude) ||
    typeof latitude !== "number" ||
    Number.isNaN(latitude)
  )
    return null;
  return [longitude, latitude];
};

const extractStepArray = (route: any): any[] => {
  if (!route) return [];
  if (Array.isArray(route))
    return route.flatMap((entry) => extractStepArray(entry));
  const { steps } = route;
  if (!Array.isArray(steps)) return [];
  if (steps.length && Array.isArray(steps[0]?.steps)) {
    return steps.flatMap((stage) => stage?.steps || []);
  }
  return steps;
};

const extractSegments = (
  route: any,
): { coordinates: number[][]; type?: string }[] => {
  const segments: { coordinates: number[][]; type?: string }[] = [];
  if (!route) return segments;

  const pushSegment = (coords: number[][], type?: string) => {
    const filtered = coords.filter(
      (coord) => Array.isArray(coord) && coord.length === 2,
    );
    if (filtered.length >= 2) segments.push({ coordinates: filtered, type });
  };

  if (Array.isArray(route)) {
    route.forEach((entry) => {
      const coords = (entry?.steps || []).map(toLonLat).filter(Boolean) as [
        number,
        number,
      ][];
      pushSegment(coords, entry?.type);
    });
    return segments;
  }

  const steps = route?.steps;
  if (!Array.isArray(steps)) return segments;

  if (steps.length && Array.isArray(steps[0]?.steps)) {
    steps.forEach((stage: any) => {
      const coords = (stage?.steps || []).map(toLonLat).filter(Boolean) as [
        number,
        number,
      ][];
      pushSegment(coords, stage?.type);
    });
  } else {
    let current: { coords: [number, number][]; type?: string } | null = null;
    steps.forEach((step: any) => {
      const coord = toLonLat(step);
      if (!coord) return;
      const type = step?.type;
      if (!current || current.type !== type) {
        if (current && current.coords.length >= 2)
          pushSegment(current.coords, current.type);
        current = { coords: [coord], type };
      } else {
        current.coords.push(coord);
      }
    });
    if (current && current.coords.length >= 2)
      pushSegment(current.coords, current.type);
  }
  return segments;
};

const haversineMeters = (a: [number, number], b: [number, number]) => {
  const [lon1, lat1] = a;
  const [lon2, lat2] = b;
  const dLat = (lat2 - lat1) * DEG_TO_RAD;
  const dLon = (lon2 - lon1) * DEG_TO_RAD;
  const originLat = lat1 * DEG_TO_RAD;
  const targetLat = lat2 * DEG_TO_RAD;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos(originLat) * Math.cos(targetLat) * sinDLon * sinDLon;
  return 2 * EARTH_RADIUS_METERS * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

const toXY = (
  coord: [number, number],
  cosRefLat: number,
): { x: number; y: number } => {
  const [lon, lat] = coord;
  const x = lon * DEG_TO_RAD * cosRefLat * EARTH_RADIUS_METERS;
  const y = lat * DEG_TO_RAD * EARTH_RADIUS_METERS;
  return { x, y };
};

const fromXY = (
  point: { x: number; y: number },
  cosRefLat: number,
): [number, number] => {
  const lon = point.x / (EARTH_RADIUS_METERS * cosRefLat) / DEG_TO_RAD;
  const lat = point.y / EARTH_RADIUS_METERS / DEG_TO_RAD;
  return [lon, lat];
};

const projectOntoSegment = (
  point: [number, number],
  a: [number, number],
  b: [number, number],
  cosRefLat: number,
) => {
  const p = toXY(point, cosRefLat);
  const start = toXY(a, cosRefLat);
  const end = toXY(b, cosRefLat);

  const ab = { x: end.x - start.x, y: end.y - start.y };
  const abLen2 = ab.x * ab.x + ab.y * ab.y;
  if (abLen2 === 0) {
    return {
      closestPoint: start,
      t: 0,
      distanceMeters: Math.hypot(p.x - start.x, p.y - start.y),
    };
  }
  const ap = { x: p.x - start.x, y: p.y - start.y };
  const t = clamp((ap.x * ab.x + ap.y * ab.y) / abLen2, 0, 1);
  const closest = { x: start.x + ab.x * t, y: start.y + ab.y * t };
  const distanceMeters = Math.hypot(p.x - closest.x, p.y - closest.y);
  return { closestPoint: closest, t, distanceMeters };
};

export const normalizeRoute = (
  route: GetRouteResponse | any,
): NormalizedRoute | null => {
  if (!route) return null;

  const segmentsRaw = extractSegments(route);

  const polyline: [number, number][] = [];
  segmentsRaw.forEach((segment) => {
    segment.coordinates.forEach((coord) => {
      if (!polyline.length) {
        polyline.push([coord[0], coord[1]]);
        return;
      }
      const last = polyline[polyline.length - 1];
      if (last[0] !== coord[0] || last[1] !== coord[1]) {
        polyline.push([coord[0], coord[1]]);
      }
    });
  });

  const rawSteps = extractStepArray(route);
  if (!rawSteps.length && !polyline.length) return null;

  const instructions: NormalizedInstruction[] = [];
  let cumulative = 0;
  let prev: [number, number] | null = null;

  rawSteps.forEach((step: any) => {
    const coord = toLonLat(step);
    if (!coord) return;
    if (prev) cumulative += haversineMeters(prev, coord);
    const direction = toDirectionValue(step?.instruction);
    instructions.push({
      instruction: direction,
      coordinate: coord,
      cumulativeMeters: cumulative,
    });
    prev = coord;
  });

  if (!polyline.length && instructions.length) {
    instructions.forEach(({ coordinate }) => {
      if (
        !polyline.length ||
        polyline[polyline.length - 1][0] !== coordinate[0] ||
        polyline[polyline.length - 1][1] !== coordinate[1]
      ) {
        polyline.push(coordinate);
      }
    });
  }

  let totalDistanceMeters = 0;
  if (polyline.length >= 2) {
    for (let i = 0; i < polyline.length - 1; i++) {
      totalDistanceMeters += haversineMeters(polyline[i], polyline[i + 1]);
    }
  } else if (instructions.length) {
    totalDistanceMeters =
      instructions[instructions.length - 1].cumulativeMeters;
  }

  const normalizedSegments: NormalizedSegment[] = [];
  let segmentCursor = 0;
  segmentsRaw.forEach((segment) => {
    const coords = segment.coordinates as [number, number][];
    if (!coords || coords.length < 2) return;
    const segCount = coords.length - 1;
    normalizedSegments.push({
      coordinates: coords,
      type: segment.type,
      startSegmentIndex: segmentCursor,
    });
    segmentCursor += segCount;
  });

  return {
    segments: normalizedSegments,
    polyline: polyline as [number, number][],
    instructions,
    totalDistanceMeters,
  };
};

export const projectOntoPolyline = (
  point: [number, number],
  polyline: [number, number][],
): PolylineSnapResult | null => {
  if (!polyline || polyline.length < 2) return null;

  const refLat = point[1] * DEG_TO_RAD;
  const cosRefLat = Math.cos(refLat);

  let best: PolylineSnapResult | null = null;
  let traversed = 0;

  for (let i = 0; i < polyline.length - 1; i++) {
    const start = polyline[i];
    const end = polyline[i + 1];
    const segmentLength = haversineMeters(start, end);
    const projection = projectOntoSegment(point, start, end, cosRefLat);
    const along = traversed + segmentLength * projection.t;
    const snapPoint = fromXY(projection.closestPoint, cosRefLat);
    const result: PolylineSnapResult = {
      point: snapPoint,
      distanceAlong: along,
      distanceToLine: projection.distanceMeters,
      segmentIndex: i,
      segmentT: projection.t,
    };
    if (!best || projection.distanceMeters < best.distanceToLine) best = result;
    traversed += segmentLength;
  }

  return best;
};

export const distanceInMeters = (
  from: LocationObject["coords"],
  to: [number, number],
) => {
  return haversineMeters([from.longitude, from.latitude], to);
};
export const getPositionAlongPolyline = (
  polyline: [number, number][],
  distance: number,
) => {
  if (!polyline.length) return null;
  if (polyline.length === 1)
    return {
      segmentIndex: 0,
      ratio: 0,
      point: polyline[0] as [number, number],
    };
  const target = Math.max(0, distance);
  let accumulated = 0;
  for (let i = 0; i < polyline.length - 1; i++) {
    const start = polyline[i];
    const end = polyline[i + 1];
    const len = haversineMeters(start, end);
    if (len === 0) continue;
    if (accumulated + len >= target) {
      const remaining = target - accumulated;
      const ratio = Math.min(1, Math.max(0, remaining / len));
      const point = interpolateCoords(start, end, ratio);
      return { segmentIndex: i, ratio, point };
    }
    accumulated += len;
  }
  const lastIdx = polyline.length - 2;
  return {
    segmentIndex: Math.max(0, lastIdx),
    ratio: 1,
    point: polyline[polyline.length - 1] as [number, number],
  };
};
