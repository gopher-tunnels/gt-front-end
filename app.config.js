export default {
  expo: {
    name: "GopherTunnels",
    description: "Find your way through the GopherWay!",
    slug: "GT",
    // newArchEnabled: false,
    platforms: ["ios", "android"],
    version: "1.0.1",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splashLight.png",
      resizeMode: "cover",
      backgroundColor: "#812228",
      dark: {
        image: "./assets/splashDark.png",
        resizeMode: "cover",
        backgroundColor: "#37000B",
      },
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      icon: "./assets/GopherTunnels.icon",
      supportsTablet: false,
      bundleIdentifier: "com.adcumn.gophertunnels",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      buildNumber: "1.0.1",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.adcumn.gophertunnels",
      versionCode: 101,
    },
    web: {
      favicon: "./assets/adaptive-icon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-font",
        {
          fonts: [
            "./assets/fonts/PlusJakartaSans/PlusJakartaSans-Bold.ttf",
            "./assets/fonts/PlusJakartaSans/PlusJakartaSans-BoldItalic.ttf",
            "./assets/fonts/PlusJakartaSans/PlusJakartaSans-ExtraBold.ttf",
            "./assets/fonts/PlusJakartaSans/PlusJakartaSans-ExtraBoldItalic.ttf",
            "./assets/fonts/PlusJakartaSans/PlusJakartaSans-ExtraLight.ttf",
            "./assets/fonts/PlusJakartaSans/PlusJakartaSans-ExtraLightItalic.ttf",
            "./assets/fonts/PlusJakartaSans/PlusJakartaSans-Italic.ttf",
            "./assets/fonts/PlusJakartaSans/PlusJakartaSans-Light.ttf",
            "./assets/fonts/PlusJakartaSans/PlusJakartaSans-LightItalic.ttf",
            "./assets/fonts/PlusJakartaSans/PlusJakartaSans-Medium.ttf",
            "./assets/fonts/PlusJakartaSans/PlusJakartaSans-MediumItalic.ttf",
            "./assets/fonts/PlusJakartaSans/PlusJakartaSans-Regular.ttf",
            "./assets/fonts/PlusJakartaSans/PlusJakartaSans-SemiBold.ttf",
            "./assets/fonts/PlusJakartaSans/PlusJakartaSans-SemiBoldItalic.ttf",
          ],
        },
      ],
      ["@rnmapbox/maps", {}],
      [
        "expo-location",
        {
          locationWhenInUsePermission: "Show current location on map.",
        },
      ],
      "expo-secure-store",
    ],
    extra: {
      router: {
        origin: false,
      },
      eas: { projectId: "5e2aee69-1344-4ae9-9f15-aa6940ee4a43" },
    },
  },
};
