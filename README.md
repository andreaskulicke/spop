# Spop the weekly shopper

# How to build apk for local installation?

```
eas build -p android --profile preview
```

# How to build aab for google play store submission?

Make sure to increase `version` in `app.json` and ``package.json`.
Run:

```
npx expo prebuild --clean
```

To build and submit:

```
eas build -p android --auto-submit
```

Or submit only:

```
eas submit -p android
```

Go to Google developer console:

<https://play.google.com/console/u/0/developers/4745463921180105365/app-list>
