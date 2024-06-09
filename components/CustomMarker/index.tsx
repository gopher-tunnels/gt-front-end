import React from "react";
import {View} from 'react-native';
import CustomMark from '../../assets/customMarker.svg';

export interface Props {
    width: number;
    height: number;
}

const CustomMarker: React.FC<Props> = (props: Props) => {
    const {
        width = 50,
        height = 50,
    } = props;
    return (
        <View>
            <CustomMark width={width} height={height}/>
        </View>
    );
};

export default CustomMarker;