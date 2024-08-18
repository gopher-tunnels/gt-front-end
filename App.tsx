import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Home from './app/Home';
import { ThemeProvider } from 'styled-components';
import lightTheme from './styles/themes/light';
import Splash from './app/Splash';
import { useFonts } from 'expo-font';
import { useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import fontObject from './assets/fonts';

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
    <ThemeProvider theme={lightTheme}>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <Home />
      </View>
    </ThemeProvider>
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
