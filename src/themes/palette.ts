/**
 * Brand color palette — raw constants only.
 * Derived from TPS_INTERMOTORS desktop theme (index.css).
 *
 * DO NOT import Restyle types here.
 * These are primitive hex values consumed by theme.ts.
 */

export const palette = {
  // --- Primary: Tailwind Indigo (desktop: hsl(239 84% 67%))
  // Spec target ~#5B6CF9; desktop active value resolves to ~#6466f1.
  // We use #5B6CF9 as specified — sits between the two, same family.
  indigo50: '#eef2ff',
  indigo100: '#e0e7ff',
  indigo200: '#c7d2fe',
  indigo300: '#a5b4fc',
  indigo400: '#818cf8',
  indigo500: '#6366f1',
  indigo600: '#5B6CF9', // brand primary
  indigo700: '#4338ca',
  indigo800: '#3730a3',
  indigo900: '#312e81',

  // --- Neutral / surface scale
  // Desktop dark background: hsl(220 13% 16%) → #23262e
  // Desktop card dark:       hsl(220 13% 18%) → #272a33
  // Desktop secondary dark:  hsl(220 13% 20%) → #2c303a
  // Desktop accent dark:     hsl(220 13% 22%) → #30343f
  neutral0: '#ffffff',
  neutral50: '#f8fafc',
  neutral100: '#f1f5f9',
  neutral200: '#e2e8f0',
  neutral300: '#cbd5e1',
  neutral400: '#94a3b8',
  neutral500: '#64748b',
  neutral600: '#475569',
  neutral700: '#334155',
  neutral800: '#1e293b',
  neutral900: '#0f172a',

  // --- Dark surface scale (from desktop CSS)
  dark50: '#3a3f4d',   // border/input dark: hsl(220 16% 22%)
  dark100: '#30343f',  // accent dark: hsl(220 13% 22%)
  dark200: '#2c303a',  // secondary/muted dark: hsl(220 13% 20%)
  dark300: '#272a33',  // card dark: hsl(220 13% 18%)
  dark400: '#23262e',  // background dark (surface): hsl(220 13% 16%)
  dark500: '#1c1f26',  // deeper background

  // --- Semantic: Success (desktop: hsl(142 71% 45%) light / hsl(142 65% 65%) dark)
  green100: '#dcfce7',
  green200: '#bbf7d0',
  green400: '#4ade80',
  green500: '#22c55e', // light mode success solid
  green600: '#16a34a',

  // --- Semantic: Warning (desktop: hsl(25 95% 53%) light / hsl(38 92% 65%) dark)
  amber100: '#fef9c3',
  amber200: '#fde68a',
  amber400: '#fbbf24',
  amber500: '#f97316', // light mode warning solid (orange)
  amber600: '#ea580c',

  // --- Semantic: Danger/Destructive (desktop: hsl(0 84.2% 60.2%) light / hsl(0 72% 60%) dark)
  red100: '#fee2e2',
  red200: '#fecaca',
  red400: '#f87171',
  red500: '#ef4444', // light mode danger solid
  red600: '#dc2626',

  // --- Semantic: Info (desktop: hsl(214 84% 56%) light / hsl(214 90% 70%) dark)
  blue100: '#dbeafe',
  blue200: '#bfdbfe',
  blue400: '#60a5fa',
  blue500: '#3b82f6', // light mode info solid
  blue600: '#2563eb',

  // --- Deep zinc / near-black scale (Pinterest dark theme)
  zinc950: '#09090b',
  zinc900: '#111113',
  zinc800: '#1a1a1c',
  zinc700: '#313133',
  zinc600: '#3c3d3f',

  // --- AMOLED pure black scale
  amoled900: '#000000',
  amoled800: '#0a0a0a',
  amoled700: '#111111',
  amoled600: '#1c1c1c',

  // --- Linear Dark
  linear900: '#0f0f0f',
  linear800: '#161616',
  linear700: '#1c1c1c',
  linear600: '#2c2c2c',
  linearPurple: '#5e6ad2',
  linearPurpleLight: '#7c85dc',
  linearPurpleDark: '#4a56c4',

  // --- VS Code Dark+ (official default dark theme)
  vscode900: '#1e1e1e',
  vscode800: '#252526',
  vscode700: '#2d2d2d',
  vscode600: '#3c3c3c',
  vscodeBlue: '#0078d4',
  vscodeBlueDark: '#005a9e',
  vscodeBlueLight: '#4db1f5',

  // --- Tokyo Night (one of the most popular VS Code themes)
  tokyo900: '#16161e',
  tokyo800: '#1a1b26',
  tokyo700: '#1f2335',
  tokyo600: '#292e42',
  tokyoBlue: '#7aa2f7',
  tokyoBlueDark: '#5d87e1',
  tokyoBlueLight: '#89b4fa',
  tokyoText: '#c0caf5',       // warm lavender-white
  tokyoMuted: '#565f89',      // muted purple-gray

  // --- One Dark Pro (Atom-inspired, massively popular)
  onedark900: '#21252b',
  onedark800: '#282c34',
  onedark700: '#2c313c',
  onedark600: '#3e4451',
  onedarkBlue: '#61afef',
  onedarkBlueDark: '#4d8ec5',
  onedarkBlueLight: '#7ec8f7',
  onedarkText: '#abb2bf',     // classic light gray
  onedarkMuted: '#5c6370',    // comment gray

  // --- Azure blue (high-saturation web blue — Pinterest primary)
  azure300: '#7dc0fc',
  azure400: '#4ba3fa',
  azure500: '#2590f8',  // Pinterest primary button color
  azure600: '#1a7fe8',
  azure700: '#1268c8',

  // --- Transparent
  transparent: 'transparent',
} as const;

export type Palette = typeof palette;
