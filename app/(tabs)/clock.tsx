import AnalogClock from "@/components/AnalogClock";
import { useTheme } from "@/contexts/ThemeContext";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

export default function ClockScreen() {
  const { colors } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time more frequently for smooth second hand
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Analog Clock</Text>
      <View style={styles.clockContainer}>
        <AnalogClock time={currentTime} />
      </View>
      <Text style={[styles.date, { color: colors.subtitle }]}>{formatDate(currentTime)}</Text>
      <Text style={[styles.digitalTime, { color: colors.text }]}>{formatTime(currentTime)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  clockContainer: {
    marginVertical: 20,
  },
  date: {
    fontSize: 18,
    marginTop: 20,
  },
  digitalTime: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 10,
    // Use SF Mono for iOS, monospace for Android
    fontFamily: Platform.select({
      ios: "SFMono-Regular",
      android: "monospace",
      default: "monospace",
    }),
    letterSpacing: 1,
  },
});
