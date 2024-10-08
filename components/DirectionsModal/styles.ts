import styled from "styled-components/native";

export const Container = styled.View`
  gap: 8px;
  padding: 16px;
  padding-bottom: 0;
`;

export const Content = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.neutral};
  border-radius: 16px;
  padding: 16px;
  gap: 8px;
`;

export const LegendContainer = styled.View`
  flex-direction: row;
  gap: 4px;
`;

export const PreNavContainer = styled.View`
  /* gap: 24px; */
`;

export const InfoContainer = styled.View`
  gap: 8px;
  overflow: hidden;
`;

export const NavInfoContainer = styled.View`
  gap: 8px;
`;

export const HeadingContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

export const IconTextContainer = styled.View`
  flex-direction: row;
  gap: 3rem;
  align-items: center;
`;
