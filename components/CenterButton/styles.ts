import styled from "styled-components/native";

export const Container = styled.Pressable`
  background-color: ${({ theme }) => theme.colors.neutral};
  border-radius: 10px;
  aspect-ratio: 1;
  align-items: center;
  justify-content: center;
  height: 50px;
  padding: 10px;
`;
