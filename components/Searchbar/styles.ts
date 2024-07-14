import styled from "styled-components/native";

export const Container = styled.View`
    margin-top: 48px;
    margin-left: 16px;
    margin-right: 16px;
`

export const Bar = styled.View`
    background-color: white;
    padding: 16px 24px;
    border: 1px solid;
    border-radius: 32px;
    shadowOpacity: 0.2;
    shadowRadius: 3px;
    elevation: 20;
`

export const SearchInput = styled.TextInput`
    font-size: 15px;
    font-weight: 500;
    color: ${({theme}) => theme.colors.primaryMain};
`

export const SearchResultContainer = styled.View`
    height: 240px;
    background-color: white;
    border: 1px solid gray;
    border-top-width: 0;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
`
