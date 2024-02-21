import React, { useState } from "react";
import CustomButton from "../../components/CustomButton";
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View } from 'react-native';
import CustomInput from "../../components/CustomInput";
import { 
  // Import your styles here
} from './styles'


export interface types {
  // Define types here
}

export default function Home() {
  // Place your states here: Example
  // const [pressed, setPressed] = useState(false);
  // const [text, setText] = useState('');
  return (
    <View>
      <CustomInput></CustomInput> 
      <CustomButton></CustomButton> 
    </View>
  );
};

