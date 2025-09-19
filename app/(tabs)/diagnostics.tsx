import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { useTheme } from "@/contexts/ThemeContext";
import { LazyImage, LongList } from "@/components/common";

const DEFAULT_LOG_LIMIT = 30;
const MAX_LOG_LIMIT = 200;
const MIN_LOG_LIMIT = 10;

type DiagnosticSeverity = "info" | "warn" | "error";

const severityColors: Record<DiagnosticSeverity, string> = {
  info: "#2563eb",
  warn: "#f97316",
  error: "#dc2626",
};

type DiagnosticLog = {
  id: string;
  message: string;
  severity: DiagnosticSeverity;
  timestamp: number;
  durationMs: number;
};

function createLogEntry(index: number): DiagnosticLog {
  const severities: DiagnosticSeverity[] = ["info", "warn", "error"];
  const severity = severities[index % severities.length];
  const durationMs = 8 + ((index * 13) % 42);

  return {
    id: `log-${Date.now()}-${index}`,
    message: `Event ${index + 1} ${severity === "error" ? "· handled exception" : "· telemetry"}`,
    severity,
    timestamp: Date.now() - index * 45000,
    durationMs,
  };
}

function createLogs(count: number, offset = 0): DiagnosticLog[] {
  return Array.from({ length: count }, (_, index) => createLogEntry(offset + index));
}

function createDateFormatter(options: Intl.DateTimeFormatOptions) {
  if (typeof Intl !== "undefined" && typeof Intl.DateTimeFormat === "function") {
    return new Intl.DateTimeFormat(undefined, options);
  }
  return null;
}

export default function DiagnosticsScreen() {
  const { colors, isDark } = useTheme();
  const [logLimitOption, setLogLimitOption] = useState(DEFAULT_LOG_LIMIT);
  const [logs, setLogs] = useState<DiagnosticLog[]>(() => createLogs(DEFAULT_LOG_LIMIT));
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (loadMoreTimer.current) {
        clearTimeout(loadMoreTimer.current);
      }
    };
  }, []);

  const visibleLogs = useMemo(
    () => logs.slice(0, Math.max(MIN_LOG_LIMIT, Math.min(MAX_LOG_LIMIT, logLimitOption))),
    [logLimitOption, logs],
  );

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore) {
      return;
    }
    setIsLoadingMore(true);
    loadMoreTimer.current = setTimeout(() => {
      setLogs((previous) => {
        const nextOffset = previous.length;
        return [...previous, ...createLogs(20, nextOffset)];
      });
      setIsLoadingMore(false);
    }, 700);
  }, [isLoadingMore]);

  const logFormatter = useMemo(
    () =>
      createDateFormatter({
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    [],
  );

  const renderLogItem = useCallback(
    ({ item }: { item: DiagnosticLog }) => (
      <View
        style={[
          styles.logRow,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.separator,
          },
        ]}
      >
        <View style={[styles.severityDot, { backgroundColor: severityColors[item.severity] }]} />
        <View style={styles.logContent}>
          <Text style={[styles.logMessage, { color: colors.text }]}>{item.message}</Text>
          <View style={styles.logMetaRow}>
            <Text style={[styles.logMeta, { color: colors.subtitle }]}>
              {logFormatter?.format(new Date(item.timestamp)) ??
                new Date(item.timestamp).toLocaleTimeString()}
            </Text>
            <Text style={[styles.logMeta, { color: colors.subtitle }]}>{item.durationMs}ms</Text>
          </View>
        </View>
      </View>
    ),
    [colors.cardBackground, colors.separator, colors.subtitle, colors.text, logFormatter],
  );

  const diagnosticsMeta = useMemo(
    () => [
      {
        label: "App",
        value: Constants.expoConfig?.name ?? "—",
      },
      {
        label: "Version",
        value: Constants.expoConfig?.version ?? "1.0.0",
      },
      {
        label: "Channel",
        value: Constants.expoConfig?.extra?.releaseChannel ?? "preview",
      },
      {
        label: "Platform",
        value: Platform.select({ ios: "iOS", android: "Android", web: "Web" }) ?? "Native",
      },
      {
        label: "JS Engine",
        value: Constants.executionEnvironment ?? "standalone",
      },
      {
        label: "Active logs",
        value: `${visibleLogs.length} of ${logs.length}`,
      },
    ],
    [logs.length, visibleLogs.length],
  );

  const listHeader = (
    <View style={styles.headerContainer}>
      <Text style={[styles.title, { color: colors.text }]}>App Diagnostics</Text>
      <Text style={[styles.subtitle, { color: colors.subtitle }]}>
        Review runtime telemetry, adjust capture thresholds, and inspect the latest events.
      </Text>

      <View style={styles.heroCard}>
        <LazyImage
          source={{
            uri: "https://images.unsplash.com/photo-1527442544836-908836ee9a68?auto=format&fit=crop&w=1200&q=80",
          }}
          alt="Diagnostics visual"
          containerStyle={styles.heroImageContainer}
          imageStyle={styles.heroImage}
          transitionDuration={300}
        />
        <View
          style={[
            styles.heroOverlay,
            { backgroundColor: isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.75)" },
          ]}
        >
          <Text style={[styles.heroTitle, { color: isDark ? "#f4f4f5" : "#111827" }]}>
            Live Snapshot
          </Text>
          <Text style={[styles.heroSubtitle, { color: isDark ? "#d4d4d8" : "#4b5563" }]}>
            {`Displaying latest ${logLimitOption} events`}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.sectionHeader }]}>APP SNAPSHOT</Text>
        <View style={styles.metricsGrid}>
          {diagnosticsMeta.map((item) => (
            <View
              key={item.label}
              style={[
                styles.metricCard,
                { backgroundColor: colors.cardBackground, borderColor: colors.separator },
              ]}
            >
              <Text style={[styles.metricLabel, { color: colors.subtitle }]}>{item.label}</Text>
              <Text style={[styles.metricValue, { color: colors.text }]} numberOfLines={1}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.sectionHeader }]}>RUNTIME CONFIG</Text>
        <View style={styles.logToggleRow}>
          {[30, 60, 120].map((option) => {
            const isSelected = option === logLimitOption;
            return (
              <Text
                key={option}
                onPress={() => setLogLimitOption(option)}
                style={[
                  styles.logToggle,
                  {
                    backgroundColor: isSelected ? "#2563eb" : colors.cardBackground,
                    color: isSelected ? "#f4f4f5" : colors.text,
                    borderColor: colors.separator,
                  },
                ]}
              >
                {option} events
              </Text>
            );
          })}
        </View>
        <Text style={[styles.sectionCaption, { color: colors.subtitle }]}>
          Quick presets for how many log entries to hydrate per batch.
        </Text>
      </View>

      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitle, { color: colors.sectionHeader }]}>LIVE LOG FEED</Text>
        <Text style={[styles.sectionCaption, { color: colors.subtitle }]}>
          Showing {visibleLogs.length} of {logs.length} events
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <LongList
        data={visibleLogs}
        renderItem={renderLogItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        listStyle={styles.list}
        ListHeaderComponent={listHeader}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        isLoadingMore={isLoadingMore}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 32,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 21,
  },
  heroCard: {
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    minHeight: 180,
  },
  heroImageContainer: {
    height: 220,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    padding: 20,
    justifyContent: "flex-end",
    gap: 6,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  heroSubtitle: {
    fontSize: 14,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    flexBasis: "48%",
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
    gap: 6,
  },
  metricLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "600",
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  logToggleRow: {
    flexDirection: "row",
    gap: 10,
  },
  logToggle: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    fontSize: 13,
    fontWeight: "600",
  },
  sectionHeaderRow: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionCaption: {
    fontSize: 13,
  },
  logRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    gap: 12,
  },
  severityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  logContent: {
    flex: 1,
    gap: 6,
  },
  logMessage: {
    fontSize: 15,
    fontWeight: "600",
  },
  logMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logMeta: {
    fontSize: 13,
  },
});
