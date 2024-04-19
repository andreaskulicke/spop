# Spop the weekly shopper

# How to build apk for local installation?

```
eas build -p android --profile preview
```

# How to build aab for google play store submission?

Make sure to increase `versionCode` in `app.json`.
To make sure the important `versionCode` in `build.gradle` is updated run:

```
npx expo prebuild
```

To build and submit:

```
eas build -p android --auto-submit
```

Or submit only:

```
eas submit -p android
```
