import React from "react";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "styled-components/native";

const ToastHost = () => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = useTheme();

  return (
    <Toaster
      theme={colorScheme === "dark" ? "dark" : "light"}
      position="top-center"
      offset={Math.max(insets.top, 16)}
      closeButton
      richColors
      visibleToasts={2}
      toastOptions={{
        titleStyle: { color: theme.colors.contrast },
        descriptionStyle: { color: theme.colors.contrast },
      }}
      icons={{
        success: (
          <MaterialCommunityIcons
            name="check-circle"
            size={22}
            color={theme.colors.success}
          />
        ),
        error: (
          <MaterialCommunityIcons
            name="alert-circle"
            size={22}
            color={theme.colors.error}
          />
        ),
        info: (
          <MaterialCommunityIcons
            name="information"
            size={22}
            color={theme.colors.info}
          />
        ),
      }}
    />
  );
};

export default ToastHost;
