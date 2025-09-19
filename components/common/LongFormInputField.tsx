import React, { useEffect, useMemo, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

type LongFormInputFieldProps = {
  label?: string;
  helperText?: string;
  error?: string;
  showCharacterCount?: boolean;
  maxCharacters?: number;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  helperTextStyle?: StyleProp<TextStyle>;
  errorTextStyle?: StyleProp<TextStyle>;
  characterCountStyle?: StyleProp<TextStyle>;
  onChangeText?: (text: string) => void;
} & Omit<TextInputProps, "style" | "multiline" | "onChange" | "onChangeText">;

const DEFAULT_NUMBER_OF_LINES = 4;

const LongFormInputField: React.FC<LongFormInputFieldProps> = ({
  label,
  helperText,
  error,
  showCharacterCount = false,
  maxCharacters,
  containerStyle,
  labelStyle,
  inputStyle,
  helperTextStyle,
  errorTextStyle,
  characterCountStyle,
  value,
  onChangeText,
  numberOfLines = DEFAULT_NUMBER_OF_LINES,
  placeholder,
  ...rest
}) => {
  const { colors } = useTheme();
  const [characterCount, setCharacterCount] = useState(value?.length ?? 0);

  useEffect(() => {
    setCharacterCount(value?.length ?? 0);
  }, [value]);

  const remainingCharacters = useMemo(() => {
    if (typeof maxCharacters !== "number") {
      return undefined;
    }
    return Math.max(maxCharacters - characterCount, 0);
  }, [characterCount, maxCharacters]);

  const handleChangeText = (text: string) => {
    setCharacterCount(text.length);
    onChangeText?.(text);
  };

  const hasError = Boolean(error);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { color: colors.text }, labelStyle]}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.cardBackground,
            borderColor: hasError ? "#ef4444" : colors.separator,
          },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.subtitle}
          multiline
          numberOfLines={numberOfLines}
          style={[styles.input, { color: colors.text }, inputStyle]}
          textAlignVertical="top"
          autoCapitalize={rest.autoCapitalize ?? "sentences"}
          {...rest}
        />
      </View>
      <View style={styles.metaRow}>
        {helperText ? (
          <Text
            style={[
              styles.helperText,
              { color: colors.subtitle },
              helperTextStyle,
            ]}
          >
            {helperText}
          </Text>
        ) : null}
        {showCharacterCount ? (
          <Text
            style={[
              styles.characterCount,
              { color: hasError ? "#ef4444" : colors.subtitle },
              characterCountStyle,
            ]}
          >
            {typeof maxCharacters === "number"
              ? `${remainingCharacters} of ${maxCharacters} left`
              : `${characterCount} characters`}
          </Text>
        ) : null}
      </View>
      {hasError ? (
        <Text style={[styles.errorText, errorTextStyle]}>{error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: {
    fontSize: 16,
    lineHeight: 22,
    padding: 0,
    minHeight: 20 * DEFAULT_NUMBER_OF_LINES,
  },
  metaRow: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  helperText: {
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },
  characterCount: {
    fontSize: 13,
    fontVariant: ["tabular-nums"],
  },
  errorText: {
    marginTop: 4,
    fontSize: 13,
    color: "#ef4444",
    fontWeight: "500",
  },
});

export default LongFormInputField;
