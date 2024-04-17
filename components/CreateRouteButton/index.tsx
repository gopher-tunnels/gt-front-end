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
    Container,
    ButtonText,
} from './styles';

export interface Props {
    onPress(): void;
    title : string;
}


const CreateRouteButton : React.FC<Props> = (props : Props) => {
    const { 
        onPress,
        title = "Default button",
    } = props;
    
    return (
        <Container onPress={onPress}>
            <ButtonText>{title}</ButtonText>
        </Container>
    );
};


export default CreateRouteButton;