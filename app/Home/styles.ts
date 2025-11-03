import MapView, { Marker } from "react-native-maps";
import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
  position: relative;
`;

export const Map = styled(MapView)`
  flex: 1;
  width: 100%;
  height: 100%;
  position: relative;
`;

export const Content = styled.View`
  z-index: 1;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  justify-content: space-between;
`;

export const LocButton = styled(Marker)`
  align-items: center;
  align-self: center;
`;

export const CustomMark = styled(Marker)`
  align-items: center;
  align-self: center;
`;
