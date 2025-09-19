# Expo 54 Demo Coverage Plan

This document outlines the current showcase screens in the Expo 54 native tabs demo along with
recommended future additions to highlight recent platform features.

## Existing Demos

| Route                  | Description                                           | Expo / RN features                                  |
| ---------------------- | ----------------------------------------------------- | --------------------------------------------------- |
| `/(tabs)/index` (Home) | Overview cards, haptic triggers, navigation shortcuts | Native Tabs, Expo Haptics, Modal & stack navigation |
| `/(tabs)/clock`        | Animated analog clock with SVG rendering              | `react-native-svg`, theme-aware styling             |
| `/(tabs)/more`         | iOS-style Settings with persistence and badges        | AsyncStorage, Native Tabs badge + stack navigation  |
| `/(tabs)/more/explore` | Highlights feature list and navigation CTA            | Native stack push from More menu                    |
| `/details`             | Stack navigation with push depth tracking             | Expo Router stack, typed routes                     |
| `/modal`               | Preview-enabled modal with dismissal button           | Expo Router modal presentation                      |
| `/(tabs)/files`        | File system read/write demo with platform guards      | `expo-file-system` (legacy API)                     |
| `/(tabs)/device`       | Device/app info pulled from constants                 | `expo-constants`, React Native core                 |
| `/(tabs)/links`        | Link previews, context menu, in-app browser           | Expo Router link previews, Expo Web Browser         |
| `/(tabs)/haptics`      | Extended haptic feedback playground                   | Expo Haptics                                        |
| `/(tabs)/glass`        | Glassmorphism cards with blur & gradients             | Expo Blur, Linear Gradient                          |

## Planned Automation

Maestro flows (`maestro/flows/`) cover:

- Launch → Home → More → Explore detail
- Details stack push
- Modal presentation
- Screenshot capture for each state (iOS + Android)

Artifacts are exported via `pnpm screenshots` and stored under `artifacts/<platform>`.

## Future Demo Ideas

1. **Worklets Playground** – showcase `react-native-worklets` for concurrent UI updates.
2. **Predictive Back Gesture** – Android 14 navigation preview animation.
3. **Expo Camera & Vision** – barcode/QR scanning using the updated Camera module.
4. **React Compiler Comparison** – toggle compiled vs traditional components to highlight
   the new React Compiler opt-in (already enabled in `app.json`).
5. **Audio/Video Player** – demonstrate the Expo AV module with background audio controls.
6. **Expo Modules Native Add-on** – custom module (battery info or system metrics) to show
   the new Expo Modules API workflow.
7. **Localization Demo** – language switcher using Expo Localization & settings bundle.
8. **Gesture-driven Animation** – card deck or bottom sheet using `react-native-gesture-handler`
   - Reanimated 4 to emphasize gesture improvements.

Each addition should include:

- A route under `app/(tabs)/` or nested stack
- Theme-aware styling and AsyncStorage integration when applicable
- Optional Maestro step to capture screenshots once finalized

## CI/Automation Considerations

- Add GitHub Actions workflows (macOS + Ubuntu) to run `pnpm screenshots` and upload artifacts.
- Cache `node_modules`/`pnpm-store` to speed up automation.
- Ensure simulators/emulators are booted and the dev build is installed before running Maestro.

## Release Checklist

- [ ] Update README with new demos
- [ ] Add Maestro steps covering new routes
- [ ] Refresh screenshots in `artifacts/`
- [ ] Validate `npx tsc --noEmit` and `pnpm lint`
- [ ] Run Expo E2E tests (if applicable)
