import React, { useCallback } from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import Home from "./app/Home";
import { ThemeProvider } from "styled-components/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import fontObject from "./assets/fonts";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import lightTheme from "./styles/themes/light";
import darkTheme from "./styles/themes/dark";

SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
// SplashScreen.setOptions({
//   duration: 1000,
//   fade: true,
// });

export default function App() {
  const [fontsLoaded, fontError] = useFonts(fontObject);
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.gestureRoot}>
        <ThemeProvider theme={theme}>
          <View
            style={[
              styles.container,
              { backgroundColor: theme.colors.neutral },
            ]}
            onLayout={onLayoutRootView}
          >
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
