import { useCallback, useEffect, useMemo, useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from "react-native";
import { NativeTabs, Badge } from "expo-router/unstable-native-tabs";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TimePickerField } from "@/components/common";

const SETTINGS_STORAGE_KEY = "@app_settings";

type ThemeColors = {
  background: string;
  cardBackground: string;
  text: string;
  subtitle: string;
  separator: string;
  sectionHeader: string;
  chevron: string;
  tabBar: string;
  tabBarInactive: string;
};

type SettingsTint =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "purple"
  | "neutral";

type SettingsTokens = {
  cardBackground: string;
  cardBorder: string;
  icon: Record<SettingsTint, { background: string; foreground: string }>;
  badge: { background: string; text: string };
  switch: { trueTrack: string; falseTrack: string; thumb: string };
  tabIndicator: string;
  headerButton: string;
  divider: string;
};

function createSettingsTokens(
  isDark: boolean,
  colors: ThemeColors,
): SettingsTokens {
  const iconPalette: SettingsTokens["icon"] = {
    primary: {
      background: isDark ? "rgba(59,130,246,0.35)" : "rgba(10,132,255,0.16)",
      foreground: isDark ? "#bfdbfe" : "#0a84ff",
    },
    success: {
      background: isDark ? "rgba(34,197,94,0.32)" : "rgba(52,199,89,0.18)",
      foreground: isDark ? "#bbf7d0" : "#1f9254",
    },
    warning: {
      background: isDark ? "rgba(251,191,36,0.28)" : "rgba(255,204,0,0.16)",
      foreground: isDark ? "#fde68a" : "#b45309",
    },
    danger: {
      background: isDark ? "rgba(239,68,68,0.32)" : "rgba(255,59,48,0.18)",
      foreground: isDark ? "#fecaca" : "#ff3b30",
    },
    info: {
      background: isDark ? "rgba(56,189,248,0.32)" : "rgba(90,200,250,0.18)",
      foreground: isDark ? "#bae6fd" : "#0ea5e9",
    },
    purple: {
      background: isDark ? "rgba(168,85,247,0.32)" : "rgba(175,82,222,0.18)",
      foreground: isDark ? "#e9d5ff" : "#7c3aed",
    },
    neutral: {
      background: isDark ? "rgba(148,163,184,0.25)" : "rgba(226,232,240,0.7)",
      foreground: isDark ? "#e2e8f0" : "#475569",
    },
  };

  return {
    cardBackground: colors.cardBackground,
    cardBorder: isDark ? "rgba(148,163,184,0.32)" : "rgba(148,163,184,0.22)",
    icon: iconPalette,
    badge: {
      background: isDark ? "rgba(248,113,113,0.28)" : "rgba(255,59,48,0.15)",
      text: isDark ? "#fecaca" : "#ff3b30",
    },
    switch: {
      trueTrack: isDark ? "#2563eb" : "#34C759",
      falseTrack: isDark ? "#3f3f46" : "#d1d5db",
      thumb: isDark ? "#111827" : "#ffffff",
    },
    tabIndicator: isDark ? "#38bdf8" : "#007AFF",
    headerButton: isDark ? "#60a5fa" : "#0A84FF",
    divider: isDark ? "rgba(99,102,241,0.28)" : "rgba(148,163,184,0.35)",
  };
}

export default function SettingsScreen() {
  const [badge, setBadge] = useState<number | null>(3);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();
  const { isDark, setIsDark, colors } = useTheme();
  const tokens = useMemo(
    () => createSettingsTokens(isDark, colors),
    [colors, isDark],
  );

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietStart, setQuietStart] = useState<Date | null>(null);
  const [quietEnd, setQuietEnd] = useState<Date | null>(null);

  // Load saved settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (savedSettings !== null) {
          const settings = JSON.parse(savedSettings);
          setNotificationsEnabled(settings.notifications ?? true);
          setLocationEnabled(settings.location ?? false);
          setBadge(settings.badge ?? 3);
          setQuietHoursEnabled(settings.quietHoursEnabled ?? false);
          setQuietStart(
            settings.quietStart ? new Date(settings.quietStart) : null,
          );
          setQuietEnd(settings.quietEnd ? new Date(settings.quietEnd) : null);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };
    loadSettings();
  }, []);

  // Save settings whenever they change
  const saveSettings = async (key: string, value: any) => {
    try {
      const savedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      const settings = savedSettings ? JSON.parse(savedSettings) : {};
      settings[key] = value;
      await AsyncStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(settings),
      );
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  const handleNotificationsToggle = (value: boolean) => {
    setNotificationsEnabled(value);
    saveSettings("notifications", value);
  };

  const handleLocationToggle = (value: boolean) => {
    setLocationEnabled(value);
    saveSettings("location", value);
  };

  const handleQuietHoursToggle = (value: boolean) => {
    setQuietHoursEnabled(value);
    saveSettings("quietHoursEnabled", value);
  };

  const handleQuietStartChange = (value: Date) => {
    setQuietStart(value);
    saveSettings("quietStart", value.toISOString());
  };

  const handleQuietEndChange = (value: Date) => {
    setQuietEnd(value);
    saveSettings("quietEnd", value.toISOString());
  };

  const handleBadgeUpdate = () => {
    const newBadge = badge == null ? 1 : badge + 1;
    setBadge(newBadge);
    saveSettings("badge", newBadge);
  };

  useEffect(() => {
    if ((navigation as any)?.setOptions) {
      (navigation as any).setOptions({
        badgeValue: badge == null ? "" : String(badge),
      });
    }
  }, [badge, navigation]);

  const handlePress = (title: string) => {
    Alert.alert(title, `Navigate to ${title} settings`);
  };

  const formatTime = useCallback((date: Date | null) => {
    if (!date) {
      return "Not set";
    }
    return date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  }, []);

  const quietHoursSubtitle = useMemo(() => {
    if (!quietHoursEnabled) {
      return "Schedule a window to pause notifications";
    }
    return `${formatTime(quietStart)} – ${formatTime(quietEnd)}`;
  }, [formatTime, quietEnd, quietHoursEnabled, quietStart]);

  type SettingsRowProps = {
    icon: ComponentProps<typeof Ionicons>["name"];
    title: string;
    subtitle?: string;
    hasChevron?: boolean;
    hasToggle?: boolean;
    toggleValue?: boolean;
    onToggle?: (value: boolean) => void;
    badge?: string;
    isFirst?: boolean;
    isLast?: boolean;
    onPress?: () => void;
    tint?: SettingsTint;
  };

  const SettingsRow: React.FC<SettingsRowProps> = ({
    icon,
    title,
    subtitle,
    hasChevron,
    hasToggle,
    toggleValue,
    onToggle,
    badge: rowBadge,
    isFirst,
    isLast,
    onPress: onRowPress,
    tint = "primary",
  }) => {
    const tintColors = tokens.icon[tint as SettingsTint] ?? tokens.icon.primary;
    const showDivider = !isLast;

    return (
      <TouchableOpacity
        style={[
          styles.row,
          {
            backgroundColor: tokens.cardBackground,
          },
          isFirst && styles.firstRow,
          isLast && styles.lastRow,
          showDivider && {
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: tokens.divider,
          },
        ]}
        onPress={onRowPress}
        activeOpacity={hasToggle ? 1 : 0.6}
      >
        <View style={styles.rowContent}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: tintColors.background },
            ]}
          >
            <Ionicons name={icon} size={20} color={tintColors.foreground} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.rowSubtitle, { color: colors.subtitle }]}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.accessoryContainer}>
          {rowBadge && (
            <View
              style={[
                styles.badgeView,
                { backgroundColor: tokens.badge.background },
              ]}
            >
              <Text style={[styles.badgeText, { color: tokens.badge.text }]}>
                {rowBadge}
              </Text>
            </View>
          )}
          {hasToggle && (
            <Switch
              value={toggleValue}
              onValueChange={onToggle}
              trackColor={{
                false: tokens.switch.falseTrack,
                true: tokens.switch.trueTrack,
              }}
              thumbColor={
                Platform.OS === "ios" ? tokens.switch.thumb : undefined
              }
              ios_backgroundColor={tokens.switch.falseTrack}
            />
          )}
          {hasChevron && (
            <Ionicons name="chevron-forward" size={20} color={colors.chevron} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const SettingsSection = ({
    title,
    children,
  }: {
    title: string;
    children: ReactNode;
  }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionHeader, { color: colors.sectionHeader }]}>
        {title}
      </Text>
      <View
        style={[
          styles.sectionContent,
          {
            backgroundColor: tokens.cardBackground,
            borderColor: tokens.cardBorder,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <NativeTabs.Trigger disableScrollToTop={false} disablePopToTop={false}>
        <Badge>{badge == null ? "" : String(badge)}</Badge>
        <NativeTabs.Trigger.TabBar indicatorColor={tokens.tabIndicator} />
      </NativeTabs.Trigger>

      <View
        style={[
          styles.header,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleBadgeUpdate}>
          <Text style={[styles.editButtonText, { color: tokens.headerButton }]}>
            Edit
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <SettingsSection title="SETTINGS">
          <SettingsRow
            icon="settings-outline"
            title="General"
            subtitle="Language, Region, Date & Time"
            hasChevron
            isFirst
            onPress={() => handlePress("General")}
            tint="primary"
          />
          <SettingsRow
            icon="notifications-outline"
            title="Notifications"
            subtitle="Alerts, Sounds, Badges"
            hasToggle
            toggleValue={notificationsEnabled}
            onToggle={handleNotificationsToggle}
            tint="info"
          />
          <SettingsRow
            icon="lock-closed-outline"
            title="Privacy & Security"
            subtitle="Face ID, Passcode, Permissions"
            hasChevron
            badge="2"
            isLast
            onPress={() => handlePress("Privacy & Security")}
            tint="danger"
          />
        </SettingsSection>

        <SettingsSection title="ACCOUNT">
          <SettingsRow
            icon="person-circle-outline"
            title="Apple ID"
            subtitle="iCloud, Media & Purchases"
            hasChevron
            isFirst
            onPress={() => handlePress("Apple ID")}
            tint="purple"
          />
          <SettingsRow
            icon="server-outline"
            title="Storage"
            subtitle="124.3 GB of 256 GB used"
            hasChevron
            onPress={() => handlePress("Storage")}
            tint="info"
          />
          <SettingsRow
            icon="location-outline"
            title="Location Services"
            subtitle="Share your location"
            hasToggle
            toggleValue={locationEnabled}
            onToggle={handleLocationToggle}
            isLast
            tint="success"
          />
        </SettingsSection>

        <SettingsSection title="DISPLAY">
          <SettingsRow
            icon="sunny-outline"
            title="Appearance"
            subtitle="Light, Dark, Automatic"
            hasChevron
            isFirst
            onPress={() => handlePress("Appearance")}
            tint="primary"
          />
          <SettingsRow
            icon="moon-outline"
            title="Dark Mode"
            subtitle="Enable dark appearance"
            hasToggle
            toggleValue={isDark}
            onToggle={setIsDark}
            tint="purple"
          />
          <SettingsRow
            icon="text-outline"
            title="Text Size"
            subtitle="Adjust reading size"
            hasChevron
            isLast
            onPress={() => handlePress("Text Size")}
            tint="neutral"
          />
        </SettingsSection>

        <SettingsSection title="FOCUS">
          <SettingsRow
            icon="leaf-outline"
            title="Quiet Hours"
            subtitle={quietHoursSubtitle}
            hasToggle
            toggleValue={quietHoursEnabled}
            onToggle={handleQuietHoursToggle}
            isFirst
            tint="purple"
          />
          <View
            pointerEvents={quietHoursEnabled ? "auto" : "none"}
            style={[
              styles.inlineFieldGroup,
              {
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: tokens.divider,
                backgroundColor: tokens.cardBackground,
                opacity: quietHoursEnabled ? 1 : 0.5,
              },
            ]}
          >
            <TimePickerField
              label="Start"
              helperText="Beginning of the quiet window"
              value={quietStart}
              onChange={handleQuietStartChange}
            />
            <TimePickerField
              label="End"
              helperText="Notifications resume after this time"
              value={quietEnd}
              onChange={handleQuietEndChange}
            />
          </View>
        </SettingsSection>

        <SettingsSection title="SUPPORT">
          <SettingsRow
            icon="help-circle-outline"
            title="Help Center"
            subtitle="Get answers to your questions"
            hasChevron
            isFirst
            onPress={() => handlePress("Help Center")}
            tint="info"
          />
          <SettingsRow
            icon="chatbubbles-outline"
            title="Contact Support"
            subtitle="Chat or call with an expert"
            hasChevron
            onPress={() => handlePress("Contact Support")}
            tint="primary"
          />
          <SettingsRow
            icon="information-circle-outline"
            title="About"
            subtitle="Version 1.0.0"
            hasChevron
            isLast
            onPress={() => handlePress("About")}
            tint="neutral"
          />
        </SettingsSection>

        <SettingsSection title="EXPERIENCES">
          <SettingsRow
            icon="compass-outline"
            title="Explore"
            subtitle="Overview of upcoming demos"
            hasChevron
            isFirst
            onPress={() => router.push("/(tabs)/more/explore")}
            tint="primary"
          />
          <SettingsRow
            icon="phone-portrait-outline"
            title="Device & App Info"
            subtitle="Inspect platform, version, and bundle"
            hasChevron
            onPress={() => router.push("/(tabs)/more/device")}
            tint="info"
          />
          <SettingsRow
            icon="folder-outline"
            title="File System"
            subtitle="Read and write sandboxed files"
            hasChevron
            onPress={() => router.push("/(tabs)/more/files")}
            tint="primary"
          />
          <SettingsRow
            icon="color-palette-outline"
            title="Glass"
            subtitle="Explore glassmorphism techniques"
            hasChevron
            onPress={() => router.push("/(tabs)/more/glass")}
            tint="purple"
          />
          <SettingsRow
            icon="radio-outline"
            title="Haptics"
            subtitle="Trigger tactile feedback patterns"
            hasChevron
            onPress={() => router.push("/(tabs)/more/haptics")}
            tint="success"
          />
          <SettingsRow
            icon="link-outline"
            title="Links & Preview"
            subtitle="Test modal previews and deep links"
            hasChevron
            isLast
            onPress={() => router.push("/(tabs)/more/links")}
            tint="neutral"
          />
        </SettingsSection>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  editButtonText: {
    fontSize: 17,
    fontWeight: "400",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 35,
    paddingTop: 10,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "400",
    textTransform: "uppercase",
    letterSpacing: -0.08,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  sectionContent: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  firstRow: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  lastRow: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 29,
    height: 29,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 17,
    fontWeight: "400",
    letterSpacing: -0.4,
  },
  rowSubtitle: {
    fontSize: 13,
    marginTop: 2,
    letterSpacing: -0.08,
  },
  accessoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badgeView: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
  },
  inlineFieldGroup: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
});
