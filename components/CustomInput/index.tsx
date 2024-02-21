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
    Container,
    InputHeader,
    InputText,
} from './styles'


export interface Props {
    placeholder: string;
    inputHead: string;
    defaultValue: string;
    onChangeText(text: string) : void;
}


const CustomInput : React.FC<Props> = (props : Props) => {
    const {
        onChangeText,
        inputHead= "text",
        placeholder = "Default Placeholder",
        defaultValue = "",
    } = props;
    
    return (
        <Container>
            <InputHeader>{inputHead}</InputHeader>
            <InputText 
                placeholder={placeholder}
                onChangeText={onChangeText}
                defaultValue= {defaultValue}
            />
        </Container>
    );
};


export default CustomInput;