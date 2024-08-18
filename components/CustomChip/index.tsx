import React from "react";
import { TouchableOpacityProps } from "react-native";
import { Container, ChipText, Circle } from "./styles";

interface CustomChipProps extends TouchableOpacityProps {
  label: string;
  type?: "default" | "tunnel" | "skyway" | "sidewalk";
}

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
