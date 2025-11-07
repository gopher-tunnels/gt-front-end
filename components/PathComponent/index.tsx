import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import MapboxGL from "@rnmapbox/maps";
import { useTheme } from "styled-components/native";
import { projectOntoPolyline } from "../../utils/navigation";
import {
  LENGTH_EPS,
  buildPartialFeature,
  distanceBetween,
  easeInOutCubic,
  normalizeUserLocation,
  pointsEqual,
  type NormalizedGroup,
} from "../../utils/path";
import { type PathComponentProps, type SegmentInput } from "./types";

// Example usage, place in <MapboxGL.MapView>:
// <PathComponent coordinates={coords}/>

const FEATURE_COLLECTION_EMPTY = {
  type: "FeatureCollection",
  features: [],
} as const;

/**
 * @description Component that animates a path on a MapboxGL map using an easing-based "draw-on" animation.
 *
 * @param {PathComponentProps['coordinates']} coordinates - Array of [longitude, latitude] coordinate pairs that define the full path to be drawn.
 * @param {PathComponentProps['lineColor']} [lineColor] - Optional color of the line. Defaults to theme `tunnel2` color if not provided.
 * @param {PathComponentProps['lineWidth']} [lineWidth=6] - Optional width of the line in pixels.
 *
 * @returns {React.FC<PathComponentProps>} TSX React Functional Component
 *
 * @example
 * ```tsx
 * <PathComponent
 *   coordinates={[
 *     [-122.483696, 37.833818],
 *     [-122.483482, 37.833174],
 *     [-122.483396, 37.8327],
 *   ]}
 *   lineColor="#00f"
 *   lineWidth={4}
 * />
 * ```
 */
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
  const [featureCollection, setFeatureCollection] = useState<any>(
    FEATURE_COLLECTION_EMPTY,
  );
  const animationFrameRef = useRef<number | null>(null);
  const prevTotalLengthRef = useRef<number | null>(null);
  const prevStartOffsetRef = useRef<number | null>(null);

  const singleColor = lineColor || theme.colors.tunnel2;
  // Normalize to grouped form and precompute metadata for animation
  const normalized = useMemo(() => {
    // Helper: color mapping by type
    const mapTypeToColor = (t?: string): string => {
      const key = (t || "").toLowerCase();
      if (key.includes("tunnel")) return theme.colors.tunnel2;
      if (key.includes("skyway")) return theme.colors.skyway2;
      if (key.includes("sidewalk") || key.includes("outdoor"))
        return theme.colors.sidewalk2;
      if (key.includes("mapbox")) return theme.colors.sidewalk2;
      return singleColor; // fallback
    };

    const groups: NormalizedGroup[] = [];
    let segmentCursor = 0;
    if (segments && segments.length) {
      for (const seg of segments) {
        const coords = (seg.coordinates || []).filter(Array.isArray);
        if (!coords || coords.length < 2) continue; // need at least a segment
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
  }, [segments, coordinates, singleColor, theme.colors]);

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

  const startMeta = useMemo(
    () =>
      userProjection
        ? {
            segmentIndex: userProjection.segmentIndex,
            ratio: userProjection.segmentT,
          }
        : undefined,
    [userProjection],
  );

  const projectedDistance = userProjection?.distanceAlong ?? 0;

  const fullFeatures = useMemo(() => {
    return normalized.groups.map((g) => ({
      type: "Feature",
      properties: { color: g.color },
      geometry: { type: "LineString", coordinates: g.coords },
    }));
  }, [normalized.groups]);

  const buildSlice = useCallback(
    (
      startDistance: number,
      endDistance: number,
      startMeta?: { segmentIndex: number; ratio: number | null },
    ) => {
      if (!normalized.groups.length) return [];
      const clampedStart = Math.max(
        0,
        Math.min(startDistance, normalized.totalLength),
      );
      const clampedEnd = Math.max(
        clampedStart,
        Math.min(endDistance, normalized.totalLength),
      );
      if (clampedEnd - clampedStart <= LENGTH_EPS) return [];

      const features: any[] = [];
      let travelled = 0;

      for (let i = 0; i < normalized.groups.length; i++) {
        const group = normalized.groups[i];
        const groupStart = travelled;
        const groupEnd = groupStart + group.totalLength;
        const groupFirstSegment = group.startSegmentIndex;
        const groupLastSegment =
          group.startSegmentIndex + group.segmentLengths.length - 1;
        const startWithinGroup =
          startMeta &&
          startMeta.segmentIndex >= groupFirstSegment &&
          startMeta.segmentIndex <= groupLastSegment;

        if (!startWithinGroup && groupEnd < clampedStart - LENGTH_EPS) {
          travelled = groupEnd;
          continue;
        }
        if (groupStart > clampedEnd + LENGTH_EPS) break;

        let localStart = Math.max(0, clampedStart - groupStart);
        const localEnd = Math.min(group.totalLength, clampedEnd - groupStart);

        let startOverride:
          | {
              index: number;
              ratio: number;
            }
          | undefined;

        if (startWithinGroup) {
          const segmentIdx = startMeta!.segmentIndex - groupFirstSegment;
          const safeRatio =
            startMeta!.ratio === null || Number.isNaN(startMeta!.ratio)
              ? 0
              : Math.min(1, Math.max(0, startMeta!.ratio));
          const before = group.segmentLengths
            .slice(0, segmentIdx)
            .reduce((sum, len) => sum + len, 0);
          const segLen = group.segmentLengths[segmentIdx] ?? 0;
          localStart = before + segLen * safeRatio;
          startOverride = { index: segmentIdx, ratio: safeRatio };
        }

        if (
          localStart <= LENGTH_EPS &&
          group.totalLength - localEnd <= LENGTH_EPS
        ) {
          features.push(fullFeatures[i]);
        } else {
          const partial = buildPartialFeature(group, localStart, localEnd, {
            startOverride,
          });
          if (partial) features.push(partial);
        }

        travelled = groupEnd;
        if (clampedEnd <= groupEnd + LENGTH_EPS) break;
      }
      return features;
    },
    [normalized.groups, normalized.totalLength, fullFeatures],
  );

  useEffect(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    const routeLength = normalized.totalLength;
    const clampedStart = Math.max(0, Math.min(projectedDistance, routeLength));
    const remainingLength = Math.max(0, routeLength - clampedStart);
    const wasLength = prevTotalLengthRef.current;
    const isNewRoute =
      wasLength === null || Math.abs(wasLength - routeLength) > LENGTH_EPS;
    const prevStart = prevStartOffsetRef.current;
    const startReset =
      prevStart !== null &&
      Math.abs(prevStart - clampedStart) > LENGTH_EPS &&
      clampedStart < prevStart;
    prevTotalLengthRef.current = routeLength;
    prevStartOffsetRef.current = clampedStart;

    if (!normalized.groups.length || remainingLength <= LENGTH_EPS) {
      setFeatureCollection(FEATURE_COLLECTION_EMPTY);
      return;
    }

    if (!isNewRoute && !startReset) {
      const features = buildSlice(clampedStart, routeLength, startMeta);
      setFeatureCollection(
        features.length
          ? {
              type: "FeatureCollection",
              features,
            }
          : FEATURE_COLLECTION_EMPTY,
      );
      return;
    }

    const durationAuto = (() => {
      const base = remainingLength * 6; // ~6ms per meter
      return Math.min(4000, Math.max(900, base));
    })();

    const duration = durationMs ?? durationAuto;
    const start =
      typeof performance !== "undefined" ? performance.now() : Date.now();

    const render = (fraction: number) => {
      const eased = Math.max(0, Math.min(1, fraction));
      const endDistance = clampedStart + remainingLength * eased;
      const features = buildSlice(clampedStart, endDistance, startMeta);
      setFeatureCollection(
        features.length
          ? {
              type: "FeatureCollection",
              features,
            }
          : FEATURE_COLLECTION_EMPTY,
      );
    };

    render(0);

    const step = (now: number) => {
      const elapsed = now - start;
      const raw = duration === 0 ? 1 : Math.min(1, elapsed / duration);
      render(easeInOutCubic(raw));
      if (raw < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [
    buildSlice,
    durationMs,
    normalized.groups,
    normalized.totalLength,
    projectedDistance,
    startMeta,
  ]);

  return (
    <MapboxGL.ShapeSource
      id={`lineSource-${id}`}
      hitbox={{ width: 0, height: 0 }}
      shape={featureCollection}
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
    </MapboxGL.ShapeSource>
  );
};

export default PathComponent;
