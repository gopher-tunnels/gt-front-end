import React from  "react";
import MapboxGL from "@rnmapbox/maps";

interface PathComponentProps {
    coordinates: number[][];
    lineColor?: string;
    lineWidth?: number;
  }

  const PathComponent: React.FC<PathComponentProps> = ({
    coordinates,
    lineColor = "#0ca8ff",
    lineWidth = 6,
  }) => {
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
            lineColor: lineColor,
            lineWidth: lineWidth,
          }}
        />
      </MapboxGL.ShapeSource>
    );
  };
  
  export default PathComponent;