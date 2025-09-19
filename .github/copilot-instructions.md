# Expo 54 React Native Demo App - Copilot Instructions

**ALWAYS follow these instructions first and only fallback to search or bash commands when you encounter unexpected information that does not match the info here.**

This is an Expo SDK 54 React Native application with native iOS/Android tabs, TypeScript, and comprehensive automation tooling. The app showcases modern React Native patterns with dark mode support, Expo Router navigation, and automated testing via Maestro.

## Working Effectively

### Bootstrap and Build Process
**CRITICAL**: Always run commands with adequate timeouts - builds may take several minutes. NEVER CANCEL long-running operations.

1. **Install dependencies** (2-35 seconds):
   ```bash
   pnpm install  # Initial: ~33s, with cache: ~3s
   ```

2. **Setup native projects** (3-5 seconds):
   ```bash
   pnpm prebuild  # NEVER CANCEL - timeout: 60s
   ```

3. **Validate code quality** (1-4 seconds each):
   ```bash
   pnpm typecheck     # TypeScript validation (~4s)
   pnpm lint          # ESLint validation (~4s) 
   pnpm format:check  # Prettier validation (~1s)
   ```

4. **Start development server** (15-30 seconds):
   ```bash
   pnpm start  # NEVER CANCEL - timeout: 60s
   # Press 'i' for iOS simulator, 'a' for Android emulator
   ```

### Platform-Specific Commands
- **iOS development**: `pnpm ios` (requires Xcode 15+ and macOS)
- **Android development**: `pnpm android` (requires Android Studio)
- **Web development**: `pnpm web` (has known expo-font compatibility issues - this is expected)
- **iOS device listing**: `pnpm ios:devices` (requires Xcode command line tools)

### Release and Distribution
- **iOS TestFlight automation**: `pnpm testflight` (requires .env configuration)
- **Fastlane iOS builds**: `bundle exec fastlane build` (NEVER CANCEL - timeout: 3600s)
- **Ruby dependencies**: `bundle install` (may require sudo on some systems)

## Validation Requirements

### CRITICAL Validation Scenarios
**ALWAYS test these scenarios after making changes:**

1. **Development Workflow Validation**:
   - Run `pnpm install && pnpm typecheck && pnpm lint && pnpm format:check`
   - Start dev server with `pnpm start` and verify it boots (wait for "Waiting on http://localhost:8081")
   - Test prebuild with `pnpm prebuild` to ensure native project generation works

2. **Code Quality Validation**:
   - **ALWAYS** run `pnpm lint` and `pnpm format` before committing
   - TypeScript must pass: `pnpm typecheck`
   - No ESLint warnings allowed: `pnpm lint --max-warnings 0`

3. **Manual Testing Scenarios** (when dev server is running):
   - Navigate to all tab screens: Home, Clock, More 
   - Test dark/light mode toggle persistence
   - Verify modal navigation and stack navigation work
   - Test settings persistence across app restarts

### Timeout Requirements and Timing Expectations
**NEVER CANCEL operations before these timeouts:**

| Command | Expected Time | Timeout Setting | Notes |
|---------|---------------|-----------------|-------|
| `pnpm install` (fresh) | 30-35 seconds | 120s | Downloads all packages |
| `pnpm install` (cached) | 2-3 seconds | 30s | Uses existing cache |
| `pnpm prebuild` | 3-5 seconds | 60s | Generates iOS/Android projects |
| `pnpm start` | 15-30 seconds | 60s | Starts Metro bundler |
| `pnpm typecheck` | 3-4 seconds | 30s | TypeScript validation |
| `pnpm lint` | 3-4 seconds | 30s | ESLint validation |
| `bundle install` | 30-60 seconds | 120s | Ruby gems for Fastlane |
| `bundle exec fastlane build` | 5-45 minutes | 3600s | iOS archive process |

## Project Structure and Key Locations

### Core Application Structure
```
app/                     # Expo Router screens
├── (tabs)/             # Native tab navigation
│   ├── _layout.tsx     # Tab bar configuration 
│   ├── index.tsx       # Home screen with demos
│   ├── clock.tsx       # Analog clock with SVG
│   └── more/           # Settings and additional screens
│       ├── _layout.tsx # Themed stack navigation
│       ├── index.tsx   # Settings hub with toggles
│       ├── device.tsx  # Device information
│       ├── files.tsx   # File system playground
│       ├── glass.tsx   # Glassmorphism showcase
│       ├── haptics.tsx # Haptic feedback demos
│       ├── links.tsx   # Link previews & browser
│       └── explore.tsx # Feature highlights
├── _layout.tsx         # Root layout with theme provider
├── details.tsx         # Stack navigation demo
└── modal.tsx           # Modal presentation demo

components/             # Reusable UI components
├── AnalogClock.tsx     # SVG-based clock component
└── common/             # Shared form controls and utilities

contexts/               # React context providers
└── ThemeContext.tsx    # Theme management with persistence

maestro/                # UI automation and testing
├── flows/              # Cross-platform test flows
├── README.md           # Maestro setup instructions
└── screenshots/        # Generated artifacts

scripts/                # Build and automation utilities
└── capture-screenshots.mjs  # Maestro screenshot runner

docs/                   # Project documentation
├── ios-testflight.md   # TestFlight deployment guide
├── DEMO_PLAN.md        # Feature showcase plan
└── native-tabs-notes.md # Native tabs implementation notes
```

### Frequently Modified Files
**Always check these files when making UI changes:**
- `contexts/ThemeContext.tsx` - Design tokens and theme persistence
- `app/(tabs)/_layout.tsx` - Tab bar configuration and styling  
- `app/_layout.tsx` - Root navigation and theme provider setup
- `app.config.ts` - Expo configuration and build settings

### Important Configuration Files
- `package.json` - All build scripts and dependencies
- `app.config.ts` - Expo app configuration (bundle IDs, icons, etc)
- `tsconfig.json` - TypeScript compiler settings
- `eslint.config.js` - Linting rules and exclusions
- `.env.example` - Environment variables template for iOS builds
- `Gemfile` - Ruby dependencies for Fastlane automation

## Common Development Tasks

### Making UI Changes
1. Modify components in `components/` or screens in `app/`
2. Always run `pnpm lint` and `pnpm format` before committing
3. Test in both light and dark modes using the settings toggle
4. Verify changes work on the intended platforms (iOS/Android/web)

### Adding New Screens
1. Create screen files in appropriate `app/` subdirectories
2. Update navigation in `app/(tabs)/_layout.tsx` if adding tabs
3. Ensure theme-aware styling using `useTheme()` hook
4. Add TypeScript route types automatically generate with typed routes

### Theme and Styling Changes
1. Update design tokens in `contexts/ThemeContext.tsx` first
2. Use `useTheme()` hook for theme-aware components
3. Follow 2-space indentation and colocate `StyleSheet.create` blocks
4. Test persistence across app restarts and mode switches

### Testing and Screenshots
**Note**: Maestro CLI not installed by default. Install with `brew install maestro` if needed.

1. **Manual testing**: Start `pnpm start` and test user workflows
2. **Automated screenshots**: `pnpm screenshots` (requires Maestro and simulators)
3. **Environment overrides**:
   - `IOS_SIMULATOR="iPhone 15"` - Target specific iOS simulator
   - `ANDROID_EMULATOR="emulator-5554"` - Target specific Android emulator
   - `SKIP_IOS=1` / `SKIP_ANDROID=1` - Skip platform-specific flows

## Build Requirements and Dependencies

### Prerequisites
- **Node.js**: 18+ (project uses 20.19.4)
- **pnpm**: 9+ for package management (faster than npm/yarn)
- **Xcode**: 15+ for iOS builds (macOS only)
- **Android Studio**: For Android builds and emulators
- **Ruby**: 3.x with Bundler for Fastlane automation
- **Maestro CLI**: Optional, for screenshot automation

### Known Limitations and Workarounds
- **Web builds**: expo-font compatibility issues are normal - use native platforms for testing
- **Bundle install**: May require `sudo` on some systems due to gem permissions
- **iOS builds**: Only work on macOS with Xcode installed
- **Android builds**: Require Android SDK and emulator setup
- **Networking**: Development server runs in CI mode when `CI=true` (reloads disabled)

### Dependency Validation
The project shows these expected version warnings (safe to ignore):
- `@react-native-community/datetimepicker@8.4.5` vs expected `8.4.4`
- `expo-constants@18.0.8` vs expected `~18.0.9`
- `expo-file-system@19.0.13` vs expected `~19.0.14`
- `expo-router@6.0.2` vs expected `~6.0.6`
- `expo-splash-screen@31.0.9` vs expected `~31.0.10`
- `react-native-svg@15.13.0` vs expected `15.12.1`

## iOS TestFlight Deployment

### Setup Requirements (one-time)
1. Copy and configure environment: `cp .env.example .env`
2. Install Ruby dependencies: `bundle install`
3. Install iOS pods: `cd ios && pod install` (after prebuild)

### Required Environment Variables
Set these in `.env` file for TestFlight automation:
- `APPLE_ID` / `FASTLANE_USER` - Apple Developer account
- `APPLE_TEAM_ID` - Developer team ID  
- `MATCH_GIT_URL` - Certificates repository
- `MATCH_PASSWORD` - Match encryption password
- `APP_STORE_CONNECT_API_KEY_ID` - API key ID
- `APP_STORE_CONNECT_ISSUER_ID` - API issuer ID
- `APP_STORE_CONNECT_API_KEY_CONTENT` - Base64 encoded p8 key

### Deployment Commands
```bash
bundle exec fastlane build          # NEVER CANCEL - timeout: 3600s
bundle exec fastlane upload_testflight  # Upload to TestFlight
bundle exec fastlane deploy         # Build + upload combined
```

## Troubleshooting

### Common Issues
- **"Maestro CLI not found"**: Install with `brew install maestro`
- **"Bundle install permission errors"**: Try `sudo bundle install`
- **"Cannot automatically write to dynamic config"**: Android package missing in app.config.ts - this is a known issue that needs to be fixed in a separate PR by adding `package: process.env.BUNDLE_ID || process.env.APP_IDENTIFIER || 'com.example.app'` to the android section
- **"Metro bundler fails to start"**: Check for port 8081 conflicts
- **"iOS build fails"**: Verify Xcode is installed and certificates are configured

### Performance Notes
- Use `pnpm` instead of `npm` for faster installs and better caching
- Clean installs are very fast (2-3s) when dependencies are cached
- Development server startup may take 15-30 seconds - wait for "Waiting on http://localhost:8081"
- TypeScript and linting are fast (3-4s each) due to project size

## Before Committing Changes
**ALWAYS run this validation sequence:**
```bash
pnpm typecheck    # Must pass with no errors
pnpm lint         # Must pass with no warnings  
pnpm format       # Fix any formatting issues
```

**For UI changes, also run:**
```bash
pnpm start        # Test in development mode
# Manually test affected user workflows
# Verify both light and dark themes work
```

**For release builds:**
```bash
pnpm prebuild    # Ensure native projects generate correctly
# Run screenshot automation if UI changed: pnpm screenshots
```