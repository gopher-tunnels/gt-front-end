import styled from "styled-components/native";
import { MotiText, MotiView } from "moti";

interface ContainerProps {
  nextVariant: boolean;
}

export const Container = styled(MotiView)<ContainerProps>`
  padding: 10px;
  align-items: center;
  background-color: ${({ theme, nextVariant }) =>
    nextVariant ? theme.colors.secondary3 + "cc" : theme.colors.secondaryMain};
  flex-direction: row;
  overflow: hidden;
  transform-origin: right;
`;

export const Progress = styled(MotiView)`
  background-color: ${({ theme }) => theme.colors.secondaryMain};
  width: 106.5%;
  height: 200%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  transform-origin: left;
`;

export const LeadingLabel = styled(MotiText)`
  color: ${({ theme }) => theme.colors.primaryMain};
  z-index: 10;
  text-align: center;
  font-family: "PlusJakartaSans-Bold";
  font-weight: bold;
`;

export const InstructionLabel = styled(MotiText)`
  flex: 1;
  color: ${({ theme }) => theme.colors.primaryMain};
  z-index: 10;
  text-align: left;
  font-family: "PlusJakartaSans-Bold";
  font-weight: bold;
  transform-origin: left;
  text-align-vertical: center;
`;
