import { Link } from "expo-router";
import { StyleSheet, View, Pressable, Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import { useTheme } from "@/contexts/ThemeContext";

export default function LinksDemo() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.separator,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.text }]}>Link previews & menus</Text>

        <Link href="/modal">
          <Link.Trigger>
            <Pressable
              style={[styles.cta, { backgroundColor: colors.text }]}
              accessibilityRole="button"
            >
              <Text style={[styles.ctaText, { color: colors.background }]}>
                Open modal (with preview + menu)
              </Text>
            </Pressable>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert("Action pressed")} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert("Share pressed")}
            />
          </Link.Menu>
        </Link>

        <View style={{ height: 16 }} />

        <Button
          title="Open expo.dev in in-app browser"
          onPress={async () => {
            await WebBrowser.openBrowserAsync("https://expo.dev");
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    padding: 24,
    gap: 12,
    justifyContent: "center",
    margin: 20,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "transparent",
  },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center" },
  cta: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  ctaText: { fontWeight: "600" },
});
