import React, { useState } from "react";
import CustomButton from "../components/CustomButton";
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View } from 'react-native';
import CustomInput from "../components/CustomInput";

export interface types {
  newText: string;
}

export default function Home() {
  const [pressed, setPressed] = useState(false);
  const [text, setText] = useState('');
  return (
    <View style={styles.container}>
      <CustomInput
        inputHead="Username"
        placeholder="Text placeholder"
        onChangeText={(newText : string) => {setText(newText)}}
        defaultValue={text}
      />
      <CustomButton
        title="Toggle"
        onPress={() => { pressed ? setPressed(false) : setPressed(true); Alert.alert(text)}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

