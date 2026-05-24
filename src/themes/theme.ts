import { createTheme, createBox, createText, BaseTheme } from '@shopify/restyle';

import { palette } from './palette';

// ---------------------------------------------------------------------------
// Color token keys — shared contract between light and dark themes.
// Both themes must provide every key listed here.
// ---------------------------------------------------------------------------
type ColorTokens = {
  background: string;
  surface: string;
  cardBackground: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  text: string;
  textSecondary: string;
  textInverse: string;
  border: string;
  success: string;
  successBackground: string;
  warning: string;
  warningBackground: string;
  danger: string;
  dangerBackground: string;
  info: string;
  infoBackground: string;
  transparent: string;
};

// ---------------------------------------------------------------------------
// ThemeShape — concrete structure that satisfies Restyle's BaseTheme.
// Using explicit string values (not literal types) allows the dark theme
// override to assign different palette constants without TS type errors.
// ---------------------------------------------------------------------------
type ThemeShape = BaseTheme & {
  colors: ColorTokens;
  spacing: { xs: number; s: number; m: number; l: number; xl: number; xxl: number };
  borderRadii: { s: number; m: number; l: number; xl: number; full: number };
  breakpoints: { phone: number; tablet: number };
  textVariants: Record<string, Record<string, string | number>>;
};

// ---------------------------------------------------------------------------
// Light theme (base)
// ---------------------------------------------------------------------------
export const theme = createTheme({
  colors: {
    // Backgrounds
    background: palette.neutral100,
    surface: palette.neutral50,
    cardBackground: palette.neutral0,

    // Brand
    primary: palette.indigo600,
    primaryLight: palette.indigo400,
    primaryDark: palette.indigo700,

    // Text
    text: palette.neutral900,
    textSecondary: palette.neutral500,
    textInverse: palette.neutral0,

    // Border
    border: palette.neutral300,

    // Semantic
    success: palette.green500,
    successBackground: palette.green100,
    warning: palette.amber500,
    warningBackground: palette.amber100,
    danger: palette.red500,
    dangerBackground: palette.red100,
    info: palette.blue500,
    infoBackground: palette.blue100,

    // Misc
    transparent: palette.transparent,
  },

  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadii: {
    s: 4,
    m: 8,
    l: 12,
    xl: 20,
    full: 9999,
  },

  breakpoints: {
    phone: 0,
    tablet: 768,
  },

  textVariants: {
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'text',
    },
    subheader: {
      fontSize: 18,
      fontWeight: '600',
      color: 'text',
    },
    body: {
      fontSize: 14,
      color: 'text',
    },
    caption: {
      fontSize: 12,
      color: 'textSecondary',
    },
    defaults: {
      fontSize: 14,
      color: 'text',
    },
  },
});

// ---------------------------------------------------------------------------
// Dark theme — manually defined variant (Restyle v2 does not ship createDarkTheme)
// Colors sourced from TPS_INTERMOTORS desktop CSS dark mode variables.
// Cast through ThemeShape so the spread + override works without literal conflicts.
// ---------------------------------------------------------------------------
export const darkTheme: ThemeShape = {
  ...(theme as unknown as ThemeShape),
  colors: {
    // Backgrounds
    background: palette.dark200,
    surface: palette.dark300,
    cardBackground: palette.dark400,

    // Brand — indigo stays vibrant on dark
    primary: palette.indigo600,
    primaryLight: palette.indigo400,
    primaryDark: palette.indigo700,

    // Text
    text: palette.neutral0,
    textSecondary: palette.neutral400,
    textInverse: palette.neutral900,

    // Border
    border: palette.dark100,

    // Semantic
    success: palette.green400,
    successBackground: '#16301f', // muted dark green bg
    warning: palette.amber400,
    warningBackground: '#2e2310', // muted dark amber bg
    danger: palette.red400,
    dangerBackground: '#2e1212', // muted dark red bg
    info: palette.blue400,
    infoBackground: '#0e1e35', // muted dark blue bg

    // Misc
    transparent: palette.transparent,
  },
};

// ---------------------------------------------------------------------------
// Dark theme: Pinterest
// Source: user-provided palette from Pinterest (2026-03-13)
//   background #09090b · card #1a1a1c · border #313133
//   primary #2590f8 · text #ffffff
// Note: #3c3d3f has 1.2:1 contrast on #09090b — unusable as text.
//       Mapped to `border`. textSecondary uses zinc-500 (#71717a, 4.6:1).
// ---------------------------------------------------------------------------
export const darkPinterestTheme: ThemeShape = {
  ...(theme as unknown as ThemeShape),
  colors: {
    background: palette.zinc950,
    surface: palette.zinc900,
    cardBackground: palette.zinc800,
    primary: palette.azure500,
    primaryLight: palette.azure400,
    primaryDark: palette.azure700,
    text: palette.neutral0,
    textSecondary: '#71717a',
    textInverse: palette.neutral900,
    border: palette.zinc700,
    success: palette.green400,
    successBackground: '#0d2318',
    warning: palette.amber400,
    warningBackground: '#2a1e08',
    danger: palette.red400,
    dangerBackground: '#2a0f0f',
    info: palette.azure400,
    infoBackground: '#07192f',
    transparent: palette.transparent,
  },
};

// ---------------------------------------------------------------------------
// Dark theme: AMOLED — pure pixel-off blacks for OLED screens
// ---------------------------------------------------------------------------
export const darkAmoledTheme: ThemeShape = {
  ...(theme as unknown as ThemeShape),
  colors: {
    background: palette.amoled900,
    surface: palette.amoled800,
    cardBackground: palette.amoled700,
    primary: palette.indigo600,
    primaryLight: palette.indigo400,
    primaryDark: palette.indigo700,
    text: palette.neutral0,
    textSecondary: '#6b7280',
    textInverse: palette.neutral900,
    border: palette.amoled600,
    success: palette.green400,
    successBackground: '#0a1f10',
    warning: palette.amber400,
    warningBackground: '#1f1506',
    danger: palette.red400,
    dangerBackground: '#1f0808',
    info: palette.blue400,
    infoBackground: '#071525',
    transparent: palette.transparent,
  },
};

// ---------------------------------------------------------------------------
// Dark theme: Linear — linear.app minimal dark palette
// ---------------------------------------------------------------------------
export const darkLinearTheme: ThemeShape = {
  ...(theme as unknown as ThemeShape),
  colors: {
    background: palette.linear900,
    surface: palette.linear800,
    cardBackground: palette.linear700,
    primary: palette.linearPurple,
    primaryLight: palette.linearPurpleLight,
    primaryDark: palette.linearPurpleDark,
    text: '#f0f0f0',
    textSecondary: '#9e9e9e',
    textInverse: palette.neutral900,
    border: palette.linear600,
    success: palette.green400,
    successBackground: '#0a1f10',
    warning: palette.amber400,
    warningBackground: '#1f1506',
    danger: palette.red400,
    dangerBackground: '#1f0808',
    info: palette.linearPurpleLight,
    infoBackground: '#12163a',
    transparent: palette.transparent,
  },
};

// ---------------------------------------------------------------------------
// Dark theme: VS Code Dark+
// The official default dark theme of Visual Studio Code.
// Charcoal grays + Microsoft blue. textSecondary: editor line number gray.
// ---------------------------------------------------------------------------
export const darkVscodeTheme: ThemeShape = {
  ...(theme as unknown as ThemeShape),
  colors: {
    background: palette.vscode900,
    surface: palette.vscode800,
    cardBackground: palette.vscode700,
    primary: palette.vscodeBlue,
    primaryLight: palette.vscodeBlueLight,
    primaryDark: palette.vscodeBlueDark,
    text: '#d4d4d4',           // editor foreground
    textSecondary: '#858585',  // line number / comment gray
    textInverse: palette.neutral900,
    border: palette.vscode600,
    success: '#4ec9b0',        // VS Code teal (type colors)
    successBackground: '#0a2018',
    warning: '#ce9178',        // VS Code string orange
    warningBackground: '#2a1a10',
    danger: '#f44747',         // VS Code error red
    dangerBackground: '#2a0a0a',
    info: palette.vscodeBlue,
    infoBackground: '#001830',
    transparent: palette.transparent,
  },
};

// ---------------------------------------------------------------------------
// Dark theme: Tokyo Night
// Storm variant — deep midnight blue backgrounds + lavender text.
// One of the most acclaimed VS Code themes in the community.
// ---------------------------------------------------------------------------
export const darkTokyoTheme: ThemeShape = {
  ...(theme as unknown as ThemeShape),
  colors: {
    background: palette.tokyo900,
    surface: palette.tokyo800,
    cardBackground: palette.tokyo700,
    primary: palette.tokyoBlue,
    primaryLight: palette.tokyoBlueLight,
    primaryDark: palette.tokyoBlueDark,
    text: palette.tokyoText,   // warm lavender-white #c0caf5
    textSecondary: palette.tokyoMuted, // purple-gray #565f89
    textInverse: palette.neutral900,
    border: palette.tokyo600,
    success: '#9ece6a',        // tokyo green
    successBackground: '#0a1f10',
    warning: '#e0af68',        // tokyo yellow
    warningBackground: '#1f1a08',
    danger: '#f7768e',         // tokyo red
    dangerBackground: '#2a0f14',
    info: '#2ac3de',           // tokyo cyan
    infoBackground: '#071a20',
    transparent: palette.transparent,
  },
};

// ---------------------------------------------------------------------------
// Dark theme: One Dark Pro
// Atom's iconic dark theme — the most downloaded VS Code theme of all time.
// Muted cool grays + soft cyan/blue primary. textSecondary: comment gray.
// ---------------------------------------------------------------------------
export const darkOnedarkTheme: ThemeShape = {
  ...(theme as unknown as ThemeShape),
  colors: {
    background: palette.onedark900,
    surface: palette.onedark800,
    cardBackground: palette.onedark700,
    primary: palette.onedarkBlue,
    primaryLight: palette.onedarkBlueLight,
    primaryDark: palette.onedarkBlueDark,
    text: palette.onedarkText,  // classic light gray #abb2bf
    textSecondary: palette.onedarkMuted, // comment gray #5c6370
    textInverse: palette.neutral900,
    border: palette.onedark600,
    success: '#98c379',         // one dark green
    successBackground: '#0d2318',
    warning: '#e5c07b',         // one dark yellow
    warningBackground: '#1f1a08',
    danger: '#e06c75',          // one dark red
    dangerBackground: '#2a0f10',
    info: '#56b6c2',            // one dark cyan
    infoBackground: '#071a20',
    transparent: palette.transparent,
  },
};

// ---------------------------------------------------------------------------
// Theme registry — maps ThemeId to Restyle theme objects.
// ---------------------------------------------------------------------------
export type ThemeId =
  | 'light'
  | 'dark-default'
  | 'dark-pinterest'
  | 'dark-amoled'
  | 'dark-linear'
  | 'dark-vscode'
  | 'dark-tokyo'
  | 'dark-onedark';

// 'system' is a meta-value — resolved to light/dark-default in ThemeProvider.
export type SelectedThemeId = ThemeId | 'system';

export const THEME_REGISTRY: Record<ThemeId, ThemeShape> = {
  light: theme as unknown as ThemeShape,
  'dark-default': darkTheme,
  'dark-pinterest': darkPinterestTheme,
  'dark-amoled': darkAmoledTheme,
  'dark-linear': darkLinearTheme,
  'dark-vscode': darkVscodeTheme,
  'dark-tokyo': darkTokyoTheme,
  'dark-onedark': darkOnedarkTheme,
};

// ---------------------------------------------------------------------------
// Theme metadata — used by the SettingsScreen theme gallery.
// ---------------------------------------------------------------------------
export interface ThemeMeta {
  id: ThemeId;
  label: string;
  isDark: boolean;
  preview: {
    background: string;
    card: string;
    primary: string;
    text: string;
    border: string;
  };
}

export const THEME_COLLECTION: ThemeMeta[] = [
  // ---- Light
  {
    id: 'light',
    label: 'Claro',
    isDark: false,
    preview: {
      background: palette.neutral100,
      card: palette.neutral0,
      primary: palette.indigo600,
      text: palette.neutral900,
      border: palette.neutral300,
    },
  },
  // ---- Dark
  {
    id: 'dark-amoled',
    label: 'Oscuro',
    isDark: true,
    preview: {
      background: palette.amoled900,
      card: palette.amoled700,
      primary: palette.indigo600,
      text: palette.neutral0,
      border: palette.amoled600,
    },
  },
  {
    id: 'dark-pinterest',
    label: 'Pinterest',
    isDark: true,
    preview: {
      background: palette.zinc950,
      card: palette.zinc800,
      primary: palette.azure500,
      text: palette.neutral0,
      border: palette.zinc700,
    },
  },
  {
    id: 'dark-linear',
    label: 'Linear',
    isDark: true,
    preview: {
      background: palette.linear900,
      card: palette.linear700,
      primary: palette.linearPurple,
      text: '#f0f0f0',
      border: palette.linear600,
    },
  },
  {
    id: 'dark-vscode',
    label: 'VS Code',
    isDark: true,
    preview: {
      background: palette.vscode900,
      card: palette.vscode700,
      primary: palette.vscodeBlue,
      text: '#d4d4d4',
      border: palette.vscode600,
    },
  },
  {
    id: 'dark-tokyo',
    label: 'Tokyo Night',
    isDark: true,
    preview: {
      background: palette.tokyo900,
      card: palette.tokyo700,
      primary: palette.tokyoBlue,
      text: palette.tokyoText,
      border: palette.tokyo600,
    },
  },
  {
    id: 'dark-onedark',
    label: 'One Dark',
    isDark: true,
    preview: {
      background: palette.onedark900,
      card: palette.onedark700,
      primary: palette.onedarkBlue,
      text: palette.onedarkText,
      border: palette.onedark600,
    },
  },
];

// ---------------------------------------------------------------------------
// Public type — derive from the light theme (canonical shape).
// Components should type their theme references as `Theme`.
// ---------------------------------------------------------------------------
export type Theme = typeof theme;

// ---------------------------------------------------------------------------
// Restyle primitives — consumed by ALL components across the app.
// Import Box/Text from this module, never from restyle directly.
// ---------------------------------------------------------------------------
export const Box = createBox<Theme>();
export const Text = createText<Theme>();
