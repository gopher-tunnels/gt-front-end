import styled from 'styled-components/native';

interface ContainerProps {
  size: number;
}

export const Container = styled.View<ContainerProps>`
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primaryMain};
  aspect-ratio: 1;
  height: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
  border-radius: 50%;
`;
