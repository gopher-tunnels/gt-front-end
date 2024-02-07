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


export interface Props {
    placeholder: string;
    inputHead: string;
    onChangeText(): void;
}


const CustomInput : React.FC<Props> = (props : Props) => {
    const {onChangeText, inputHead= "text", placeholder = "Default Placeholder"} = props
    return (
        <View style={styles.container}>
            <Text style={styles.inputHeader}>{inputHead}</Text>
            <TextInput 
                style= {styles.input}
                placeholder={placeholder}
                onChangeText={onChangeText}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 300
    },
    inputHeader: {
        fontWeight:"600"
    },
    input: {
        borderColor: "gray",
        width: "100%",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
    }
});

export default CustomInput;