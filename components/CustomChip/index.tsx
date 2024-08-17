import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Container, ChipText, Circle } from "./styles";

export interface CustomChipProps {
  label: string;
  onPress?: () => void;
  type?: "default" | "tunnel" | "skyway" | "sidewalk";
}

const CustomChip: React.FC<CustomChipProps> = (props: CustomChipProps) => {
  const { label, onPress, type = "default" } = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <Container styleType={type}>
        <Circle styleType={type} />
        <ChipText styleType={type}>{label}</ChipText>
      </Container>
    </TouchableOpacity>
  );
};

export default CustomChip;
