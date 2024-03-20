import MapView, { Marker } from "react-native-maps";
import styled from "styled-components/native";

export const Container = styled.View`
    flex: 1;
    width: 100%;
    height: 100%;
`;

export const Map = styled(MapView)`
    flex:1;
    width: 100%;
    height: 100%;
`

export const LocButton = styled(Marker)`
    align-items: center;
    align-self: center;
`

