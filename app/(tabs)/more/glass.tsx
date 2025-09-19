import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export default function GlassDemo() {
  const { isDark, colors } = useTheme();
  const cardBorderColor = useMemo(
    () => (isDark ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.35)"),
    [isDark],
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Image
          style={styles.background}
          contentFit="cover"
          source={{
            uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=900&fit=crop",
          }}
        />

        {/* Basic blur card with frosted edge */}
        <View style={[styles.card, styles.cardLeft, { borderColor: cardBorderColor }]}>
          <BlurView intensity={40} tint="default" style={StyleSheet.absoluteFill} />
          {/* Soft sheen from top-left to bottom-right */}
          <LinearGradient
            colors={["rgba(255,255,255,0.35)", "rgba(255,255,255,0.06)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {/* Slight bottom vignette for depth */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.07)"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* Stronger blur variant to emulate clear glass */}
        <View style={[styles.card, styles.cardRight, { borderColor: cardBorderColor }]}>
          <BlurView intensity={84} tint="light" style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={["rgba(255,255,255,0.45)", "rgba(255,255,255,0.08)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.08)"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: 140,
    height: 180,
    borderRadius: 24,
    borderCurve: "continuous",
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    // Subtle shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
  },
  cardLeft: {
    position: "absolute",
    left: 24,
    bottom: 60,
  },
  cardRight: {
    position: "absolute",
    right: 24,
    top: 120,
  },
});
