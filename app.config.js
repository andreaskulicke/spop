import { withAndroidManifest } from '@expo/config-plugins';

const withAndroidQueries = config => {
    return withAndroidManifest(
        config,
        config => {
            config.modResults.manifest["queries"] = [
                {
                    intent: [
                        {
                            action: [{ $: { 'android:name': 'android.intent.action.SENDTO' } }],
                            data: [{ $: { 'android:scheme': 'mailto' } }],
                        },
                    ],
                },
            ];
            return config;
        });
};

export default function ({ config }) {
    return withAndroidQueries(config);
};
