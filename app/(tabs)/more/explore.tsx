import { StyleSheet, View, Text, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Link } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

export default function ExploreScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Explore</Text>
        <Text style={[styles.text, { color: colors.subtitle }]}>
          - Native bottom tabs with triggers and icons
        </Text>
        <Text style={[styles.text, { color: colors.subtitle }]}>
          - Liquid Glass tab bar on iOS 26
        </Text>
        <Text style={[styles.text, { color: colors.subtitle }]}>
          - React Native {Platform.Version} runtime
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#007AFF" }]}
            onPress={() => router.push({ pathname: "/details", params: { i: "1" } })}
          >
            <Text style={styles.buttonText}>Push Details</Text>
          </TouchableOpacity>

          <Link href="/modal" asChild>
            <TouchableOpacity style={[styles.button, { backgroundColor: "#34C759" }]}>
              <Text style={styles.buttonText}>Open Modal (Preview-enabled)</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    gap: 8,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    marginVertical: 4,
  },
  buttonContainer: {
    marginTop: 32,
    gap: 16,
    alignItems: "center",
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
