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
 * @description A touchable container with styles for different paths
 *
 * @param {string} label - The label that appears on the chip
 * @param {"default" | "tunnel" | "skyway" | "sidewalk"} type - Types that have different styles / colors for the chip from "default", "tunnel", "skyway" or "sidewalk"
 * 
 * @returns {React.FC<CustomChipProps>} TSX React Functional Component
 *
 * @example
 * ```tsx
 * <CustomChip label="Tunnel" type="tunnel"/>
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
