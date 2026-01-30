import { MotiView } from "moti";
import styled from "styled-components/native";

export const Container = styled(MotiView)`
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.5);
  
`;

export const Content = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.neutral};
  border-radius: 16px;
  padding-vertical: 24px;
  padding-horizontal: 16px;
  gap: 18px;
`;


