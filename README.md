# Expo 54 Native Tabs Demo

A polished Expo Router demo showcasing the new native tab bar on iOS 17 / iPadOS 17 (NativeTabs
API), dark-mode theming, and a collection of feature playgrounds built on Expo SDK 54 with
React Native 0.81.

## Highlights

- Native bottom tabs powered by `expo-router/unstable-native-tabs`, including iOS 17 Liquid
  Glass styling and Android badge support.
- Persistent light/dark theme switch backed by AsyncStorage, with a shared design token layer.
- Diagnostics dashboard with live log feed, virtualized list, date picker, and numeric inputs
  built from reusable common components.
- iOS-inspired Settings screen with native toggles, badges, and automatic tab badge updates.
- Animated analog clock using `react-native-svg` and `expo-linear-gradient`.
- Interactive demos for haptics, in-app browser, file system (with platform guards), device info,
  and glassmorphism cards using `expo-blur`.

## Demo screens

- Home: launch pad with quick settings, feature cards, and haptic demos
- Diagnostics: runtime metrics, synthetic telemetry feed, long-form notes, and date scheduling
- Clock: SVG-based analog clock synced with digital time
- Settings: iOS-style grouped list with persistence and live tab badge updates
- Explore: navigation showcase for stacked routes and modals
- Files: platform-guarded file system playground using Expo FileSystem legacy APIs

## Prerequisites

- Node 18+
- pnpm 9 (or npm/yarn)
- Xcode 15+ for iOS simulators, Android Studio for emulators
- [Maestro](https://maestro.mobile.dev/) CLI for automated screenshots (optional)

## Run locally

```bash
pnpm install
pnpm start
```

Press `i` or `a` in the Expo CLI to launch the development build on iOS or Android.

## Capture automated screenshots

1. Install the Maestro CLI (`brew tap mobile-dev-inc/tap && brew install maestro`) and ensure
   development builds of the app are installed on your simulator/emulator
   (use `eas build --profile development`).
2. Start the Expo dev server in a separate terminal: `pnpm start -- --dev-client`.
3. Run the helper script:

   ```bash
   pnpm screenshots
   ```

Screenshots are copied into `artifacts/ios` and `artifacts/android`. The raw Maestro results remain
under `.maestro/tests/*/artifacts/`.

Environment overrides:

- `IOS_SIMULATOR`: name or UDID of the booted iOS simulator to target
  (e.g. `"iPhone 15"`).
- `ANDROID_EMULATOR`: emulator id to target (e.g. `"emulator-5554"`).
- `SKIP_IOS=1` / `SKIP_ANDROID=1`: skip the respective flow when taking screenshots.

Refer to `maestro/README.md` for more detail.

## Publishing checklist

- Update `app.json` with the correct slug, scheme, and store metadata before shipping builds
- Ensure linting passes (`pnpm lint`) and the app boots on both platforms (`pnpm ios` / `pnpm android`)
- Commit lockfiles (`pnpm-lock.yaml` or `package-lock.json`) so CI and collaborators install matching deps
- Run Maestro screenshot flows (`pnpm screenshots`) to refresh marketing assets when visual changes land
- Replace demo icons and images in `assets/` with production-ready artwork prior to release

## Project structure

```
app/                # Expo Router routes (tabs, modal, details)
components/         # Shared view components (AnalogClock, ErrorBoundary)
  common/           # Reusable inputs (date picker, numeric field, lazy image, long list)
contexts/           # Theme provider with persistence
services/           # Core services (logging, remote sink)
  logging/          # Logging abstraction with console and remote sinks
hooks/              # Custom React hooks (error reporting)
maestro/            # Cross-platform UI automation flows
scripts/            # Utility scripts (screenshots)
assets/             # App icons, splash, imagery
```

## Logging and Error Handling

The app includes a comprehensive logging and error handling system:

### Logging Service

```typescript
import { logger } from '@/services/logging';

// Log at different levels
logger.debug('Debug message', { context: 'data' });
logger.info('Information message', { userId: 123 });
logger.warn('Warning message', { component: 'MyComponent' });
logger.error('Error message', error, { context: 'additional info' });

// Get all logs (useful for diagnostics)
const logs = logger.getLogs();

// Clear logs
logger.clearLogs();
```

### Error Reporting Hook

```typescript
import { useErrorReporting } from '@/hooks';

function MyComponent() {
  const { reportError, reportWarning, withErrorReporting } = useErrorReporting();

  // Manual error reporting
  const handleError = () => {
    try {
      // some operation
    } catch (error) {
      reportError(error, { component: 'MyComponent' });
    }
  };

  // Automatic error wrapping
  const safeAsyncOperation = withErrorReporting(
    async () => {
      // async operation that might fail
    },
    { operation: 'dataFetch' }
  );
}
```

### Global Error Boundary

The app automatically catches and logs unhandled JavaScript errors. All errors are logged to the diagnostics system and can be viewed in the Diagnostics tab.

### Configuration

In production, configure remote logging by setting environment variables:

```bash
EXPO_PUBLIC_LOG_ENDPOINT=https://your-logging-service.com/logs
EXPO_PUBLIC_LOG_API_KEY=your-api-key
```

The logging service will:
- Log to console in development
- Send logs to remote endpoint in production
- Maintain a local buffer of recent log entries
- Automatically include error context and stack traces

## Tech stack

- Expo SDK 54 / React Native 0.81
- Expo Router 6 with typed routes
- React Native Reanimated 4.1 for future animation demos
- Expo Blur, Haptics, Linear Gradient, Web Browser, Async Storage
- Maestro for cross-platform UI automation

## Releasing builds

The project includes full Fastlane automation for archiving and TestFlight uploads. See
`docs/ios-testflight.md` for the end-to-end playbook. Typical workflow:

```bash
bundle install
cp .env.example .env   # fill in Apple credentials
pnpm prebuild          # keep ios/ project current
bundle exec fastlane build
bundle exec fastlane upload_testflight
```

Use `bundle exec fastlane deploy` to run both steps together once signing and App Store Connect
credentials are configured.

## License

MIT
