import React from  "react";
import MapboxGL from "@rnmapbox/maps";
import { useTheme } from "styled-components/native";

// Example usage, place in <MapboxGL.MapView>:
// <PathComponent coordinates={coords}/>


interface PathComponentProps {
    coordinates: number[][];
    lineColor?: string;
    lineWidth?: number;
  }


  const PathComponent: React.FC<PathComponentProps> = ({
    coordinates,
    lineColor,
    lineWidth = 6,
  }) => {
    const theme = useTheme();
    const color = lineColor || theme.colors.tunnel2;  // use input color or default tunnel color
    return (
      <MapboxGL.ShapeSource
        id="shapeSource"
        hitbox={{ width: 0, height: 0 }}
        shape={{
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordinates,
          },
        }}
      >
        <MapboxGL.LineLayer
          id="lineLayer"
          style={{
            lineCap: "round",
            lineJoin: "round",
            lineColor: color,
            lineWidth: lineWidth,
          }}
        />
      </MapboxGL.ShapeSource>
    );
  };
  
  export default PathComponent;