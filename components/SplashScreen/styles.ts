import Animated from "react-native-reanimated";
import styled from "styled-components/native";

export const Container: Animated.View = styled(Animated.View)`
  position: absolute;
  z-index: 99999;
  flex: 1;
  height: 100%;
  width: 100%;
  place-content: center;
  place-items: center;
  background-color: ${({ theme }) => theme.colors.splash};
`;
