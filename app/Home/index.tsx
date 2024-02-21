import React, { useState } from "react";
import CustomButton from "../../components/CustomButton";
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View } from 'react-native';
import CustomInput from "../../components/CustomInput";
import { Container } from './styles'


export interface types {
  newText: string;
}

export default function Home() {
  const [pressed, setPressed] = useState(false);
  const [text, setText] = useState('');
  return (
    <Container>
      <CustomInput
        inputHead="Username"
        placeholder="Text placeholder"
        onChangeText={(newText : string) => {setText(newText)}}
        defaultValue={text}
      />
      <CustomButton
        title="Toggle"
        onPress={() => { pressed ?
          setPressed(false) : setPressed(true);
          Alert.alert(text)}}
      />
    </Container>
  );
};

