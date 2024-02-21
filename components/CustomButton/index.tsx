import React from "react";
import { 
    StyleSheet,
    View,
    SafeAreaView,
    Text,
    Alert,
    Pressable,
    TouchableOpacity, 
} from "react-native";

import {
    // style imports go here
} from './styles';

export interface Props {
 // Define your prop types here
}


const CustomButton : React.FC<Props> = (props : Props) => {
    const { 
        // put all of your intended props here
    } = props;
    
    return (
        <View></View> // Change chis as you see fit
    );
};


export default CustomButton;