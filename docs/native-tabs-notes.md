# Native Tabs Notes

These reminders capture the parts of the Native Tabs docs that matter for this project.

## Core Concepts

- `app/(tabs)/_layout.tsx` owns the tab bar. Each tab must be declared with `NativeTabs.Trigger name="route"` or it will not appear.
- Use the component APIs (`<Icon />`, `<Label />`, `<Badge />`) instead of React Navigation props. They map cleanly to native tab item configuration.
- Limit tabs on Android to five items. Anything beyond that should live behind the `more` pattern or a different navigator.

## Customization Tips

- Prefer SF Symbols on iOS (`<Icon sf="house.fill" />`) and fall back to vector icons via `<Icon src={<VectorIcon ... />} />` elsewhere.
- When using Liquid Glass, supply platform-aware colors (for example via `DynamicColorIOS` or the theme context) so icons stay legible.
- Badges come from `<Badge>` and can be updated at runtime by calling `navigation.setOptions({ badgeValue: ... })` inside the screen.
- Disable scroll-edge transparency with `disableTransparentOnScrollEdge` when rendering `FlatList` or scroll views that do not report edges reliably.

## Navigation Structure

- Native tabs do not auto-create stacks. Wrap tab routes that need headers or pushes inside their own `_layout.tsx` with `<Stack />`.
- Set per-screen titles and theme-aware header styling from the stack layout; Expo Router passes the theme through to React Navigation.
- Use `router.push('/(tabs)/more/device')` style paths to navigate into nested stack routes from within a tab.

## Limitations to Watch

- No nested native tabs; if you need tabs inside a tab, fall back to JS tabs.
- Custom bitmap icons are not supported on Android yet—stick to vector drawables.
- Tab bar height is not exposed; avoid layouts that depend on measuring it.

## Project Checklist

- Tabs layout declares the new `more` trigger and assigns the iOS `role="more"` for native styling.
- More tab wraps content in `app/(tabs)/more/_layout.tsx` with a themed stack.
- All screens inside the More stack pull colors from `useTheme` to support light and dark.
