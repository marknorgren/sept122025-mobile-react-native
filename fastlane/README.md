fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios bootstrap_app

```sh
[bundle exec] fastlane ios bootstrap_app
```

Create the App ID and App Store Connect record if they do not exist yet

### ios sync_signing

```sh
[bundle exec] fastlane ios sync_signing
```

Ensure signing assets are available via match

### ios build

```sh
[bundle exec] fastlane ios build
```

Archive the iOS app for distribution

### ios upload_testflight

```sh
[bundle exec] fastlane ios upload_testflight
```

Upload the most recent IPA to TestFlight

### ios deploy

```sh
[bundle exec] fastlane ios deploy
```

Build and upload to TestFlight

### ios upload

```sh
[bundle exec] fastlane ios upload
```

Upload an already-built IPA to TestFlight

### ios doctor

```sh
[bundle exec] fastlane ios doctor
```

Run validations without building

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
