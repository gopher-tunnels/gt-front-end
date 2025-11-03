import { useEffect, useMemo, useRef, useState } from "react";
import type { LocationObject } from "expo-location";
import type { GetRouteResponse } from "../@types/api";
import {
  NormalizedRoute,
  normalizeRoute,
  projectOntoPolyline,
  getPositionAlongPolyline,
  distanceInMeters,
} from "../utils/navigation";
import type { DirectionsHeaderProps } from "../components/DirectionsHeader";

const COMPLETION_RADIUS_METERS = 10;
const SNAP_FALLOFF_METERS = 25;

interface NavigationProgressState {
  current: number;
  progress: number;
  distanceToNext: number | null;
  distanceAlong: number;
  offRoute: boolean;
  projection:
    | {
        segmentIndex: number;
        ratio: number;
        point: [number, number];
      }
    | null;
}

interface NavigationProgressResult extends NavigationProgressState {
  directions: DirectionsHeaderProps["directions"];
  normalizedRoute: NormalizedRoute | null;
}

export interface OffRouteCallbackPayload {
  location: LocationObject;
  normalizedRoute: NormalizedRoute;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const INITIAL_STATE: NavigationProgressState = {
  current: 0,
  progress: 0,
  distanceToNext: null,
  distanceAlong: 0,
  offRoute: false,
  projection: null,
};

const pointsClose = (a: [number, number], b: [number, number]) =>
  Math.abs(a[0] - b[0]) < 1e-6 && Math.abs(a[1] - b[1]) < 1e-6;

const statesEqual = (a: NavigationProgressState, b: NavigationProgressState) =>
  a.current === b.current &&
  Math.abs(a.progress - b.progress) < 0.001 &&
  Math.abs(a.distanceAlong - b.distanceAlong) < 0.5 &&
  (a.distanceToNext === b.distanceToNext ||
    (a.distanceToNext !== null &&
      b.distanceToNext !== null &&
      Math.abs(a.distanceToNext - b.distanceToNext) < 0.5)) &&
  a.offRoute === b.offRoute &&
  ((a.projection === null && b.projection === null) ||
    (a.projection !== null &&
      b.projection !== null &&
      a.projection.segmentIndex === b.projection.segmentIndex &&
      Math.abs(a.projection.ratio - b.projection.ratio) < 0.001 &&
      pointsClose(a.projection.point, b.projection.point)));

export const useNavigationProgress = (
  route: GetRouteResponse | null,
  location: LocationObject | null,
  enabled: boolean,
  onOffRoute?: (payload: OffRouteCallbackPayload) => void,
): NavigationProgressResult => {
  const normalizedRoute = useMemo(
    () => (route ? normalizeRoute(route) : null),
    [route],
  );

  const directions = useMemo(
    () =>
      normalizedRoute?.instructions.map(
        (instruction) => instruction.instruction,
      ) ?? [],
    [normalizedRoute],
  );

  const [state, setState] = useState<NavigationProgressState>(INITIAL_STATE);
  const prevOffRoute = useRef(false);
  const prevDistanceAlongRef = useRef<number | null>(null);
  const prevLocationRef = useRef<LocationObject | null>(null);

  useEffect(() => {
    setState(INITIAL_STATE);
    prevOffRoute.current = false;
    prevDistanceAlongRef.current = null;
    prevLocationRef.current = null;
  }, [enabled, normalizedRoute?.instructions.length]);

  useEffect(() => {
    if (!enabled) return;
    if (!normalizedRoute || !location) return;

    const { polyline, instructions, totalDistanceMeters } = normalizedRoute;
    if (!polyline.length) return;

    const currentCoords: [number, number] = [
      location.coords.longitude,
      location.coords.latitude,
    ];
    const snap = projectOntoPolyline(currentCoords, polyline);

    if (!snap) return;

    const offRoute = snap.distanceToLine > SNAP_FALLOFF_METERS;

    const previousDistance = prevDistanceAlongRef.current;
    const displacement =
      prevLocationRef.current?.coords && location?.coords
        ? distanceInMeters(
            prevLocationRef.current.coords,
            [location.coords.longitude, location.coords.latitude],
          )
        : 0;

    const clampTravel = (delta: number) => delta + 3; // cushion to allow slight detours

    let effectiveDistanceAlong = snap.distanceAlong;
    if (previousDistance !== null) {
      const maxForward = previousDistance + clampTravel(displacement);
      const maxBackward = previousDistance - clampTravel(displacement);
      if (effectiveDistanceAlong > maxForward) {
        effectiveDistanceAlong = maxForward;
      } else if (effectiveDistanceAlong < maxBackward) {
        effectiveDistanceAlong = maxBackward;
      }
      effectiveDistanceAlong = Math.max(
        0,
        Math.min(effectiveDistanceAlong, totalDistanceMeters),
      );
    }

    let projection = {
      segmentIndex: snap.segmentIndex,
      ratio: snap.segmentT,
      point: snap.point as [number, number],
    };

    if (Math.abs(effectiveDistanceAlong - snap.distanceAlong) > 0.25) {
      const interpolated = getPositionAlongPolyline(
        polyline,
        effectiveDistanceAlong,
      );
      if (interpolated) projection = interpolated;
    }

    let nextState: NavigationProgressState;
    if (!instructions.length) {
      nextState = {
        current: 0,
        progress: 0,
        distanceToNext: null,
        distanceAlong: effectiveDistanceAlong,
        offRoute,
        projection,
      };
    } else {
      const distanceAlong = effectiveDistanceAlong;
      let currentIndex = 0;
      for (let i = instructions.length - 1; i >= 0; i--) {
        if (
          distanceAlong + COMPLETION_RADIUS_METERS >=
          instructions[i].cumulativeMeters
        ) {
          currentIndex = i;
          break;
        }
      }

      const nextIndex = Math.min(currentIndex + 1, instructions.length - 1);
      const currentInstruction = instructions[currentIndex];
      const nextInstruction =
        nextIndex > currentIndex ? instructions[nextIndex] : undefined;

      const segmentStart = currentInstruction?.cumulativeMeters ?? 0;
      const segmentEnd = nextInstruction
        ? nextInstruction.cumulativeMeters
        : totalDistanceMeters;

      const progress =
        segmentEnd <= segmentStart
          ? 1
          : clamp(
              (distanceAlong - segmentStart) / (segmentEnd - segmentStart),
              0,
              1,
            );

      const distanceToNext = nextInstruction
        ? Math.max(0, segmentEnd - distanceAlong)
        : 0;

      nextState = {
        current: currentIndex,
        progress,
        distanceToNext,
        distanceAlong,
        offRoute,
        projection,
      };
    }

    if (offRoute && !prevOffRoute.current && onOffRoute) {
      onOffRoute({ location, normalizedRoute });
    }
    prevOffRoute.current = offRoute;
    prevDistanceAlongRef.current = nextState.distanceAlong;
    prevLocationRef.current = location;

    setState((prev) => (statesEqual(prev, nextState) ? prev : nextState));
  }, [enabled, location, normalizedRoute, onOffRoute]);

  return {
    directions,
    normalizedRoute,
    ...state,
  };
};

export default useNavigationProgress;
