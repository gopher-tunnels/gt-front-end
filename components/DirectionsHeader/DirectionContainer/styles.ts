import styled from 'styled-components/native';
import { MotiText, MotiView } from 'moti';

interface ContainerProps {
  nextVariant: boolean;
}

interface LabelProps {
  nextVariant: boolean;
}

export const Container = styled(MotiView)<ContainerProps>`
  padding: 0 10px;
  align-items: center;
  /* width: 90%;
  height: 80px; */
  /* width: ${({ nextVariant }) => (nextVariant ? 'content' : '100%')};
  height: ${({ nextVariant }) => (nextVariant ? '40px' : '80px')}; */
  /* background-color: ${({ theme }) => theme.colors.secondary3}cc; */
  background-color: ${({ theme, nextVariant }) =>
    nextVariant ? theme.colors.secondary3 + 'cc' : theme.colors.secondaryMain};
  /* border-radius: ${({ nextVariant }) => (nextVariant ? '10px' : '20px')}; */
  flex-direction: row;
  overflow: hidden;
  transform-origin: right;
  /* transform: scale(${({ nextVariant }) => (nextVariant ? 1 : 1)}); */
`;

export const Progress = styled(MotiView)`
  background-color: ${({ theme }) => theme.colors.secondaryMain};
  width: 106.5%;
  height: 80px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  transform-origin: left;
`;

export const Label = styled(MotiText)<LabelProps>`
  color: ${({ theme }) => theme.colors.primaryMain};
  z-index: 10;
  text-align: center;
  font-family: 'PlusJakartaSans-Bold';
  font-weight: bold;
  overflow: hidden;
  transform-origin: left;

  text-align-vertical: center;
`;
