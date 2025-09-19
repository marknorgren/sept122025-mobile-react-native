import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { initializeLogger } from "@/services/logging";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutNav() {
  const { isDark } = useTheme();

  return (
    <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  // Initialize logging service on app startup
  initializeLogger({
    maxLogs: 1000,
    // In production, you would configure your remote logging endpoint here
    // remoteEndpoint: process.env.EXPO_PUBLIC_LOG_ENDPOINT,
    // remoteApiKey: process.env.EXPO_PUBLIC_LOG_API_KEY,
  });

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
