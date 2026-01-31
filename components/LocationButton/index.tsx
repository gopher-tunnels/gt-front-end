import React from 'react';
import { View } from 'react-native';
import UserButton from '../../assets/images/userButton.svg';

export interface Props {
    width: number;
    height: number;
}

/**
 * Unused, doesn't even look like a button
 */

const LocationButton: React.FC<Props> = (props: Props) => {
    const { 
      width = 56,
      height = 56,
    } = props;
    return (
    <View>
      <UserButton width={width} height={height}/>
    </View>
  );
};

export default LocationButton;
