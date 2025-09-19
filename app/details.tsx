import { StyleSheet, View, Text, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function DetailsScreen() {
  const { i } = useLocalSearchParams<{ i?: string }>();
  const router = useRouter();
  const next = String((Number(i ?? 1) || 1) + 1);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Details</Text>
        <Text style={styles.text}>Push depth: {i ?? "1"}</Text>

        <View style={{ height: 12 }} />
        <Button title="Push again" onPress={() => router.push({ pathname: "/details", params: { i: next } })} />
        <View style={{ height: 8 }} />
        <Button title="Go back" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, padding: 24, alignItems: "center", justifyContent: "center", gap: 8 },
  title: { fontSize: 22, fontWeight: "700" },
  text: { color: "#374151" },
});

