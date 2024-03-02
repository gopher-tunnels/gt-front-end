import React, { useState, useEffect } from "react";
import { Alert, Dimensions, Text, View } from 'react-native';
import { Container } from "./styles"
import SplashIcon from "../../components/SplashIcon";
const {width, height} = Dimensions.get('window');

export default function Splash () {

    return (
        <Container>
            <SplashIcon iconWidth={width * 0.8} iconHeight={height * 0.8}/>
        </Container>
    )
}