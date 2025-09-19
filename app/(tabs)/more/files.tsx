import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View, Text, Button, Alert, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystemLegacy from "expo-file-system/legacy";
import { useTheme } from "@/contexts/ThemeContext";

export default function FilesDemo() {
  const documentDirectory = FileSystemLegacy.documentDirectory;
  const isFileSystemAvailable = typeof documentDirectory === "string";
  const fileUri = useMemo(() => {
    return isFileSystemAvailable ? `${documentDirectory}demo.txt` : null;
  }, [documentDirectory, isFileSystemAvailable]);
  const [exists, setExists] = useState<boolean>(false);
  const [size, setSize] = useState<number | null>(null);
  const [content, setContent] = useState<string>("");
  const [count, setCount] = useState<number>(1);
  const { colors } = useTheme();

  const refresh = useCallback(async () => {
    if (!fileUri) {
      setExists(false);
      setSize(null);
      return;
    }
    try {
      const info = await FileSystemLegacy.getInfoAsync(fileUri);
      setExists(info.exists);
      // @ts-ignore size may be undefined
      setSize((info as any).size ?? null);
    } catch (e) {
      console.warn(e);
    }
  }, [fileUri]);

  useEffect(() => {
    if (fileUri) {
      void refresh();
    }
  }, [fileUri, refresh]);

  async function write() {
    if (!fileUri) {
      Alert.alert("File System", "File system APIs are unavailable on this platform.");
      return;
    }
    const text = `Hello from Expo FileSystem\nCount: ${count}\nTime: ${new Date().toISOString()}\n`;
    await FileSystemLegacy.writeAsStringAsync(fileUri, text, {
      encoding: FileSystemLegacy.EncodingType.UTF8,
    });
    setCount((n) => n + 1);
    setContent(text);
    await refresh();
  }

  async function append() {
    if (!fileUri) {
      Alert.alert("File System", "File system APIs are unavailable on this platform.");
      return;
    }
    const prev = exists ? await FileSystemLegacy.readAsStringAsync(fileUri) : "";
    const next = `${prev}${prev ? "\n" : ""}Append ${count} at ${new Date().toISOString()}`;
    await FileSystemLegacy.writeAsStringAsync(fileUri, next, {
      encoding: FileSystemLegacy.EncodingType.UTF8,
    });
    setCount((n) => n + 1);
    setContent(next);
    await refresh();
  }

  async function read() {
    if (!fileUri) {
      Alert.alert("File System", "File system APIs are unavailable on this platform.");
      return;
    }
    if (!exists) {
      Alert.alert("File", "File does not exist yet.");
      return;
    }
    const text = await FileSystemLegacy.readAsStringAsync(fileUri);
    setContent(text);
  }

  async function clear() {
    if (!fileUri) {
      Alert.alert("File System", "File system APIs are unavailable on this platform.");
      return;
    }
    try {
      await FileSystemLegacy.deleteAsync(fileUri, { idempotent: true });
      setContent("");
      setCount(1);
      await refresh();
    } catch (e) {
      console.warn(e);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.title, { color: colors.text }]}>File System</Text>

        <Info label="documentDirectory" value={String(FileSystemLegacy.documentDirectory)} />
        <Info label="URI" value={fileUri ?? "Unavailable on this platform"} />
        <Info label="Exists" value={String(exists)} />
        <Info label="Size" value={size == null ? "-" : `${size} bytes`} />

        <View style={styles.rowButtons}>
          <Button title="Write" onPress={write} disabled={!fileUri} />
          <Button title="Append" onPress={append} disabled={!fileUri} />
          <Button title="Read" onPress={read} disabled={!fileUri} />
          <Button title="Clear" onPress={clear} disabled={!fileUri} />
        </View>

        <Text style={[styles.label, { color: colors.subtitle }]}>Content</Text>
        <View
          style={[
            styles.contentBox,
            {
              borderColor: colors.separator,
              backgroundColor: colors.cardBackground,
            },
          ]}
        >
          <Text style={[styles.mono, { color: colors.text }]}>{content || "(empty)"}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.infoRow,
        {
          borderBottomColor: colors.separator,
          backgroundColor: colors.cardBackground,
        },
      ]}
    >
      <Text style={[styles.infoLabel, { color: colors.subtitle }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 20, gap: 12 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 8 },
  rowButtons: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  label: { marginTop: 12, fontWeight: "600" },
  contentBox: {
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
  },
  mono: {
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
    fontSize: 13,
  },
  infoRow: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
  },
  infoLabel: { fontWeight: "600" },
  infoValue: { marginTop: 6 },
});
