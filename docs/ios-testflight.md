# iOS Archive & TestFlight Playbook

This guide explains how to archive the Expo native project and push a build to TestFlight. It
follows the workspace standards captured in `~/working/IOS.md`,
`~/working/ios-automation-design.md`, and `~/working/iOS-TestFlight-Automation-Design.md`.

## Prerequisites

- Xcode 15.4+ and command line tools installed (`xcode-select -p`)
- Ruby 3.x with Bundler (managed by rbenv or rvm)
- Cocoapods already installed (`sudo gem install cocoapods`)
- Access to your Match certificates repository (for example `git@github.com:example/mobile-certs.git`)
- App Store Connect API key (p8) with `App Manager` permissions

From the repository root:

```bash
# Install ruby tooling
gem install bundler
bundle install

# Install iOS pods (once after prebuild)
cd ios
pod install
```

## Environment configuration

Create a `.env` file from the template and fill in the secrets:

```bash
cp .env.example .env
```

Required variables:

| Variable | Purpose |
| --- | --- |
| `APPLE_ID` / `FASTLANE_USER` | Apple ID used for Match and uploads |
| `APPLE_TEAM_ID` | Developer team ID |
| `MATCH_GIT_URL` | Certificates repository URL |
| `MATCH_PASSWORD` | Encryption password for Match repo |
| `APP_STORE_CONNECT_API_KEY_ID` | Key ID for App Store Connect API |
| `APP_STORE_CONNECT_ISSUER_ID` | Issuer ID for the API key |
| `APP_STORE_CONNECT_API_KEY_CONTENT` | Base64 encoded contents of the p8 key (raw PEM also supported) |
| `FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD` | Required if falling back to Apple ID auth |

Optional toggles:

- `SKIP_WAITING=true` to return immediately after upload
- `DISTRIBUTE_EXTERNAL=true` to submit to external testers
- `CHANGELOG="Bug fixes and improvements"` to send a custom note

## One-time setup check

```bash
bundle exec fastlane bootstrap_app   # Creates App ID + ASC record
bundle exec fastlane doctor    # Verifies Match and App Store Connect access
```

If Match reports missing certificates, run:

```bash
bundle exec fastlane sync_signing
```

## Build & upload workflow

```bash
# 1. Ensure native project is current
pnpm prebuild

# 2. Archive with Fastlane (creates ./build/sept122025.ipa)
bundle exec fastlane build

# 3. Upload to TestFlight (reuses generated IPA)
bundle exec fastlane upload_testflight

# 4. Or run both steps together
bundle exec fastlane deploy
```

The lanes use manual code signing with the Match-provisioned "Apple Distribution" profile and set
build numbers using the `YYMMDDHHMMSS` timestamp format when none is provided.

## Troubleshooting

- **`IPA not found`** – run `bundle exec fastlane build` before `upload_testflight` or provide
  `bundle exec fastlane upload_testflight ipa_path=path/to/file.ipa`
- **Signing failures** – delete stale certificates via `Keychain Access`, then re-run
  `bundle exec fastlane sync_signing`
- **API key errors** – confirm the p8 content is base64 encoded (use `base64 < AuthKey.p8`)
- **`invalid curve name` error** – install latest Command Line Tools (`xcode-select --install`), or
  fall back to Apple ID auth by exporting `FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD`
- **Bundle ID missing** – run `bundle exec fastlane bootstrap_app` once to register your
  bundle identifier in the developer portal and App Store Connect.
- **Build number conflicts** – export `BUILD_NUMBER=1234` when re-uploading a hotfix build

## CI/CD alignment

The lanes match the reusable design in `~/working/ios-automation-design.md`. A GitHub Actions
workflow can re-use them by running `bundle exec fastlane build` in an archive job, storing the
artifact, and calling `bundle exec fastlane upload_testflight` from a deploy job.

## Next steps

- Populate `.env` with production credentials
- Run `bundle exec fastlane deploy`
- Verify the build appears in App Store Connect → TestFlight
