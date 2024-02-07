import React, { useState } from "react";
import CustomButton from "../components/CustomButton";
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View } from 'react-native';
import CustomInput from "../components/CustomInput";

export default function Home() {
  const [pressed, setPressed] = useState(false);
  return (
    <View style={styles.container}>
      <CustomInput
        inputHead="Username"
        placeholder="Text placeholder"
        onChangeText={() => {}}
      />
      <CustomButton
        onPress={() => { pressed ? setPressed(false) : setPressed(true); if (pressed) { Alert.alert("true")} else {Alert.alert("false")}}}
        title="Toggle"
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

