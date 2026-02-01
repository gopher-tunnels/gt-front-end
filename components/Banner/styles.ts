import Animated from "react-native-reanimated";
import styled from "styled-components/native";

export const Container = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 25px 20px;
  background-color: ${({ theme }) => theme.colors.error}f2;
  flex-direction: row;
  gap: 15px;
  align-items: center;
  z-index: 999999999;
  overflow: hidden;
`;

export const TextContainer = styled.View`
  flex-direction: column;
  flex: 1;
`;

export const SideContainer = styled.View`
  position: relative;
  flex-direction: row;
`;
