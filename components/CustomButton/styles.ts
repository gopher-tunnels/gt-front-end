import { MotiView } from "moti";
import styled from "styled-components/native";

interface ContainerProps {
  variant?: "filled" | "outlined";
  loading?: boolean;
}

export const Container = styled.Pressable<ContainerProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${({ variant, theme }) =>
    variant === "outlined" ? "transparent" : theme.colors.primaryMain};
  border: ${({ variant, theme }) =>
    variant === "outlined" ? `1px solid ${theme.colors.primaryMain}` : "none"};
  /* max-width: 360px; */
  height: 48px;
  border-radius: 8px;
  gap: ${({ loading }) => (loading ? 12 : 8)}px;
`;

export const MaskWrapper = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.6);
`;

export const Mask = styled(MotiView)`
  background-color: rgba(0, 0, 0, 1);
  width: 100%;
  height: 100%;
  transform-origin: left;
`;
