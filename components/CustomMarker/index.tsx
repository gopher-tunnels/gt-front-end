import React, {useState} from "react";
import {View, TouchableOpacity} from 'react-native';
import CustomMark from '../../assets/customMarker.svg';
import MapboxGL from "@rnmapbox/maps";


export interface Props {
    width?: number;
    height?: number;
    coordinate: [number, number];
    popupText?: string;
}


const CustomMarker: React.FC<Props> = (props: Props) => {
    const {
        width = 50,
        height = 50,
        coordinate,
        popupText = "This is a custom marker",
    } = props;

   
    return (
        <MapboxGL.PointAnnotation 
            id="pointAnnotation"
            coordinate={coordinate} 
            anchor={{ x: 0.5, y: 1 }}
            >
            <View style={{ width, height }}>
              <CustomMark width={width} height={height} />
            </View>
        </MapboxGL.PointAnnotation>
      );
};


export default CustomMarker;