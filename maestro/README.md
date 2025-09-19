# Maestro screenshot automation

Set `MAESTRO_APP_ID` to the bundle identifier of the build you want to exercise (for example,
`com.example.app`). These flows assume the matching development build is installed on your
simulator and emulator. Install it with the Expo tooling (e.g. `pnpm ios` / `pnpm android`) or
manually with `xcrun simctl install` / `adb install` before executing the flows.

## Local usage

1. Start the Expo development server in a separate shell:

   ```bash
   pnpm install
   pnpm start -- --dev-client
   ```

2. Launch the iOS simulator (e.g. `xcrun simctl boot "iPhone 15"`) and ensure the
   development build is installed.
3. Run the flow:

   ```bash
   IOS_SIMULATOR="iPhone 15" maestro test maestro/flows/screenshots-ios.yaml
   ```

4. Repeat for Android, substituting the emulator name and flow file. Example:

   ```bash
   ANDROID_EMULATOR="emulator-5554" maestro test maestro/flows/screenshots-android.yaml
   ```

Screenshots are written to `.maestro/tests/<timestamp>/artifacts/` by default. The helper
script `pnpm screenshots` copies them into `artifacts/<platform>` for convenience.
