import styled from "styled-components/native";

export const Container = styled.TouchableOpacity`
  width: 100%;
  height: 80px;
  padding: 24px;
  display: flex;
  flex-direction: row;
`;

export const BuildingIcon = styled.Image`
  margin-top: 2px;
  width: 16px;
  height: 16px;
  margin-right: 16px;
`;

export const BuildingTextContainer = styled.View`
  flex: 1;
`;

export const BuildingName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary5};
`;

export const BuildingAddress = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray1};
`;
