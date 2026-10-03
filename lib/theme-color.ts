// The browser's theme-color meta tag cannot read CSS variables, so these two
// values are the one place the page background is written as a literal.
// They mirror --background for each scheme in app/globals.css; change both.
export const THEME_COLOR = {
  light: '#ecebe6',
  dark: '#0b0c0e',
} as const
