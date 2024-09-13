import styled from "styled-components/native";
import { TextInput } from "react-native";

export const Container = styled.View`
  margin-left: 16px;
  margin-right: 16px;
`;

export const Bar = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.neutral};
  padding: 14px 24px;
  border: 1px solid;
  border-radius: 32px;
`;

export const SearchInput = styled(TextInput)`
  font-family: PlusJakartaSans-Medium;
  flex: 1;
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primaryMain};
`;

export const SearchResultContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.neutral};
  border: 1px solid ${({ theme }) => theme.colors.gray1};
  border-top-width: 0;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;
