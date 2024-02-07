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


export interface Props {
    onPress(): void;
    title : string;
}


const CustomButton : React.FC<Props> = (props : Props) => {
    const { onPress, title = "Default button"} = props;
    return (
        <TouchableOpacity
            style={styles.button}
            onPress={onPress}
            >
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        paddingHorizontal: 32,
        backgroundColor: "#a881af",
        borderRadius: 10,
    },

    text: {
        fontSize:20,
        fontWeight:"800",
    }
});

export default CustomButton;