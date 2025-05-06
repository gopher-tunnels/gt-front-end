import React, { useEffect, useState } from "react";
import MapboxGL from "@rnmapbox/maps";
import { useTheme } from "styled-components/native";
import {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { interpolateCoords } from "../../utils/functions";

// Example usage, place in <MapboxGL.MapView>:
// <PathComponent coordinates={coords}/>

interface PathComponentProps {
  coordinates: number[][];
  lineColor?: string;
  lineWidth?: number;
}

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
  coordinates,
  lineColor,
  lineWidth = 6,
}) => {
  const theme = useTheme();
  const progress = useSharedValue(0);
  const [lineDataCoordinates, setLineDataCoordinates] = useState<number[][]>(
    [],
  );
  const color = lineColor || theme.colors.tunnel2; // use input color or default tunnel color

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: 1000,
      easing: Easing.bezier(0.75, 0, 0.25, 1), // cubic-bezier(0.75, 0, 0.25, 1) (intense ease-in-out)
    });
  }, []);

  // current coordinates array based on `progress`
  const animatedCoords = useDerivedValue(() => {
    const totalPoints = coordinates.length;
    const totalSegments = totalPoints - 1;

    const totalProgress = progress.value * totalSegments;
    const currentIndex = Math.floor(totalProgress);
    const segmentProgress = totalProgress - currentIndex;

    const coords = coordinates.slice(0, currentIndex + 1);

    if (currentIndex < totalSegments) {
      const interp = interpolateCoords(
        coordinates[currentIndex],
        coordinates[currentIndex + 1],
        segmentProgress,
      );
      coords.push(interp);
    }

    return coords;
  });
  // updates `lineDataCoordinates` on `animatedCoords` change
  useAnimatedReaction(
    () => animatedCoords.value,
    (coords) => {
      runOnJS(setLineDataCoordinates)(coords);
    },
  );
  return (
    <MapboxGL.ShapeSource
      id="shapeSource"
      hitbox={{ width: 0, height: 0 }}
      shape={{
        type: "Feature",
        properties: { color },
        geometry: { type: "LineString", coordinates: lineDataCoordinates },
      }}
    >
      <MapboxGL.LineLayer
        id="lineLayer"
        style={{
          lineCap: "round",
          lineJoin: "round",
          lineColor: ["get", "color"],
          lineWidth: lineWidth,
        }}
      />
    </MapboxGL.ShapeSource>
  );
};

export default PathComponent;
