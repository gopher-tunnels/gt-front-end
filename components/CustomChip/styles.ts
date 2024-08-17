// import {Marker} from "react-native-maps";
import styled, { css } from "styled-components/native";

export const Container = styled.View<{
  styleType: "default" | "tunnel" | "skyway" | "sidewalk";
}>`
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
  flex-shrink: 1;

  ${(props) =>
    props.styleType === "tunnel" &&
    css`
      background-color: ${({ theme }) => theme.colors.tunnel1};
      border-color: ${({ theme }) => theme.colors.tunnel1};
    `}

  ${(props) =>
    props.styleType === "skyway" &&
    css`
      background-color: ${({ theme }) => theme.colors.skyway1};
      border-color: ${({ theme }) => theme.colors.skyway1};
    `}

    ${(props) =>
    props.styleType === "sidewalk" &&
    css`
      background-color: ${({ theme }) => theme.colors.sidewalk1};
      border-color: ${({ theme }) => theme.colors.sidewalk1};
    `}
`;

export const ChipText = styled.Text<{
  styleType: "default" | "tunnel" | "skyway" | "sidewalk";
}>`
  color: ${({ theme }) => theme.colors.primaryMain};
  font-size: 16px;
  text-align: center;
  font-family: PlusJakartaSans-Medium;

  ${(props) =>
    props.styleType === "tunnel" &&
    css`
      color: ${({ theme }) => theme.colors.tunnel2};
    `}

  ${(props) =>
    props.styleType === "skyway" &&
    css`
      color: ${({ theme }) => theme.colors.skyway2};
    `}

    ${(props) =>
    props.styleType === "sidewalk" &&
    css`
      color: ${({ theme }) => theme.colors.sidewalk2};
    `}
`;

export const Circle = styled.View<{
  styleType: "default" | "tunnel" | "skyway" | "sidewalk";
}>`
  ${(props) =>
    props.styleType === "tunnel" &&
    css`
      width: 15px;
      height: 15px;
      border-radius: 10px;
      margin-right: 4px;

      background-color: #e58600;
    `}

  ${(props) =>
    props.styleType === "skyway" &&
    css`
      background-color: #9500ff;
    `}

    ${(props) =>
    props.styleType === "sidewalk" &&
    css`
      background-color: #0ca8ff;
    `}
`;
