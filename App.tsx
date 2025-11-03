import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import Home from "./app/Home";
import { ThemeProvider } from "styled-components/native";
import lightTheme from "./styles/themes/light";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import fontObject from "./assets/fonts";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
// SplashScreen.setOptions({
//   duration: 1000,
//   fade: true,
// });

export default function App() {
  const [fontsLoaded, fontError] = useFonts(fontObject);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    // TODO: set up theme switching
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.gestureRoot}>
        <ThemeProvider theme={lightTheme}>
          <View style={styles.container} onLayout={onLayoutRootView}>
            <Home />
          </View>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
