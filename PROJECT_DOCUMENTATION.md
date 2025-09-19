# React Native Expo 54 Demo App - Project Documentation

## Overview

A modern React Native application built with Expo SDK 54, featuring native iOS-style UI components, dark mode support, diagnostics tooling, and various interactive demos. The app showcases best practices for mobile development with React Native and demonstrates the latest Expo features including native tabs with iOS 26 Liquid Glass effects.

## Project Setup

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript
- **Navigation**: Expo Router v6 with native tabs
- **Package Manager**: pnpm
- **Platform Support**: iOS and Android

## Key Features Implemented

### 1. Native Tab Navigation

- Implemented using Expo Router's unstable native tabs
- 5 main tabs: Home, Clock, Components, Diagnostics, More
- iOS 26 Liquid Glass tab bar effect support
- Badge indicator on the More tab
- SF Symbols for iOS, Material icons for Android

### 2. Global Dark Mode

- **Context-based theme management** (`contexts/ThemeContext.tsx`)
- Persistent theme preference using AsyncStorage
- Smooth transitions between light and dark themes
- Complete coverage across all screens and components
- Color palette:
  - Light: iOS-style grays (#F2F2F7 background, white cards)
  - Dark: True black (#000000) with dark gray cards (#1C1C1E)

### 3. Analog Clock Component

- **Custom SVG-based clock** (`components/AnalogClock.tsx`)
- Perfectly synchronized with digital time display
- Smooth second hand animation (50ms update interval)
- Hour markers with numbers
- Minute tick marks
- Dark mode support with adaptive colors
- Single time source to prevent drift

### 4. iOS-Style Settings Screen

- **Apple Settings app replica** (`app/(tabs)/more/index.tsx`)
- Grouped sections with rounded corners
- Icon badges and chevron indicators
- Interactive toggle switches
- Persistent settings using AsyncStorage:
  - Notifications preference
  - Location Services preference
  - Badge count
  - Dark mode preference
- Proper safe area handling

### 5. Home Screen with Demos

- Interactive demo cards showcasing app features
- Quick dark mode toggle
- Haptic feedback demos (light, medium, heavy)
- Navigation examples (modal, detail push)
- Feature shortcuts to Clock and Settings
- Apple-style card design with colored icons

### 6. Modal & Navigation

- Preview-enabled modal with swipe-to-dismiss
- Stack navigation for detail screens
- Proper navigation state management
- Dark mode support in modals

### 7. Diagnostics Dashboard

- Dedicated diagnostics tab with runtime metrics overview and log stream
- Infinite-scrolling virtualized list with severity-aware styling
- Maintenance scheduling date picker and numeric input for log window size
- Long-form notes input and lazy-loaded imagery highlight reusable form components
- Built with shared `components/common` primitives for portability across screens

## Technical Implementation Details

### State Management

- React Context API for theme management
- Local component state for UI interactions
- AsyncStorage for data persistence

### Styling Approach

- StyleSheet for base styles
- Dynamic styling based on theme context
- Consistent spacing and typography
- iOS design guidelines adherence

### Performance Optimizations

- 50ms clock update for smooth animation
- Memoized theme calculations
- Efficient re-renders with proper dependencies
- ScrollView optimization with proper content sizing

## File Structure

```
/app
  /(tabs)
    /_layout.tsx      # Tab navigation configuration
    /index.tsx        # Home screen with demos
    /clock.tsx        # Clock display screen
    /more
      /_layout.tsx    # Themed stack for additional demos
      /index.tsx      # Settings hub with persisted toggles
      /device.tsx     # Device and app metadata view
      /files.tsx      # File system sandbox explorer
      /glass.tsx      # Glassmorphism showcase
      /haptics.tsx    # Haptic feedback playground
      /links.tsx      # Modal previews and deep links
      /explore.tsx    # Explore feature highlights (push from More)
  /_layout.tsx        # Root layout with theme provider
  /modal.tsx          # Modal screen

/components
  /AnalogClock.tsx    # Reusable analog clock component
  /common             # Shared form controls and utility lists (date picker, numeric input, lazy image)

/contexts
  /ThemeContext.tsx   # Global theme management
```

## Dependencies Added

- `@react-native-async-storage/async-storage` - Data persistence
- `react-native-svg` - SVG rendering for clock
- `@expo/vector-icons` - Icon library
- `expo-haptics` - Haptic feedback
- `@react-native-community/datetimepicker` - Cross-platform native date/time picker component

## Current State

The application is fully functional with:

- ✅ Complete dark mode implementation
- ✅ Persistent user preferences
- ✅ Synchronized analog and digital clocks
- ✅ Apple-style UI components
- ✅ Interactive demos and navigation
- ✅ Proper TypeScript typing
- ✅ Responsive layouts with safe areas

## Known Limitations

- Native tabs are using Expo's unstable API (may change in future)
- iOS 26 Liquid Glass effect only available on compatible devices
- Some features are iOS-specific (SF Symbols, certain animations)

## Testing Recommendations

1. Test dark mode toggle persistence across app restarts
2. Verify clock synchronization accuracy
3. Test navigation flows on both iOS and Android
4. Validate settings persistence
5. Check tab bar appearance on different iOS versions

## Future Enhancements

- Add more interactive demos
- Implement push notifications
- Add user authentication
- Create more custom animations
- Add data visualization components
- Implement offline support
- Add localization support
- Automate screenshot capture across platforms (Maestro flows scaffolded in `maestro/`)

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm start

# Run on iOS
pnpm ios

# Run on Android
pnpm android

# Lint code
pnpm lint
```

## Conclusion

This project demonstrates a production-ready React Native application with modern best practices, persistent storage, beautiful UI/UX following iOS design guidelines, and comprehensive dark mode support. The codebase is clean, well-organized, and ready for further feature development.
