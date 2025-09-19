import { useTheme } from "@/contexts/ThemeContext";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

const IOS_DISPLAY_VALUES = ["default", "spinner", "compact", "inline"] as const;

type IOSDisplayValue = (typeof IOS_DISPLAY_VALUES)[number];

const ANDROID_DISPLAY_VALUES = ["default", "spinner", "clock", "calendar"] as const;

type AndroidDisplayValue = (typeof ANDROID_DISPLAY_VALUES)[number];

type DatePickerDisplay = IOSDisplayValue | AndroidDisplayValue;

const isIOSDisplay = (value: DatePickerDisplay | undefined): value is IOSDisplayValue => {
  if (value === undefined) {
    return false;
  }
  return IOS_DISPLAY_VALUES.includes(value as IOSDisplayValue);
};

const isAndroidDisplay = (value: DatePickerDisplay | undefined): value is AndroidDisplayValue => {
  if (value === undefined) {
    return false;
  }
  return ANDROID_DISPLAY_VALUES.includes(value as AndroidDisplayValue);
};

const resolveAndroidTimeDisplay = (display: DatePickerDisplay | undefined) => {
  if (display === "clock" || display === "spinner") {
    return display;
  }
  return undefined;
};

type PickerMode = "date" | "time" | "datetime";

type DatePickerFieldProps = {
  label?: string;
  helperText?: string;
  error?: string;
  placeholder?: string;
  mode?: PickerMode;
  locale?: string;
  is24Hour?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
  value?: Date | null;
  onChange?: (value: Date) => void;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  helperTextStyle?: StyleProp<TextStyle>;
  errorTextStyle?: StyleProp<TextStyle>;
  modalContainerStyle?: StyleProp<ViewStyle>;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  display?: DatePickerDisplay;
};

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  helperText,
  error,
  placeholder = "Select date",
  mode = "date",
  locale,
  is24Hour = true,
  minimumDate,
  maximumDate,
  value,
  onChange,
  containerStyle,
  labelStyle,
  inputStyle,
  helperTextStyle,
  errorTextStyle,
  modalContainerStyle,
  confirmButtonLabel = "Done",
  cancelButtonLabel = "Cancel",
  display,
}) => {
  const { colors, isDark } = useTheme();
  const [iosVisible, setIosVisible] = useState(false);
  const [iosDraftDate, setIosDraftDate] = useState<Date>(value ?? new Date());

  useEffect(() => {
    if (value) {
      setIosDraftDate(value);
    }
  }, [value]);

  const formatter = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = {};
    if (mode === "time") {
      options.hour = "numeric";
      options.minute = "numeric";
    } else {
      options.year = "numeric";
      options.month = "short";
      options.day = "numeric";
      if (mode === "datetime") {
        options.hour = "numeric";
        options.minute = "numeric";
      }
    }
    if (typeof Intl !== "undefined" && typeof Intl.DateTimeFormat === "function") {
      return new Intl.DateTimeFormat(locale ?? undefined, options);
    }
    return null;
  }, [locale, mode]);

  const displayValue = value
    ? (formatter?.format(value) ?? value.toLocaleString(locale))
    : placeholder;
  const hasError = Boolean(error);

  const openIOSPicker = () => {
    setIosDraftDate(value ?? new Date());
    setIosVisible(true);
  };

  const openAndroidPicker = () => {
    const initialDate = value ?? new Date();

    const openTimePicker = (selectedDate: Date) => {
      DateTimePickerAndroid.open({
        value: selectedDate,
        onChange: (event, date) => {
          if (event.type === "dismissed" || !date) {
            return;
          }
          onChange?.(date);
        },
        mode: "time",
        is24Hour,
        display: resolveAndroidTimeDisplay(display),
      });
    };

    DateTimePickerAndroid.open({
      value: initialDate,
      onChange: (event: DateTimePickerEvent, date?: Date) => {
        if (event.type === "dismissed" || !date) {
          return;
        }
        if (mode === "datetime") {
          openTimePicker(date);
        } else {
          onChange?.(date);
        }
      },
      mode: mode === "time" ? "time" : "date",
      is24Hour,
      minimumDate,
      maximumDate,
      display: isAndroidDisplay(display) ? display : undefined,
    });
  };

  const handlePress = () => {
    if (Platform.OS === "android") {
      openAndroidPicker();
    } else {
      openIOSPicker();
    }
  };

  const handleIOSConfirm = () => {
    setIosVisible(false);
    onChange?.(iosDraftDate);
  };

  const handleIOSCancel = () => {
    setIosVisible(false);
  };

  const handleIOSChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setIosDraftDate(selectedDate);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { color: colors.text }, labelStyle]}>{label}</Text>
      ) : null}
      <Pressable
        onPress={handlePress}
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.cardBackground,
            borderColor: hasError ? "#ef4444" : colors.separator,
          },
        ]}
      >
        <Text style={[styles.input, { color: value ? colors.text : colors.subtitle }, inputStyle]}>
          {displayValue}
        </Text>
      </Pressable>
      {helperText ? (
        <Text style={[styles.helperText, { color: colors.subtitle }, helperTextStyle]}>
          {helperText}
        </Text>
      ) : null}
      {hasError ? <Text style={[styles.errorText, errorTextStyle]}>{error}</Text> : null}

      {Platform.OS === "ios" ? (
        <Modal
          transparent
          animationType="fade"
          visible={iosVisible}
          onRequestClose={handleIOSCancel}
        >
          <View style={styles.modalBackdrop}>
            <Pressable style={styles.modalScrim} onPress={handleIOSCancel} />
            <View
              style={[
                styles.modalCard,
                { backgroundColor: colors.cardBackground },
                modalContainerStyle,
              ]}
            >
              <DateTimePicker
                value={iosDraftDate}
                mode={mode}
                display={isIOSDisplay(display) ? display : undefined}
                onChange={handleIOSChange}
                locale={locale}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                style={styles.iosPicker}
                themeVariant={isDark ? "dark" : "light"}
                textColor={colors.text}
              />
              <View style={styles.modalActions}>
                <Pressable style={styles.modalButton} onPress={handleIOSCancel}>
                  <Text style={styles.modalButtonText}>{cancelButtonLabel}</Text>
                </Pressable>
                <Pressable style={styles.modalButton} onPress={handleIOSConfirm}>
                  <Text style={[styles.modalButtonText, styles.modalButtonPrimary]}>
                    {confirmButtonLabel}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
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
    paddingVertical: 14,
  },
  input: {
    fontSize: 16,
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
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
  },
  modalScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalCard: {
    borderRadius: 16,
    padding: 12,
  },
  iosPicker: {
    width: "100%",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6b7280",
  },
  modalButtonPrimary: {
    color: "#2563eb",
  },
});

export default DatePickerField;
