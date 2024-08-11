import styled from "styled-components/native";

export const Container = styled.View`
    margin-top: 48px;
    margin-left: 16px;
    margin-right: 16px;
`

export const Bar = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: ${({theme}) => theme.colors.neutral};
    padding: 16px 24px;
    border: 1px solid;
    border-radius: 32px;
`

export const MagnifyingGlass = styled.Image`
    width: 24px;
    height: 24px;
    margin-right: 16px;
`

export const SearchInput = styled.TextInput`
    flex: 1;
    font-size: 15px;
    font-weight: 500;
    color: ${({theme}) => theme.colors.primaryMain};
`

export const SearchResultContainer = styled.View`
    background-color: ${({theme}) => theme.colors.neutral};
    border: 1px solid ${({theme}) => theme.colors.gray1};
    border-top-width: 0;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
`
