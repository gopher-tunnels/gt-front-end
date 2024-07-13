// import {Marker} from "react-native-maps";
import styled, { css } from "styled-components/native";

export const Container = styled.View<{styleType: 'default' | 'tunnel' | 'skyway' | 'sidewalk'}>`
    padding: 4px 10px;
    background-color: #FFFFFF;
    border-radius: 100px;
    border: 1px solid #BC808C;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 4px;
    flex-wrap: nowrap;
    position: relative;
    top: 30px;

    ${props => props.styleType === 'tunnel' && css`
        background-color: #FFF5E6;
        border-color: #FFF5E6;
    `}

    ${props => props.styleType === 'skyway' && css`
        background-color: #F4E5FF;
        border-color: #F4E5FF;
    `}

    ${props => props.styleType === 'sidewalk' && css`
        background-color: #DFF4FF;
        border-color: #DFF4FF;
    `}

`;

export const ChipText = styled.Text<{styleType: 'default' | 'tunnel' | 'skyway' | 'sidewalk'}>`
    color: #7A0019;
    font-size: 16px;
    text-align: center;

    ${props => props.styleType === 'tunnel' && css`
        font-size: 16px;
        color: #E58600;
    `}

    ${props => props.styleType === 'skyway' && css`
        font-size: 16px;
        color: #9500FF;
    `}

    ${props => props.styleType === 'sidewalk' && css`
        font-size: 16px;
        color: #0CA8FF;
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