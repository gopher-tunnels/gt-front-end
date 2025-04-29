import React, { ComponentProps } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import UserMarker from '../../assets/userMarker.svg';
import MapboxGL from '@rnmapbox/maps';

export interface Props {
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Custom location marker for user location on map
 * @param {number} width - Width of the marker
 * @param {number} height - Height of the marker
 * @returns {JSX.Element} - Custom location marker
 */


const LocationMarker: React.FC<Props> = (props: Props) => {
    const { 
      width = 56,
      height = 56,
      style,
    } = props;
    return (
        <View style={style}>
          <UserMarker width={width} height={height}/>
        </View>
  );
};

export default LocationMarker;
