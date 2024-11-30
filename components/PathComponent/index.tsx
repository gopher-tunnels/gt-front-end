import React from  "react";
import MapboxGL from "@rnmapbox/maps";
import { useTheme } from "styled-components/native";

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
    const color = lineColor || theme.colors.tunnel2;
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