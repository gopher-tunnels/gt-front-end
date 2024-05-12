import MapView, { Marker } from 'react-native-maps';
import styled from 'styled-components/native';

//TODO: reverse
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

export const Content = styled.SafeAreaView`
  z-index: 1;
  flex: 1;
  width: 100%;
  height: 100%;
  position: absolute;
`;

export const LocButton = styled(Marker)`
  align-items: center;
  align-self: center;
`;
