import React from "react";
import { Container, ChipText, Circle } from "./styles";
import { MotiPressableProps } from "moti/interactions";
import { defaultMotiPressableProps } from "../../styles/global";

interface CustomChipProps extends MotiPressableProps {
  label: string;
  type?: "default" | "tunnel" | "skyway" | "sidewalk";
  interactive?: boolean;
}

/**
 * @description A touchable container with styles for different paths
 *
 * @param {string} label - The label that appears on the chip
 * @param {"default" | "tunnel" | "skyway" | "sidewalk"} type - Types that have different styles / colors for the chip, must be "default", "tunnel", "skyway", "sidewalk" or undefined
 *
 * @returns {React.FC<CustomChipProps>} TSX React Functional Component
 *
 * @example
 * ```tsx
 * <CustomChip label="Tunnel" type="tunnel"/>
 * ```
 */

const CustomChip: React.FC<CustomChipProps> = ({
  label,
  type = "default",
  interactive = true,
  ...motiPressableProps
}) => {
  return (
    <Container
      type={type}
      {...(interactive ? defaultMotiPressableProps : {})}
      {...motiPressableProps}
    >
      {type !== "default" && <Circle type={type} />}
      <ChipText type={type}>{label}</ChipText>
    </Container>
  );
};

export default CustomChip;
