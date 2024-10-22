import React from "react";
import { Container } from "./styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTheme } from "styled-components/native";
import { StyleProp, ViewStyle } from "react-native";
import { DirectionsHeaderProps } from "../..";

const icons: Record<
  DirectionsHeaderProps["directions"][number],
  React.ComponentProps<typeof MaterialIcons>["name"]
> = {
  right: "turn-right",
  left: "turn-left",
  forward: "arrow-upward",
  enter: "login",
};

interface IndicatorProps {
  step: DirectionsHeaderProps["directions"][number];
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const Indicator: React.FC<IndicatorProps> = ({ step, size = 64, ...props }) => {
  const theme = useTheme();
  return (
    <Container size={size ?? 64} {...props}>
      <MaterialIcons
        name={icons[step]}
        color={theme.colors.secondaryMain}
        size={(size ?? 64) * (3 / 4)}
      />
    </Container>
  );
};

export default Indicator;
