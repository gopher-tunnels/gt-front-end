// import {Marker} from "react-native-maps";
import styled, { css } from "styled-components/native";

export const Container = styled.View<{styleType: 'default' | 'tunnel' | 'skyway' | 'sidewalk'}>`
    padding: 4px 10px;
    background-color: ${({ theme }) => theme.colors.neutral};
    border-radius: 100px;
    border: 1px solid ${({ theme }) => theme.colors.primary4};
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 4px;
    flex-wrap: nowrap;
    position: relative;
    top: 30px;
    align-self: flex-start;
    flex-shrink: 1;

    ${props => props.styleType === 'tunnel' && css`
        background-color: ${({ theme }) => theme.colors.tunnel1};
        border-color: ${({ theme }) => theme.colors.tunnel1};
    `}

    ${props => props.styleType === 'skyway' && css`
        background-color: ${({ theme }) => theme.colors.skyway1};
        border-color: ${({ theme }) => theme.colors.skyway1};
    `}

    ${props => props.styleType === 'sidewalk' && css`
        background-color: ${({ theme }) => theme.colors.sidewalk1};
        border-color: ${({ theme }) => theme.colors.sidewalk1};
    `}

`;

export const ChipText = styled.Text<{styleType: 'default' | 'tunnel' | 'skyway' | 'sidewalk'}>`
    color: ${({ theme }) => theme.colors.primaryMain};
    font-size: 16px;
    text-align: center;

    ${props => props.styleType === 'tunnel' && css`
        font-size: 16px;
        color: ${({ theme }) => theme.colors.tunnel2};
    `}

    ${props => props.styleType === 'skyway' && css`
        font-size: 16px;
        color: ${({ theme }) => theme.colors.skyway2};
    `}

    ${props => props.styleType === 'sidewalk' && css`
        font-size: 16px;
        color: ${({ theme }) => theme.colors.sidewalk2};
    `}
`;

export const Circle = styled.View<{styleType: 'default' | 'tunnel' | 'skyway' | 'sidewalk'}>`
   
    ${props => props.styleType === 'tunnel' && css`
        width: 15px;
    height: 15px;
    border-radius: 10px;
    margin-right: 4px;

        background-color: #E58600;
    `}

    ${props => props.styleType === 'skyway' && css`
        width: 15px;
    height: 15px;
    border-radius: 10px;
    margin-right: 4px; 

        background-color: #9500FF;
    `}

    ${props => props.styleType === 'sidewalk' && css`
        width: 15px;
    height: 15px;
    border-radius: 10px;
    margin-right: 4px;

        background-color: #0CA8FF;
    `}

   
    
`;