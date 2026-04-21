import React, { useMemo } from "react";
import MapboxGL from "@rnmapbox/maps";
import { useTheme } from "styled-components/native";
import type { GetRouteResponse } from "../../@types/api";
import { MarkerContainer, FloorLabel } from "./styles";

type Step = GetRouteResponse["steps"][number];

const VISIBLE_NODE_TYPES = new Set(["elevator", "building_node"]);

export interface TunnelFloorProps {
  steps: Step[];
}

const TunnelFloor: React.FC<TunnelFloorProps> = ({ steps }) => {
  const { colors } = useTheme();

  console.log("TunnelFloor steps:", steps.length, steps.map(s => ({ nodeType: s.nodeType, floor: s.floor })));

  const markers = useMemo(() => {
    const seen = new Set<string>();
    return steps.filter((step) => {
      const nodeType = step.nodeType?.toLowerCase();
      if (!VISIBLE_NODE_TYPES.has(nodeType)) return false;
      if (!step.floor) return false;
      // dedupe by coordinate + floor so overlapping steps don't stack
      const key = `${step.longitude},${step.latitude},${step.floor}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [steps]);

  const colorForNode = (nodeType: string): string => {
    if (nodeType?.toLowerCase() === "elevator") return colors.skyway2;
    return colors.tunnel2;
  };

  if (!markers.length) return null;

  return (
    <>
      {markers.map((step) => (
        <MapboxGL.MarkerView
          key={`floor-${step.id}`}
          coordinate={[step.longitude, step.latitude]}
          anchor={{ x: 0.5, y: 0.5 }}
          allowOverlap
        >
          <MarkerContainer bgColor={colorForNode(step.nodeType)}>
            <FloorLabel>{step.floor}</FloorLabel>
          </MarkerContainer>
        </MapboxGL.MarkerView>
      ))}
    </>
  );
};

export default TunnelFloor;
