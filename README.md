# Spop the weekly shopper

## Preconditions

```cmd
npm install --global eas-cli
```

## How to build apk for local installation?

```cmd
eas build -p android --profile preview
```

## How to build aab for google play store submission?

Make sure to increase `version` in `app.json` and ``package.json`.
Run:

```cmd
npx expo prebuild --clean
```

To build and submit:

```cmd
eas build -p android --auto-submit
```

Or submit only:

```cmd
eas submit -p android
```

Go to Google developer console:

<https://play.google.com/console/u/0/developers/4745463921180105365/app-list>
