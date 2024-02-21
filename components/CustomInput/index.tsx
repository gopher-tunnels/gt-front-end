import React from "react";
import { 
    StyleSheet,
    View,
    SafeAreaView,
    Text,
    Alert,
    Pressable,
    TouchableOpacity,
    TextInput, 
} from "react-native";

import {
    // Style imports go here
} from './styles'


export interface Props {
    // Define your prop types here
}


const CustomInput : React.FC<Props> = (props : Props) => {
    const {
        // Define your props here
    } = props;
    
    return (
        <View></View> // Change this as you see fit
    );
};


export default CustomInput;