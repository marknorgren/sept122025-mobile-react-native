import React, { forwardRef, useEffect, useMemo, useState } from "react";
import {
  Platform,
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

type NumericInputFieldProps = {
  label?: string;
  helperText?: string;
  error?: string;
  units?: string;
  min?: number;
  max?: number;
  precision?: number;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  helperTextStyle?: StyleProp<TextStyle>;
  errorTextStyle?: StyleProp<TextStyle>;
  onChangeValue?: (value: number | undefined) => void;
} & Omit<TextInputProps, "style" | "onChange" | "onChangeText" | "value" | "defaultValue"> & {
    value?: number | null;
    defaultValue?: number;
  };

type TextInputBlurEvent = Parameters<NonNullable<TextInputProps["onBlur"]>>[0];

function normalizeDecimal(input: string) {
  return input.replace(/,/g, ".");
}

function formatNumber(value: number, precision?: number) {
  if (Number.isNaN(value)) {
    return "";
  }

  if (typeof precision === "number") {
    return value.toFixed(precision);
  }

  return Number.isInteger(value) ? String(value) : String(value);
}

function clamp(value: number, min?: number, max?: number) {
  let next = value;
  if (typeof min === "number") {
    next = Math.max(min, next);
  }
  if (typeof max === "number") {
    next = Math.min(max, next);
  }
  return next;
}

const NumericInputField = forwardRef<TextInput, NumericInputFieldProps>(
  (
    {
      label,
      helperText,
      error,
      units,
      min,
      max,
      precision,
      containerStyle,
      labelStyle,
      inputStyle,
      helperTextStyle,
      errorTextStyle,
      onChangeValue,
      value,
      defaultValue,
      placeholder,
      keyboardType,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const { colors } = useTheme();
    const initialValue = useMemo(() => {
      if (typeof value === "number") {
        return formatNumber(value, precision);
      }
      if (typeof defaultValue === "number") {
        return formatNumber(defaultValue, precision);
      }
      return "";
    }, [defaultValue, precision, value]);

    const [inputValue, setInputValue] = useState(initialValue);

    useEffect(() => {
      if (typeof value === "number") {
        const formatted = formatNumber(value, precision);
        if (formatted !== inputValue) {
          setInputValue(formatted);
        }
        return;
      }
      if (value == null && inputValue !== "") {
        setInputValue("");
      }
    }, [precision, value, inputValue]);

    const handleChangeText = (raw: string) => {
      const sanitized = raw.replace(/[^0-9.,-]/g, "");
      setInputValue(sanitized);

      if (onChangeValue) {
        const normalized = normalizeDecimal(sanitized);
        const parsed = Number(normalized);
        if (sanitized.trim() === "" || Number.isNaN(parsed)) {
          onChangeValue(undefined);
        } else {
          onChangeValue(parsed);
        }
      }
    };

    const handleBlur = (event: TextInputBlurEvent) => {
      const normalized = normalizeDecimal(inputValue);
      const parsed = Number(normalized);

      if (inputValue.trim() === "" || Number.isNaN(parsed)) {
        setInputValue("");
        onChangeValue?.(undefined);
      } else {
        const clamped = clamp(parsed, min, max);
        if (clamped !== parsed) {
          onChangeValue?.(clamped);
        }
        setInputValue(formatNumber(clamped, precision));
      }

      if (onBlur) {
        onBlur(event);
      }
    };

    const activeKeyboardType = keyboardType ?? (Platform.OS === "ios" ? "decimal-pad" : "numeric");
    const hasError = Boolean(error);

    return (
      <View style={[styles.container, containerStyle]}>
        {label ? (
          <Text style={[styles.label, { color: colors.text }, labelStyle]}>{label}</Text>
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
            ref={ref}
            value={inputValue}
            onChangeText={handleChangeText}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor={colors.subtitle}
            keyboardType={activeKeyboardType}
            style={[styles.input, { color: colors.text }, inputStyle]}
            returnKeyType="done"
            {...rest}
          />
          {units ? <Text style={[styles.units, { color: colors.subtitle }]}>{units}</Text> : null}
        </View>
        {helperText ? (
          <Text style={[styles.helperText, { color: colors.subtitle }, helperTextStyle]}>
            {helperText}
          </Text>
        ) : null}
        {hasError ? <Text style={[styles.errorText, errorTextStyle]}>{error}</Text> : null}
      </View>
    );
  },
);

NumericInputField.displayName = "NumericInputField";

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
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.select({ ios: 14, default: 10 }),
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  units: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  helperText: {
    marginTop: 6,
    fontSize: 13,
  },
  errorText: {
    marginTop: 4,
    fontSize: 13,
    color: "#ef4444",
    fontWeight: "500",
  },
});

export default NumericInputField;
