import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";
import {
  DatePickerField,
  LazyImage,
  LongFormInputField,
  LongList,
  NumericInputField,
  TimePickerField,
} from "@/components/common";
import { Image as ExpoImage } from "expo-image";
import type { PicsumSourceOptions } from "@/components/common";

type FeaturedPhoto = {
  title: string;
  subtitle: string;
  picsum: PicsumSourceOptions;
};

const FEATURED_PHOTOS: FeaturedPhoto[] = [
  {
    title: "Seeded aurora (1200x800)",
    subtitle: "Stable placeholder sourced from /seed/aurora for predictable previews.",
    picsum: {
      seed: "aurora",
      width: 1200,
      height: 800,
    },
  },
  {
    title: "Specific ID 870 with grayscale + blur",
    subtitle: "Combines /id/870 with ?grayscale&blur=2 to mirror design specs.",
    picsum: {
      id: 870,
      width: 1200,
      height: 800,
      grayscale: true,
      blur: 2,
    },
  },
  {
    title: "Square avatar (webp)",
    subtitle: "Single dimension request (/600.webp) ideal for avatars and thumbnails.",
    picsum: {
      width: 600,
      format: "webp",
      random: 3,
    },
  },
  {
    title: "Fresh random scenic",
    subtitle: "Cache-busted random image using ?random and a gentle blur for placeholders.",
    picsum: {
      width: 1200,
      height: 800,
      random: true,
      blur: 3,
    },
  },
];

const COMPONENT_LIST_DATA = Array.from({ length: 12 }, (_, index) => ({
  id: `item-${index + 1}`,
  title: `Event ${index + 1}`,
  detail: index % 2 === 0 ? "Cached" : "Remote",
}));

export default function ComponentsDemoScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [numericValue, setNumericValue] = useState<number | undefined>(72);
  const [notes, setNotes] = useState("Short blurb showcasing the multiline input.");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [quietStart, setQuietStart] = useState<Date | null>(null);
  const [quietEnd, setQuietEnd] = useState<Date | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isClearingCache, setIsClearingCache] = useState(false);

  const listData = useMemo(() => COMPONENT_LIST_DATA, []);

  const renderListItem = useCallback(
    ({ item }: { item: (typeof COMPONENT_LIST_DATA)[number] }) => (
      <View
        style={[
          styles.listItem,
          {
            borderColor: colors.separator,
            backgroundColor: colors.cardBackground,
          },
        ]}
      >
        <Text style={[styles.listItemTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.listItemDetail, { color: colors.subtitle }]}>{item.detail}</Text>
      </View>
    ),
    [colors.cardBackground, colors.separator, colors.subtitle, colors.text],
  );

  const formattedDate = selectedDate
    ? selectedDate.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "No date selected";

  const formatTime = useCallback((date: Date | null) => {
    if (!date) {
      return "Not set";
    }
    return date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  }, []);

  const currentPhoto = FEATURED_PHOTOS[photoIndex % FEATURED_PHOTOS.length];

  const handleNextPhoto = () => {
    setPhotoIndex((index) => (index + 1) % FEATURED_PHOTOS.length);
  };

  const handleClearCache = useCallback(async () => {
    try {
      setIsClearingCache(true);
      await Promise.all([ExpoImage.clearDiskCache(), ExpoImage.clearMemoryCache()]);
    } finally {
      setIsClearingCache(false);
    }
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 12,
            backgroundColor: colors.background,
            borderBottomColor: colors.separator,
          },
        ]}
      >
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Component Library</Text>
          <Text style={[styles.headerSubtitle, { color: colors.subtitle }]}>
            Reusable building blocks used throughout the app.
          </Text>
        </View>
      </View>

      <LongList
        data={listData}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id}
        listStyle={[styles.longList, { backgroundColor: colors.background }]}
        contentContainerStyle={[styles.longListContent, { backgroundColor: colors.background }]}
        ListHeaderComponent={
          <View style={[styles.sectionsContainer, { backgroundColor: colors.background }]}>
            <View
              style={[
                styles.section,
                styles.demoCard,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.separator,
                },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colors.sectionHeader }]}>
                NumericInputField
              </Text>
              <NumericInputField
                label="Target CPU utilization"
                helperText="Clamps between 10 and 95 to guard against spikes."
                min={10}
                max={95}
                precision={0}
                units="%"
                value={numericValue}
                onChangeValue={setNumericValue}
              />
              <Text style={[styles.caption, { color: colors.subtitle }]}>
                Current value: {numericValue == null ? "unset" : `${numericValue}%`}
              </Text>
            </View>

            <View
              style={[
                styles.section,
                styles.demoCard,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.separator,
                },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colors.sectionHeader }]}>
                LongFormInputField
              </Text>
              <LongFormInputField
                label="Release notes"
                helperText="Demonstrates helper copy, character counting, and dynamic height."
                value={notes}
                onChangeText={setNotes}
                showCharacterCount
                maxCharacters={320}
                numberOfLines={4}
                placeholder="Type something descriptive..."
              />
            </View>

            <View
              style={[
                styles.section,
                styles.demoCard,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.separator,
                },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colors.sectionHeader }]}>LazyImage</Text>
              <Text style={[styles.caption, { color: colors.subtitle }]}>
                Powered by Lorem Picsum to showcase seeded, ID-based, and random placeholders.
              </Text>
              <View
                style={[
                  styles.imageCard,
                  {
                    backgroundColor: isDark ? "rgba(15, 23, 42, 0.7)" : "rgba(15, 23, 42, 0.06)",
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: isDark ? "rgba(148, 163, 184, 0.24)" : "rgba(15, 23, 42, 0.1)",
                  },
                ]}
              >
                <LazyImage
                  key={currentPhoto.title}
                  picsum={currentPhoto.picsum}
                  alt={currentPhoto.title}
                  containerStyle={styles.imageContainer}
                  imageStyle={styles.image}
                  transitionDuration={250}
                />
                <View
                  style={[
                    styles.imageMeta,
                    {
                      backgroundColor: isDark
                        ? "rgba(15, 23, 42, 0.6)"
                        : "rgba(248, 250, 252, 0.92)",
                      borderTopColor: isDark
                        ? "rgba(148, 163, 184, 0.24)"
                        : "rgba(15, 23, 42, 0.12)",
                    },
                  ]}
                >
                  <Text style={[styles.caption, { color: isDark ? "#d4d4d8" : "#374151" }]}>
                    {currentPhoto.title}
                  </Text>
                  <Text style={[styles.captionSecondary, { color: colors.subtitle }]}>
                    {currentPhoto.subtitle}
                  </Text>
                </View>
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[
                    styles.controlButton,
                    {
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.separator,
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={handleNextPhoto}
                >
                  <Text style={[styles.controlButtonText, { color: colors.text }]}>
                    Show next Picsum variant
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.controlButton,
                    {
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.separator,
                      opacity: isClearingCache ? 0.6 : 1,
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={handleClearCache}
                  disabled={isClearingCache}
                >
                  <Text style={[styles.controlButtonText, { color: colors.text }]}>
                    {isClearingCache ? "Clearing cache…" : "Clear image cache"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={[
                styles.section,
                styles.demoCard,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.separator,
                },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colors.sectionHeader }]}>
                DatePickerField
              </Text>
              <DatePickerField
                label="Schedule maintenance"
                helperText="Opens platform-native pickers for date + time selection."
                mode="datetime"
                minimumDate={new Date()}
                value={selectedDate}
                onChange={setSelectedDate}
              />
              <Text style={[styles.caption, { color: colors.subtitle }]}>{formattedDate}</Text>
            </View>

            <View
              style={[
                styles.section,
                styles.demoCard,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.separator,
                },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colors.sectionHeader }]}>
                TimePickerField
              </Text>
              <TimePickerField
                label="Quiet hours start"
                helperText="Uses the native time picker for quick inputs."
                value={quietStart}
                onChange={setQuietStart}
              />
              <TimePickerField label="Quiet hours end" value={quietEnd} onChange={setQuietEnd} />
              <Text style={[styles.caption, { color: colors.subtitle }]}>
                Quiet window: {formatTime(quietStart)} – {formatTime(quietEnd)}
              </Text>
            </View>

            <View
              style={[
                styles.section,
                styles.demoCard,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.separator,
                },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colors.sectionHeader }]}>LongList</Text>
              <Text style={[styles.caption, { color: colors.subtitle }]}>
                FlatList helper with infinite-scroll affordances.
              </Text>
            </View>
          </View>
        }
        footerComponent={<View style={styles.footerSpacer} />}
        isLoadingMore={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 21,
  },
  sectionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 24,
  },
  section: {
    gap: 16,
  },
  demoCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1,
  },
  caption: {
    fontSize: 13,
  },
  captionSecondary: {
    fontSize: 12,
    lineHeight: 16,
  },
  imageCard: {
    borderRadius: 16,
    overflow: "hidden",
  },
  imageMeta: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(148, 163, 184, 0.24)",
  },
  buttonRow: {
    marginTop: 12,
    gap: 12,
    alignItems: "stretch",
  },
  controlButton: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    width: "100%",
  },
  controlButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  imageContainer: {
    height: 220,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  longList: {
    flex: 1,
  },
  longListContent: {
    paddingBottom: 120,
  },
  listItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  listItemTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  listItemDetail: {
    marginTop: 4,
    fontSize: 13,
  },
  footerSpacer: {
    height: 80,
  },
});
