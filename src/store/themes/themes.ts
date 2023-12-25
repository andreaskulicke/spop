import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { yellowDark, yellowLight } from "./yellow";
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { MD3DarkTheme, MD3LightTheme, adaptNavigationTheme } from 'react-native-paper';
import merge from 'deepmerge';
import { yellowDarkerDark, yellowDarkerLight } from "./yellowDarker";
import { orangeDark, orangeLight } from "./orange";
import { orangeDarkerDark, orangeDarkerLight } from "./orangeDarker";
import { redDark, redLight } from "./red";
import { pinkDark, pinkLight } from "./pink";
import { violetDark, violetLight } from "./violet";
import { violetDarkerDark, violetDarkerLight } from "./violetDarker";
import { blueDark, blueLight } from "./blue";
import { lightBlueDark, lightBlueLight } from "./lightBlue";
import { greenDark, greenLight } from "./green";
import { brownDark, brownLight } from "./brown";
import { greyDark, greyLight } from "./grey";

export type ThemeName = "default"
    | "yellow"
    | "yellowDarker"
    | "orange"
    | "orangeDarker"
    | "red"
    | "pink"
    | "violet"
    | "violetDarker"
    | "blue"
    | "lightBlue"
    | "green"
    | "brown"
    | "grey"
    ;

const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

export type ThemeType = typeof CombinedDefaultTheme;

export const themes: {
    id: ThemeName;
    label: string;
    dark: ThemeType;
    light: ThemeType;
}[] = [
        {
            id: "default",
            label: "Standard",
            dark: CombinedDarkTheme,
            light: CombinedDefaultTheme,
        },
        {
            id: "yellow",
            label: "Gelb",
            dark: mergeDarkColors(yellowDark),
            light: mergeLightColors(yellowLight),
        },
        {
            id: "yellowDarker",
            label: "Dunkleres Gelb",
            dark: mergeDarkColors(yellowDarkerDark),
            light: mergeLightColors(yellowDarkerLight),
        },
        {
            id: "orange",
            label: "Orange",
            dark: mergeDarkColors(orangeDark),
            light: mergeLightColors(orangeLight),
        },
        {
            id: "orangeDarker",
            label: "Dunkleres Orange",
            dark: mergeDarkColors(orangeDarkerDark),
            light: mergeLightColors(orangeDarkerLight),
        },
        {
            id: "red",
            label: "Rot",
            dark: mergeDarkColors(redDark),
            light: mergeLightColors(redLight),
        },
        {
            id: "pink",
            label: "Pink",
            dark: mergeDarkColors(pinkDark),
            light: mergeLightColors(pinkLight),
        },
        {
            id: "violet",
            label: "Violett",
            dark: mergeDarkColors(violetDark),
            light: mergeLightColors(violetLight),
        },
        {
            id: "violetDarker",
            label: "Dunkleres Violett",
            dark: mergeDarkColors(violetDarkerDark),
            light: mergeLightColors(violetDarkerLight),
        },
        {
            id: "blue",
            label: "Blau",
            dark: mergeDarkColors(blueDark),
            light: mergeLightColors(blueLight),
        },
        {
            id: "lightBlue",
            label: "Hellblau",
            dark: mergeDarkColors(lightBlueDark),
            light: mergeLightColors(lightBlueLight),
        },
        {
            id: "green",
            label: "Grün",
            dark: mergeDarkColors(greenDark),
            light: mergeLightColors(greenLight),
        },
        {
            id: "brown",
            label: "Braun",
            dark: mergeDarkColors(brownDark),
            light: mergeLightColors(brownLight),
        },
        {
            id: "grey",
            label: "Grau",
            dark: mergeDarkColors(greyDark),
            light: mergeLightColors(greyLight),
        },
    ];

function mergeDarkColors(colors: { colors: MD3Colors }) {
    return { ...CombinedDarkTheme, colors: { ...CombinedDarkTheme.colors, ...colors.colors } }
}

function mergeLightColors(colors: { colors: MD3Colors }) {
    return { ...CombinedDefaultTheme, colors: { ...CombinedDefaultTheme.colors, ...colors.colors } }
}
