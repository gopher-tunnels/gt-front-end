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
    shadowOpacity: 0.2;
    shadowRadius: 3px;
    elevation: 20;
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

export const BuildingButton = styled.View`
    width: 100%;
    height: 80px;
    padding: 24px;
    display: flex;
    flex-direction: row;
`

export const BuildingIcon = styled.Image`
    width: 16px;
    height: 16px;
    margin-right: 16px;
`

export const BuildingTextContainer = styled.View`
    flex: 1;
`

export const BuildingName = styled.Text`
    font-size: 16px;
    font-weight: 600;
    line-height: 20.16px;
    color: ${({theme}) => theme.colors.primary5};
    `

export const BuildingAddress = styled.Text`
    font-size: 16px;
    font-weight: 500;
    line-height: 20.16px;
    height: 20.16px;
    color: ${({theme}) => theme.colors.gray1};
`
