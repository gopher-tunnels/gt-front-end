import React from "react";
import { TouchableOpacityProps } from "react-native";
import { Container, ChipText, Circle } from "./styles";

interface CustomChipProps extends TouchableOpacityProps {
  label: string;
  type?: "default" | "tunnel" | "skyway" | "sidewalk";
}

// TODO: make better? Why do the param types not show up when hover over component

/**
 * @description A touchable container with styles for different paths
 *
 * @param {string} label - The label that appears on the chip
 * @param {"default" | "tunnel" | "skyway" | "sidewalk"} type - Types that have different styles / colors for the chip
 * 
 * @returns {React.FC<CustomChipProps>} TSX React Functional Component
 *
 * @example
 * ```tsx
 * <CustomChip label="Tunnel" type="tunnel"/>
 * ```
 */

const CustomChip: React.FC<CustomChipProps> = (props: CustomChipProps) => {
  const { label, type = "default", ...touchableOpacityProps } = props;
  return (
    <Container type={type} {...touchableOpacityProps}>
      {type !== "default" && <Circle type={type} />}
      <ChipText type={type}>{label}</ChipText>
    </Container>
  );
};

export default CustomChip;
