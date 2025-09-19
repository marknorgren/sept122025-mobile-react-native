import { useRouter } from "expo-router";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const { isDark, setIsDark, colors } = useTheme();
  const router = useRouter();

  const handleHaptic = (type: "light" | "medium" | "heavy") => {
    switch (type) {
      case "light":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case "medium":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case "heavy":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
    }
  };

  const DemoCard = ({
    title,
    description,
    icon,
    onPress,
    color = "#007AFF",
  }: any) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.cardBackground }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="white" />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.cardDescription, { color: colors.subtitle }]}>
          {description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.chevron} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Expo 54 Demos
          </Text>
          <Text style={[styles.subtitle, { color: colors.subtitle }]}>
            Native tabs with Liquid Glass on iOS 26
          </Text>
        </View>

        <View style={styles.quickSettings}>
          <View
            style={[
              styles.quickSettingCard,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <Ionicons
              name={isDark ? "moon" : "sunny"}
              size={24}
              color={isDark ? "#FFD60A" : "#FF9F0A"}
            />
            <Text style={[styles.quickSettingText, { color: colors.text }]}>
              {isDark ? "Dark" : "Light"} Mode
            </Text>
            <Switch
              value={isDark}
              onValueChange={setIsDark}
              trackColor={{ false: "#E5E5EA", true: "#34C759" }}
              thumbColor={Platform.OS === "ios" ? "#FFFFFF" : undefined}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.sectionHeader }]}>
            NAVIGATION
          </Text>

          <DemoCard
            title="Modal Presentation"
            description="Preview-enabled modal with swipe to dismiss"
            icon="layers-outline"
            color="#007AFF"
            onPress={() => router.push("/modal")}
          />

          <DemoCard
            title="Push Details"
            description="Navigate to detail screen with params"
            icon="arrow-forward-circle-outline"
            color="#34C759"
            onPress={() =>
              router.push({ pathname: "/details", params: { i: "1" } })
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.sectionHeader }]}>
            INTERACTIONS
          </Text>

          <DemoCard
            title="Light Haptic"
            description="Subtle tactile feedback"
            icon="radio-outline"
            color="#FF9500"
            onPress={() => handleHaptic("light")}
          />

          <DemoCard
            title="Medium Haptic"
            description="Standard tactile feedback"
            icon="radio-outline"
            color="#FF9500"
            onPress={() => handleHaptic("medium")}
          />

          <DemoCard
            title="Heavy Haptic"
            description="Strong tactile feedback"
            icon="radio-outline"
            color="#FF9500"
            onPress={() => handleHaptic("heavy")}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.sectionHeader }]}>
            FEATURES
          </Text>

          <DemoCard
            title="Component Demos"
            description="Preview reusable UI primitives"
            icon="grid-outline"
            color="#5AC8FA"
            onPress={() => router.push("/(tabs)/components")}
          />

          <DemoCard
            title="Diagnostics"
            description="Inspect runtime metrics and live logs"
            icon="pulse-outline"
            color="#0A84FF"
            onPress={() => router.push("/(tabs)/diagnostics")}
          />

          <DemoCard
            title="Analog Clock"
            description="Smooth animated clock with dark mode"
            icon="time-outline"
            color="#AF52DE"
            onPress={() => router.push("/(tabs)/clock")}
          />

          <DemoCard
            title="More"
            description="Settings hub with extra demos"
            icon="ellipsis-horizontal"
            color="#8E8E93"
            onPress={() => router.push("/(tabs)/more")}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.subtitle }]}>
            React Native {Platform.Version} • Expo SDK 54
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  quickSettings: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quickSettingCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  quickSettingText: {
    flex: 1,
    fontSize: 17,
    fontWeight: "500",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "400",
    letterSpacing: -0.08,
    marginBottom: 8,
    paddingHorizontal: 20,
    textTransform: "uppercase",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "500",
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 13,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 13,
  },
});
