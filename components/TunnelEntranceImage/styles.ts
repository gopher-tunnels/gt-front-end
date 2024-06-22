import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        margin: 10,
        backgroundColor: '#fff', 
        padding: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    image: {
        width: 250,
        height: 150,
        borderRadius: 5
    },
    description: {
        marginTop: 5,
        fontSize: 16,
        color: '#333' 
    }
});