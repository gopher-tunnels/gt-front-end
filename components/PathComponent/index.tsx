import React, { useEffect, useMemo, useRef } from "react";
import MapboxGL from "@rnmapbox/maps";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "styled-components/native";
import { projectOntoPolyline } from "../../utils/navigation";
import {
  COORD_EPS,
  LENGTH_EPS,
  distanceBetween,
  normalizeUserLocation,
  pointsEqual,
  type NormalizedGroup,
} from "../../utils/path";
import { interpolateCoords } from "../../utils/functions";
import type { PathComponentProps } from "./types";

const FEATURE_COLLECTION_EMPTY = {
  type: "FeatureCollection",
  features: [],
};
const AnimatedShapeSource = Animated.createAnimatedComponent(
  MapboxGL.ShapeSource,
  { jsProps: ["shape"] },
);

type StartMeta = { segmentIndex: number; ratio: number };

type SharedRoute = {
  groups: NormalizedGroup[];
  totalLength: number;
};

const clampWorklet = (value: number, min: number, max: number) => {
  "worklet";
  return Math.min(Math.max(value, min), max);
};

const pointsEqualWorklet = (a?: [number, number], b?: [number, number]) => {
  "worklet";
  if (!a || !b) return false;
  return (
    Math.abs(a[0] - b[0]) < COORD_EPS &&
    Math.abs(a[1] - b[1]) < COORD_EPS
  );
};

const locateOnGroupWorklet = (
  group: NormalizedGroup,
  distance: number,
): { index: number; ratio: number } => {
  "worklet";
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

const pointOnGroupWorklet = (
  group: NormalizedGroup,
  position: { index: number; ratio: number },
): [number, number] => {
  "worklet";
  const { index, ratio } = position;
  const start = group.coords[index];
  const end = group.coords[index + 1] || start;
  if (!end) return start;
  if (ratio <= 0) return start;
  if (ratio >= 1) return end;
  return interpolateCoords(start, end, ratio) as [number, number];
};

const buildPartialFeatureWorklet = (
  group: NormalizedGroup,
  startWithin: number,
  endWithin: number,
  options?: {
    startOverride?: { index: number; ratio: number };
  },
) => {
  "worklet";
  if (endWithin - startWithin <= LENGTH_EPS) return null;
  const startPos =
    options?.startOverride ?? locateOnGroupWorklet(group, startWithin);
  const endPos = locateOnGroupWorklet(group, endWithin);

  const coords: [number, number][] = [];

  const push = (point: [number, number]) => {
    const last = coords[coords.length - 1];
    if (!pointsEqualWorklet(last, point)) coords.push(point);
  };

  push(pointOnGroupWorklet(group, startPos));

  if (startPos.index === endPos.index) {
    push(pointOnGroupWorklet(group, endPos));
  } else {
    if (startPos.ratio < 1 - COORD_EPS) {
      push(group.coords[startPos.index + 1]);
    }

    for (let i = startPos.index + 1; i < endPos.index; i++) {
      push(group.coords[i + 1]);
    }

    push(pointOnGroupWorklet(group, endPos));
  }

  if (coords.length < 2) return null;

  return {
    type: "Feature",
    properties: { color: group.color },
    geometry: { type: "LineString", coordinates: coords },
  };
};

const buildSliceWorklet = (
  groups: NormalizedGroup[],
  totalLength: number,
  startDistance: number,
  endDistance: number,
  startMeta?: StartMeta | null,
) => {
  "worklet";
  if (!groups.length) return [];

  const clampedStart = clampWorklet(startDistance, 0, totalLength);
  const clampedEnd = clampWorklet(endDistance, clampedStart, totalLength);
  if (clampedEnd - clampedStart <= LENGTH_EPS) return [];

  const features: any[] = [];
  let travelled = 0;

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    const groupStart = travelled;
    const groupEnd = groupStart + group.totalLength;
    const groupFirstSegment = group.startSegmentIndex;
    const groupLastSegment =
      group.startSegmentIndex + group.segmentLengths.length - 1;
    const startWithinGroup =
      !!startMeta &&
      startMeta.segmentIndex >= groupFirstSegment &&
      startMeta.segmentIndex <= groupLastSegment;

    if (!startWithinGroup && groupEnd < clampedStart - LENGTH_EPS) {
      travelled = groupEnd;
      continue;
    }
    if (groupStart > clampedEnd + LENGTH_EPS) break;

    let localStart = Math.max(0, clampedStart - groupStart);
    const localEnd = Math.min(group.totalLength, clampedEnd - groupStart);

    let startOverride: { index: number; ratio: number } | undefined;

    if (startWithinGroup && startMeta) {
      const segmentIdx = startMeta.segmentIndex - groupFirstSegment;
      const rawRatio = startMeta.ratio;
      const safeRatio =
        rawRatio !== rawRatio ? 0 : Math.min(1, Math.max(0, rawRatio));
      let before = 0;
      for (let j = 0; j < segmentIdx; j++) {
        before += group.segmentLengths[j] ?? 0;
      }
      const segLen = group.segmentLengths[segmentIdx] ?? 0;
      localStart = before + segLen * safeRatio;
      startOverride = { index: segmentIdx, ratio: safeRatio };
    }

    if (
      localStart <= LENGTH_EPS &&
      group.totalLength - localEnd <= LENGTH_EPS
    ) {
      features.push({
        type: "Feature",
        properties: { color: group.color },
        geometry: { type: "LineString", coordinates: group.coords },
      });
    } else {
      const partial = buildPartialFeatureWorklet(group, localStart, localEnd, {
        startOverride,
      });
      if (partial) features.push(partial);
    }

    travelled = groupEnd;
    if (clampedEnd <= groupEnd + LENGTH_EPS) break;
  }

  return features;
};

// Example usage, place in <MapboxGL.MapView>:
// <PathComponent coordinates={coords}/>
const PathComponent: React.FC<PathComponentProps> = ({
  id,
  coordinates,
  segments,
  lineColor,
  lineWidth = 6,
  durationMs,
  userLocation,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const singleColor = lineColor || colors.tunnel2;

  const normalized = useMemo(() => {
    const mapTypeToColor = (t?: string): string => {
      const key = (t || "").toLowerCase();
      if (key.includes("tunnel")) return colors.tunnel2;
      if (key.includes("skyway")) return colors.skyway2;
      if (key.includes("sidewalk") || key.includes("outdoor"))
        return colors.sidewalk2;
      if (key.includes("mapbox")) return colors.sidewalk2;
      return singleColor;
    };

    const groups: NormalizedGroup[] = [];
    let segmentCursor = 0;

    if (segments && segments.length) {
      for (const seg of segments) {
        const coords = (seg.coordinates || []).filter(Array.isArray);
        if (!coords || coords.length < 2) continue;
        const color = seg.color || mapTypeToColor(seg.type);
        const typedCoords = coords as [number, number][];
        const lengths: number[] = [];
        let total = 0;
        for (let i = 0; i < typedCoords.length - 1; i++) {
          const len = distanceBetween(typedCoords[i], typedCoords[i + 1]);
          lengths.push(len);
          total += len;
        }
        const startSegmentIndex =
          typeof seg.startSegmentIndex === "number"
            ? seg.startSegmentIndex
            : segmentCursor;
        groups.push({
          coords: typedCoords,
          color,
          segmentLengths: lengths,
          totalLength: total,
          startSegmentIndex,
        });
        segmentCursor = startSegmentIndex + lengths.length;
      }
    } else if (coordinates && coordinates.length >= 2) {
      const typedCoords = coordinates as [number, number][];
      const lengths: number[] = [];
      let total = 0;
      for (let i = 0; i < typedCoords.length - 1; i++) {
        const len = distanceBetween(typedCoords[i], typedCoords[i + 1]);
        lengths.push(len);
        total += len;
      }
      groups.push({
        coords: typedCoords,
        color: singleColor,
        segmentLengths: lengths,
        totalLength: total,
        startSegmentIndex: segmentCursor,
      });
      segmentCursor += lengths.length;
    }

    return {
      groups,
      totalLength: groups.reduce((sum, g) => sum + g.totalLength, 0),
    };
  }, [segments, coordinates, singleColor, colors]);

  const routePolyline = useMemo(() => {
    const coords: [number, number][] = [];
    normalized.groups.forEach((group) => {
      group.coords.forEach((coord) => {
        if (!coords.length) {
          coords.push(coord);
          return;
        }
        const last = coords[coords.length - 1];
        if (!pointsEqual(last, coord)) {
          coords.push(coord);
        }
      });
    });
    return coords;
  }, [normalized.groups]);

  const userPoint = useMemo(
    () => normalizeUserLocation(userLocation),
    [userLocation],
  );

  const userProjection = useMemo(() => {
    if (!userPoint || routePolyline.length < 2) return null;
    return projectOntoPolyline(userPoint, routePolyline);
  }, [routePolyline, userPoint]);

  const startMeta = useMemo<StartMeta | null>(
    () =>
      userProjection
        ? {
            segmentIndex: userProjection.segmentIndex,
            ratio: userProjection.segmentT,
          }
        : null,
    [userProjection],
  );

  const projectedDistance = userProjection?.distanceAlong ?? 0;
  const clampedStart = useMemo(
    () => Math.max(0, Math.min(projectedDistance, normalized.totalLength)),
    [projectedDistance, normalized.totalLength],
  );

  const routeData = useSharedValue<SharedRoute>({
    groups: [],
    totalLength: 0,
  });
  const startDistance = useSharedValue(0);
  const startMetaShared = useSharedValue<StartMeta | null>(null);
  const progress = useSharedValue(0);

  const prevTotalLengthRef = useRef<number | null>(null);
  const prevStartOffsetRef = useRef<number | null>(null);

  useEffect(() => {
    routeData.value = {
      groups: normalized.groups,
      totalLength: normalized.totalLength,
    };
    startDistance.value = clampedStart;
    startMetaShared.value = startMeta;
  }, [
    normalized.groups,
    normalized.totalLength,
    clampedStart,
    startMeta,
    routeData,
    startDistance,
    startMetaShared,
  ]);

  useEffect(() => {
    const routeLength = normalized.totalLength;
    const remainingLength = Math.max(0, routeLength - clampedStart);
    const wasLength = prevTotalLengthRef.current;
    const prevStart = prevStartOffsetRef.current;
    const isNewRoute =
      wasLength === null || Math.abs(wasLength - routeLength) > LENGTH_EPS;
    const startReset =
      prevStart !== null &&
      Math.abs(prevStart - clampedStart) > LENGTH_EPS &&
      clampedStart < prevStart;

    prevTotalLengthRef.current = routeLength;
    prevStartOffsetRef.current = clampedStart;

    if (!normalized.groups.length || remainingLength <= LENGTH_EPS) {
      cancelAnimation(progress);
      progress.value = 0;
      return;
    }

    if (!isNewRoute && !startReset) {
      cancelAnimation(progress);
      progress.value = 1;
      return;
    }

    const durationAuto = (() => {
      const base = remainingLength * 6;
      return Math.min(4000, Math.max(900, base));
    })();

    const duration = durationMs ?? durationAuto;

    cancelAnimation(progress);
    progress.value = 0;
    progress.value = withTiming(1, {
      duration,
      easing: Easing.inOut(Easing.cubic),
    });
  }, [
    normalized.groups.length,
    normalized.totalLength,
    clampedStart,
    durationMs,
    progress,
  ]);

  const animatedProps = useAnimatedProps(() => {
    const data = routeData.value;
    if (!data.groups.length || data.totalLength <= LENGTH_EPS) {
      return { shape: FEATURE_COLLECTION_EMPTY };
    }

    const clamped = clampWorklet(startDistance.value, 0, data.totalLength);
    const remaining = Math.max(0, data.totalLength - clamped);
    const endDistance = clamped + remaining * progress.value;

    const features = buildSliceWorklet(
      data.groups,
      data.totalLength,
      clamped,
      endDistance,
      startMetaShared.value,
    );

    if (features.length === 0) {
      return { shape: FEATURE_COLLECTION_EMPTY };
    }

    return {
      shape: {
        type: "FeatureCollection",
        features,
      },
    };
  });

  return (
    <AnimatedShapeSource
      id={`lineSource-${id}`}
      hitbox={{ width: 0, height: 0 }}
      shape={FEATURE_COLLECTION_EMPTY}
      animatedProps={animatedProps}
    >
      <MapboxGL.LineLayer
        id={`lineLayer-${id}`}
        style={{
          lineCap: "round",
          lineJoin: "round",
          lineColor: ["get", "color"],
          lineWidth: lineWidth,
          lineEmissiveStrength: 1.0,
        }}
      />
    </AnimatedShapeSource>
  );
};

export default PathComponent;
