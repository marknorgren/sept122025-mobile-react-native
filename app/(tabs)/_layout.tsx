import React, { type ComponentProps, useMemo } from "react";
import { Platform } from "react-native";
import type { ColorValue, ImageSourcePropType } from "react-native";
import {
  NativeTabs,
  Label,
  Icon,
  VectorIcon,
  type NativeTabOptions,
  type NativeTabsLabelStyle,
  type NativeTabsTriggerTabBarProps,
} from "expo-router/unstable-native-tabs";
import { useTheme } from "@/contexts/ThemeContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function TabsLayout() {
  const { isDark, colors } = useTheme();
  const tabIconColor = isDark ? "#d1d5db" : "#6b7280";
  const tabLabelStyle = useMemo<NativeTabsLabelStyle>(
    () => ({
      fontSize: 12,
      color: tabIconColor,
      fontWeight: "500",
    }),
    [tabIconColor],
  );

  const sharedTabOptions = useMemo<NativeTabOptions>(
    () => ({
      iconColor: tabIconColor,
      selectedIconColor: tabIconColor,
      labelStyle: tabLabelStyle,
      selectedLabelStyle: tabLabelStyle,
    }),
    [tabIconColor, tabLabelStyle],
  );

  const tabBarProps = useMemo<NativeTabsTriggerTabBarProps>(
    () => ({
      blurEffect: "systemThinMaterial",
      iconColor: tabIconColor,
      indicatorColor: isDark ? "#f4f4f5" : "#111827",
      labelStyle: tabLabelStyle,
      backgroundColor: colors.tabBar,
      disableTransparentOnScrollEdge: true,
    }),
    [colors.tabBar, isDark, tabIconColor, tabLabelStyle],
  );

  const materialIconFamily = {
    getImageSource: (
      name: ComponentProps<typeof MaterialCommunityIcons>["name"],
      size: number,
      color: ColorValue,
    ): Promise<ImageSourcePropType> =>
      MaterialCommunityIcons.getImageSource(name, size, color).then(
        (source) => {
          if (!source) {
            throw new Error(
              `Unable to load MaterialCommunityIcon: ${String(name)}`,
            );
          }
          return source as ImageSourcePropType;
        },
      ),
  };

  return (
    <NativeTabs
      iconColor={tabIconColor}
      labelStyle={tabLabelStyle}
      tintColor={tabIconColor}
      backgroundColor={colors.tabBar}
    >
      {/* Global TabBar appearance (Liquid Glass on iOS 26 when available) */}
      <NativeTabs.Trigger name="index" options={sharedTabOptions}>
        <Label>Home</Label>
        {/* Use SF Symbols on iOS; fallback to vector icon elsewhere */}
        {Platform.OS === "ios" ? (
          <Icon sf="house.fill" />
        ) : (
          <Icon src={<VectorIcon family={materialIconFamily} name="home" />} />
        )}
        <NativeTabs.Trigger.TabBar {...tabBarProps} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="clock" options={sharedTabOptions}>
        <Label>Clock</Label>
        {Platform.OS === "ios" ? (
          <Icon sf="clock.fill" />
        ) : (
          <Icon
            src={
              <VectorIcon family={materialIconFamily} name="clock-outline" />
            }
          />
        )}
        <NativeTabs.Trigger.TabBar {...tabBarProps} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="components" options={sharedTabOptions}>
        <Label>Components</Label>
        {Platform.OS === "ios" ? (
          <Icon sf="square.grid.2x2.fill" />
        ) : (
          <Icon
            src={<VectorIcon family={materialIconFamily} name="view-grid" />}
          />
        )}
        <NativeTabs.Trigger.TabBar {...tabBarProps} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="diagnostics" options={sharedTabOptions}>
        <Label>Diagnostics</Label>
        {Platform.OS === "ios" ? (
          <Icon sf="waveform.path.ecg" />
        ) : (
          <Icon src={<VectorIcon family={materialIconFamily} name="pulse" />} />
        )}
        <NativeTabs.Trigger.TabBar {...tabBarProps} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="more" options={sharedTabOptions}>
        <Label>More</Label>
        {Platform.OS === "ios" ? (
          <Icon sf="ellipsis.circle.fill" />
        ) : (
          <Icon
            src={
              <VectorIcon family={materialIconFamily} name="dots-horizontal" />
            }
          />
        )}
        <NativeTabs.Trigger.TabBar {...tabBarProps} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
