import React from "react";
import LottieView from "lottie-react-native";

export default function Animation() {
  return (
    <LottieView
      source={require("../../assets/loader.json")}
      style={{width: "100%", height: "100%"}}
      autoPlay
      loop
    />
  );
}

  