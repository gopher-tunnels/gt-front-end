import React from 'react';
import { Dimensions, View } from 'react-native';
import Icon from '../../assets/splashIcon.svg';

const {width, height} = Dimensions.get('window');

export interface Props {
    iconWidth: number;
    iconHeight: number;
}

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
