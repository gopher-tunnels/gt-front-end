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
