import { interpolateCoords } from "./functions";

export const LENGTH_EPS = 0.05;
export const COORD_EPS = 1e-9;
const MIN_SEGMENT_LENGTH_METERS = 1e-6;
const EARTH_RADIUS_METERS = 6371000;

const toRadians = (deg: number) => (deg * Math.PI) / 180;

export type UserLocationInput =
  | [number, number]
  | {
      longitude: number;
      latitude: number;
    }
  | {
      coords: {
        longitude: number;
        latitude: number;
      };
    };

export type NormalizedGroup = {
  coords: [number, number][];
  color: string;
  segmentLengths: number[];
  totalLength: number;
  startSegmentIndex: number;
};

export const distanceBetween = (a: number[], b: number[]) => {
  const [lon1, lat1] = a;
  const [lon2, lat2] = b;
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);
  const sinΔφ = Math.sin(Δφ / 2);
  const sinΔλ = Math.sin(Δλ / 2);
  const h =
    sinΔφ * sinΔφ + Math.cos(φ1) * Math.cos(φ2) * sinΔλ * sinΔλ;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return Math.max(MIN_SEGMENT_LENGTH_METERS, EARTH_RADIUS_METERS * c);
};

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const pointsEqual = (a?: [number, number], b?: [number, number]) => {
  if (!a || !b) return false;
  return (
    Math.abs(a[0] - b[0]) < COORD_EPS && Math.abs(a[1] - b[1]) < COORD_EPS
  );
};

export const normalizeUserLocation = (
  input?: UserLocationInput | null,
): [number, number] | null => {
  if (!input) return null;
  if (Array.isArray(input) && input.length === 2) {
    const [lon, lat] = input;
    return Number.isFinite(lon) && Number.isFinite(lat) ? [lon, lat] : null;
  }
  if (typeof input === "object") {
    const candidate =
      "coords" in input && input.coords
        ? input.coords
        : (input as { longitude?: number; latitude?: number });
    const lon = candidate?.longitude;
    const lat = candidate?.latitude;
    if (typeof lon === "number" && typeof lat === "number") {
      return [lon, lat];
    }
  }
  return null;
};

export const locateOnGroup = (
  group: NormalizedGroup,
  distance: number,
): { index: number; ratio: number } => {
  if (!group.segmentLengths.length)
    return { index: 0, ratio: distance > 0 ? 1 : 0 };
  if (distance <= 0) return { index: 0, ratio: 0 };
  let remaining = distance;
  for (let i = 0; i < group.segmentLengths.length; i++) {
    const len = group.segmentLengths[i];
    if (remaining <= len) {
      const ratio = len === 0 ? 1 : remaining / len;
      return { index: i, ratio };
    }
    remaining -= len;
  }
  return { index: group.segmentLengths.length - 1, ratio: 1 };
};

export const pointOnGroup = (
  group: NormalizedGroup,
  position: { index: number; ratio: number },
): [number, number] => {
  const { index, ratio } = position;
  const start = group.coords[index];
  const end = group.coords[index + 1] || start;
  if (!end) return start;
  if (ratio <= 0) return start;
  if (ratio >= 1) return end;
  return interpolateCoords(start, end, ratio);
};

export const buildPartialFeature = (
  group: NormalizedGroup,
  startWithin: number,
  endWithin: number,
  options?: {
    startOverride?: { index: number; ratio: number };
  },
) => {
  if (endWithin - startWithin <= LENGTH_EPS) return null;
  const startPos =
    options?.startOverride ??
    locateOnGroup(group, startWithin);
  const endPos = locateOnGroup(group, endWithin);

  const coords: [number, number][] = [];
  const push = (point: [number, number]) => {
    const last = coords[coords.length - 1];
    if (!pointsEqual(last, point)) coords.push(point);
  };

  push(pointOnGroup(group, startPos));

  if (startPos.index === endPos.index) {
    push(pointOnGroup(group, endPos));
  } else {
    if (startPos.ratio < 1 - COORD_EPS)
      push(group.coords[startPos.index + 1]);

    for (let i = startPos.index + 1; i < endPos.index; i++) {
      push(group.coords[i + 1]);
    }

    push(pointOnGroup(group, endPos));
  }

  if (coords.length < 2) return null;

  return {
    type: "Feature",
    properties: { color: group.color },
    geometry: { type: "LineString", coordinates: coords },
  };
};
