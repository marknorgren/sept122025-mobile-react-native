import {
  StyleSheet,
  View,
  Text,
  Platform,
  Dimensions,
  PixelRatio,
  ScrollView,
} from "react-native";
import Constants from "expo-constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";

export default function DeviceScreen() {
  const { width, height } = Dimensions.get("window");
  const scale = PixelRatio.get();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, { borderColor: colors.separator }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            Device & App Info
          </Text>
          <Text style={[styles.subtitle, { color: colors.subtitle }]}>
            Runtime metrics sourced from Expo
          </Text>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.separator,
            },
          ]}
        >
          <Info label="App name" value={Constants.expoConfig?.name ?? "-"} />
          <Info
            label="App version"
            value={Constants.expoConfig?.version ?? "-"}
          />
          <Info label="SDK" value={Constants.expoConfig?.sdkVersion ?? "54"} />
          <Info
            label="Platform"
            value={`${Platform.OS} (${String(Platform.Version)})`}
          />
          <Info label="Dimensions" value={`${width} x ${height}`} />
          <Info label="Pixel ratio" value={String(scale)} />
          <Info
            label="Bundle ID"
            value={
              Constants.expoConfig?.ios?.bundleIdentifier ??
              Constants.expoConfig?.android?.package ??
              "-"
            }
          />
          <Info label="Debug" value={String(__DEV__)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.row, { borderBottomColor: colors.separator }]}>
      <Text style={[styles.label, { color: colors.subtitle }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  header: {
    gap: 4,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { fontSize: 28, fontWeight: "700" },
  subtitle: { fontSize: 15 },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    overflow: "hidden",
  },
  row: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  value: { marginTop: 6, fontSize: 16, fontWeight: "500" },
});
