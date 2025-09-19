import { useMemo } from "react";
import { Platform } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

export default function MoreLayout() {
  const { colors, isDark } = useTheme();
  const headerBackground = useMemo(
    () => ({ backgroundColor: colors.cardBackground }),
    [colors.cardBackground],
  );

  const contentBackground = useMemo(
    () => ({ backgroundColor: colors.background }),
    [colors.background],
  );

  return (
    <Stack
      screenOptions={{
        headerStyle: headerBackground,
        headerTintColor: colors.text,
        headerLargeTitle: Platform.OS === "ios",
        headerLargeTitleShadowVisible: false,
        headerTitleStyle: { color: colors.text },
        headerBlurEffect: isDark ? "systemMaterialDark" : "systemMaterialLight",
        contentStyle: contentBackground,
      }}
    >
      <Stack.Screen name="index" options={{ title: "More" }} />
      <Stack.Screen name="device" options={{ title: "Device & App Info" }} />
      <Stack.Screen name="files" options={{ title: "File System" }} />
      <Stack.Screen name="glass" options={{ title: "Glass" }} />
      <Stack.Screen name="haptics" options={{ title: "Haptics" }} />
      <Stack.Screen name="links" options={{ title: "Links & Preview" }} />
      <Stack.Screen name="explore" options={{ title: "Explore" }} />
    </Stack>
  );
}
