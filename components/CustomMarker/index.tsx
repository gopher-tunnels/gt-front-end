import React from "react";
import { Pressable } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import CustomMark from "../../assets/images/customMarker.svg";
import { MotiView } from "moti";

export interface Props {
  id: string;
  width?: number;
  height?: number;
  coordinate: [number, number];
  delay?: number;
  onSelected?: (id: string) => void;
  selected?: boolean;
}

/**
 * @description A custom marker
 *
 * @param {number} width - The width of the marker, defaults to 50 and should be equal to height otherwise will cause problems
 * @param {number} height - The height of the marker, defaults to 50 and should be equal to width otherwise will cause problems
 * @param {[number, number]} coordinate - The coordinates where the marker will show up on the map, takes array of two numbers
 * @param {string} popupText - popup text (Can't figure out what this does)
 *
 * @returns {React.FC<CustomChipProps>} TSX React Functional Component
 *
 * @example
 * ```tsx
 * <CustomMarker
 *   coordinate={building.coordinates}
 *   id={building.id}
 *   key={building.id}
 *   onSelected={() => {
 *     if (!onRoute) adjustMapToRoute(building);
 *   }}
 *   onDeselected={() => {
 *     if (!onRoute) setDestination(null);
 *   }}
 * />
 * ```
 */

const CustomMarker: React.FC<Props> = ({
  id,
  width = 50,
  height = 50,
  coordinate,
  delay = 80,
  onSelected,
  selected,
}) => {
  const handlePress = React.useCallback(() => {
    onSelected?.(id);
  }, [id, onSelected, selected]);

  return (
    <MapboxGL.MarkerView
      isSelected={selected}
      coordinate={coordinate}
      anchor={{ x: 0.5, y: 0.8 }}
      allowOverlap
    >
      <Pressable onPress={handlePress} hitSlop={12}>
        <Animated.View
          entering={FadeInUp.springify().delay(delay)}
          exiting={FadeOutUp.springify()}
        >
          <MotiView
            style={{
              width,
              height,
              transformOrigin: "bottom",
            }}
            animate={{
              transform: [{ scale: selected ? 1.3 : 1 }],
            }}
          >
            <CustomMark width={width} height={height} />
          </MotiView>
        </Animated.View>
      </Pressable>
    </MapboxGL.MarkerView>
  );
};

export default CustomMarker;
