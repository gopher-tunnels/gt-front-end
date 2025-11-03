import dayjs from "dayjs";
import { Duration } from "dayjs/plugin/duration";

/**
 * @description Calculates the bounding box (southwest and northeast corners) of a set of geographic points.
 *
 * @param {[number, number][]} points - An array of [longitude, latitude] coordinate pairs.
 * @returns {{ ne: [number, number]; sw: [number, number] }} An object containing the northeast and southwest corners of the bounding box.
 *
 * @example
 * ```ts
 * getBoundingBox([
 *   [-122.5, 37.7],
 *   [-122.4, 37.8],
 *   [-122.6, 37.6],
 * ]);
 * // Returns:
 * // {
 * //   ne: [-122.4, 37.8],
 * //   sw: [-122.6, 37.6]
 * // }
 * ```
 */
export const getBoundingBox = (points: [number, number][]) => {
  console.log(points);
  return points.reduce<{
    ne: (typeof points)[number];
    sw: (typeof points)[number];
  }>(
    (acc, curr) => ({
      ne: [Math.max(acc.ne[0], curr[0]), Math.max(acc.ne[1], curr[1])],
      sw: [Math.min(acc.ne[0], curr[0]), Math.min(acc.ne[1], curr[1])],
    }),
    {
      ne: points[0],
      sw: points[0],
    },
  );
};

/**
 * @description Interpolates between two geographic coordinates.
 *
 * @param coord1 - The starting coordinate [longitude, latitude].
 * @param coord2 - The ending coordinate [longitude, latitude].
 * @param t - A value between 0 and 1 representing interpolation progress.
 * @returns The interpolated coordinate as [longitude, latitude].
 */
export const interpolateCoords = (
  coord1: number[],
  coord2: number[],
  t: number,
): number[] => {
  "worklet";
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  const lon = lon1 + (lon2 - lon1) * t;
  const lat = lat1 + (lat2 - lat1) * t;
  return [lon, lat];
};

export const milesToMeters = (miles: number) => 1609.34 * miles;
export const metersToMiles = (meters: number) => meters / 1609.34;

export const secondsToDuration = (seconds: number) => {
  const s = seconds % 60;
  const m = Math.floor(seconds / 60) % 60;
  const h = Math.floor(seconds / 3600);
  return dayjs.duration({ seconds: s, minutes: m, hours: h });
};

export const formatDurationShort = (duration: Duration) => {
  if (duration.get("hours") && duration.get("minutes"))
    return duration.format("h[h]\u00A0m[m]");
  if (duration.get("hours")) return duration.format("h[h]");
  if (duration.get("minutes")) return duration.format("m\u00A0[m]in");
  if (duration.get("seconds") >= 30)
    return duration.format("s\u00A0[s]ec").replace(/\.\d+/, "");
  return "Soon";
};
