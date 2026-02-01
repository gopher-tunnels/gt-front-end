import React, { createContext, useCallback, useRef, useState } from "react";
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
import ToastHost from "./components/ToastHost";
import AnimatedSplashScreen from "./components/SplashScreen";
import { FadeOutDown, SlideOutDown } from "react-native-reanimated";
import LottieView from "lottie-react-native";

SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
// SplashScreen.setOptions({
//   duration: 1000,
//   fade: true,
// });

type ContextType = { setup: boolean; hideSplash: () => void };
export const Context = createContext<ContextType>({
  setup: false,
  hideSplash: () => {},
});

export default function App() {
  const lottieViewRef = useRef<LottieView | null>(null);
  const [setup, setSetup] = useState<ContextType["setup"]>(false);
  const [fontsLoaded, fontError] = useFonts(fontObject);
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  const hideSplash: ContextType["hideSplash"] = () => {
    lottieViewRef.current?.play();
    setSetup(true);
  };

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
      <Context.Provider value={{ setup, hideSplash }}>
        <GestureHandlerRootView style={styles.gestureRoot}>
          <ThemeProvider theme={theme}>
            <View
              style={[
                styles.container,
                { backgroundColor: theme.colors.neutral },
              ]}
              onLayout={onLayoutRootView}
            >
              {!setup && (
                <AnimatedSplashScreen
                  animatedContainerProps={{
                    exiting: FadeOutDown.delay(800).springify(),
                  }}
                  ref={lottieViewRef}
                />
              )}
              <Home />
              <ToastHost />
            </View>
          </ThemeProvider>
        </GestureHandlerRootView>
      </Context.Provider>
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
