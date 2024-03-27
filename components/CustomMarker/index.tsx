import React from "react";
import {View} from 'react-native';
import CustomMark from '../../assets/customMarker.svg';

export interface Props {
    width: number;
    height: number;
}

const CustomMarker: React.FC<Props> = (props: Props) => {
    const {
        width = 80,
        height = 80,
    } = props;
    return (
        <View>
            <CustomMark width={width} height={height}/>
        </View>
    );
};

export default CustomMarker;