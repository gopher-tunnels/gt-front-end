import React, { useMemo } from "react";
import { Container } from "./styles";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";
import { StyleProp, ViewStyle } from "react-native";
import { defaultMotiPressableProps } from "../../styles/global";

interface CenterButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  active?: boolean;
}

const CenterButton: React.FC<CenterButtonProps> = ({
  onPress,
  active,
  style,
}) => {
  const theme = useTheme();
  return (
    <Container onPress={onPress} style={style} {...defaultMotiPressableProps}>
      <MaterialIcons
        name={active ? "my-location" : "location-searching"}
        color={theme.colors[active ? "primary5" : "contrast"]}
        size={25}
      />
    </Container>
  );
};

export default CenterButton;
