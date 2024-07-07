import styled from "styled-components/native";

// export const Container = styled.View`
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 200px;
//     bottom: 0;
//     background-color: red;
// `

export const Container = styled.View`
    position: absolute;
    top: 48px;
    left: 16px;
    right: 16px;
`

export const Bar = styled.View`
    background-color: white;
    padding: 16px 24px;
    border: 1px solid #bc808c;
    border-radius: 32px;
`

export const SearchInput = styled.TextInput`
    font-size: 15px;
    font-weight: 500;
    color: #7A0019;
`

export const SearchResultContainer = styled.View`
    height: 240px;
    background-color: white;
    border: 1px solid #6d6d6d;
    border-top-width: 0;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
`