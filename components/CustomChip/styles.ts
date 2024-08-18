import styled, { css } from "styled-components/native";
import { ComponentProps } from "react";
import CustomChip from ".";

interface CommonProps {
  type: ComponentProps<typeof CustomChip>["type"];
}

export const Container = styled.TouchableOpacity<CommonProps>`
  padding: 6px 12px;
  background-color: ${({ theme }) => theme.colors.neutral};
  border-radius: 100px;
  border: 1px solid ${({ theme }) => theme.colors.primary3};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  position: relative;
  align-self: flex-start;

  ${(props) =>
    props.type !== "default" &&
    css`
      background-color: ${({ theme }) => theme.colors[`${props.type}1`]};
      border-color: ${({ theme }) => theme.colors[`${props.type}1`]};
    `}
`;

export const ChipText = styled.Text<CommonProps>`
  color: ${({ theme }) => theme.colors.primaryMain};
  font-size: 16px;
  text-align: center;
  font-family: PlusJakartaSans-Medium;

  ${(props) =>
    props.type !== "default" &&
    css`
      color: ${({ theme }) => theme.colors[`${props.type}2`]};
    `}
`;

export const Circle = styled.View<CommonProps>`
  width: 15px;
  aspect-ratio: 1;
  border-radius: 50%;
  margin-right: 4px;
  ${(props) =>
    props.type === "tunnel" &&
    css`
      background-color: #e58600;
    `}

  ${(props) =>
    props.type === "skyway" &&
    css`
      background-color: #9500ff;
    `}

    ${(props) =>
    props.type === "sidewalk" &&
    css`
      background-color: #0ca8ff;
    `}
`;
