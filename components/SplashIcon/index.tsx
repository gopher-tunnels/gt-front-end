import React from 'react';
import { Dimensions, View } from 'react-native';
import Icon from '../../assets/splashIcon.svg';

const {width, height} = Dimensions.get('window');

export interface Props {
    iconWidth: number;
    iconHeight: number;
}

/**
 * @description A styled search bar with text input
 *
 * @param {number} iconHeight - the height of the splash icon
 * @param {number} iconWidth - the width of the splash icon
 * 
 * @returns {React.FC<CustomChipProps>} TSX React Functional Component
 *
 * @example
 * ```tsx
 * <SplashIcon iconWidth={width * 0.6} iconHeight={height * 0.6}/>
 * ```
 */

const SplashIcon: React.FC<Props> = (props: Props) => {
    const { 
      iconWidth = width * 0.8,
      iconHeight = height * 0.8,
    } = props;
    return (
    <View>
      <Icon width={iconWidth} height={iconHeight}/>
    </View>
  );
};

export default SplashIcon;
