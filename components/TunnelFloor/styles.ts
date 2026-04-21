import styled from "styled-components/native";

export const MarkerContainer = styled.View<{ bgColor: string }>`
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: ${({ bgColor }) => bgColor};
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.neutral};
`;

export const FloorLabel = styled.Text`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.neutral};
`;
