import React, { ComponentProps } from "react";
import { View } from "react-native";
import CustomMark from "../../assets/customMarker.svg";
import MapboxGL from "@rnmapbox/maps";

export interface Props
  extends Omit<ComponentProps<typeof MapboxGL.PointAnnotation>, "children"> {
  width?: number;
  height?: number;
  coordinate: [number, number];
  popupText?: string;
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

const CustomMarker: React.FC<Props> = (props: Props) => {
  const { width = 50, height = 50, coordinate, ...otherProps } = props;

  return (
    <MapboxGL.PointAnnotation
      coordinate={coordinate}
      anchor={{ x: 0.5, y: 0.8 }}
      {...otherProps}
    >
      <View style={{ width, height }}>
        <CustomMark width={width} height={height} />
      </View>
    </MapboxGL.PointAnnotation>
  );
};

export default CustomMarker;
