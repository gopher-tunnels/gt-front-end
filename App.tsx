import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Home from './app/Home';
import { ThemeProvider } from 'styled-components';
import lightTheme from './styles/themes/light';
import Splash from './app/Splash';

export default function App() {
  return (
    // TODO: set up theme switching
    <ThemeProvider theme={lightTheme}>
      <View style={styles.container}>
        <Home/>
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
