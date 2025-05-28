import { useLocalStorage } from '@mantine/hooks';

import { useMantineColorScheme } from '@mantine/core';

export type ThemeVariant = 'light' | 'dark';
export type CustomThemeBase =
  | 'auto'
  | 'fluent'
  | 'nord'
  | 'tokyo'
  | 'marine'
  | 'arc'
  | 'solarized'
  | 'ayu'
  | 'dracula'
  | 'gruvbox'
  | 'black'
  | 'white'
  | 'material-you'
  | 'coral'
  | 'pastel'
  | 'berry'
  | 'spring'
  | 'autumn'
  | 'terracotta'
  | 'smalt-blue'
  | 'emerald-green'
  | 'one-dark'
  | 'monokai-pro'
  | 'horizon'
  | 'night-owl'
  | 'synthwave-84'
  | 'palenight'
  | 'neon-dreams'
  | 'forest'
  | 'desert-sand'
  | 'oceanic-next'
  | 'lavender-fields'
  | 'carbon'
  | 'zenburn'
  | 'paper-color'
  | 'obsidian'
  | 'mocha-latte'
  | 'cyberpunk'
  | 'pixel-ui'
  | 'inkdrop';

export type CustomTheme = string; // For backward compatibility

export interface ThemeDefinition {
  base: CustomThemeBase;
  label: string;
  group: string;
  variants: ThemeVariant[];
}

// List of all themes, their groups, and available variants
export const ALL_THEMES: ThemeDefinition[] = [
  { base: 'auto', label: 'System Default', group: 'General', variants: ['light', 'dark'] },
  { base: 'fluent', label: 'Fluent', group: 'General', variants: ['light', 'dark'] },
  { base: 'material-you', label: 'Material You', group: 'Material You', variants: ['light', 'dark'] },
  { base: 'coral', label: 'Coral', group: 'Coral', variants: ['light', 'dark'] },
  { base: 'pastel', label: 'Pastel', group: 'Pastel', variants: ['light', 'dark'] },
  { base: 'berry', label: 'Berry', group: 'Berry', variants: ['light', 'dark'] },
  { base: 'spring', label: 'Spring', group: 'Spring', variants: ['light', 'dark'] },
  { base: 'autumn', label: 'Autumn', group: 'Autumn', variants: ['light', 'dark'] },
  { base: 'terracotta', label: 'Terracotta', group: 'Terracotta', variants: ['light', 'dark'] },
  { base: 'smalt-blue', label: 'Smalt Blue', group: 'Smalt Blue', variants: ['light', 'dark'] },
  { base: 'emerald-green', label: 'Emerald Green', group: 'Emerald Green', variants: ['light', 'dark'] },
  { base: 'nord', label: 'Nord', group: 'Nord', variants: ['light', 'dark'] },
  { base: 'tokyo', label: 'Tokyo', group: 'Tokyo', variants: ['light', 'dark'] },
  { base: 'marine', label: 'Marine', group: 'Marine', variants: ['light', 'dark'] },
  { base: 'arc', label: 'Arc', group: 'Arc', variants: ['light', 'dark'] },
  { base: 'solarized', label: 'Solarized', group: 'Solarized', variants: ['light', 'dark'] },
  { base: 'ayu', label: 'Ayu', group: 'Ayu', variants: ['light', 'dark'] },
  { base: 'dracula', label: 'Dracula', group: 'Dracula', variants: ['light', 'dark'] },
  { base: 'gruvbox', label: 'Gruvbox', group: 'Gruvbox', variants: ['light', 'dark'] },
  { base: 'one-dark', label: 'One Dark', group: 'One Dark', variants: ['light', 'dark'] },
  { base: 'monokai-pro', label: 'Monokai Pro', group: 'Monokai Pro', variants: ['light', 'dark'] },
  { base: 'horizon', label: 'Horizon', group: 'Horizon', variants: ['light', 'dark'] },
  { base: 'night-owl', label: 'Night Owl', group: 'Night Owl', variants: ['light', 'dark'] },
  { base: 'synthwave-84', label: 'Synthwave 84', group: 'Synthwave 84', variants: ['light', 'dark'] },
  { base: 'palenight', label: 'Palenight', group: 'Palenight', variants: ['light', 'dark'] },
  { base: 'neon-dreams', label: 'Neon Dreams', group: 'Neon Dreams', variants: ['light', 'dark'] },
  { base: 'forest', label: 'Forest', group: 'Forest', variants: ['light', 'dark'] },
  { base: 'desert-sand', label: 'Desert Sand', group: 'Desert Sand', variants: ['light', 'dark'] },
  { base: 'oceanic-next', label: 'Oceanic Next', group: 'Oceanic Next', variants: ['light', 'dark'] },
  { base: 'lavender-fields', label: 'Lavender Fields', group: 'Lavender Fields', variants: ['light', 'dark'] },
  { base: 'carbon', label: 'Carbon', group: 'Carbon', variants: ['light', 'dark'] },
  { base: 'zenburn', label: 'Zenburn', group: 'Zenburn', variants: ['light', 'dark'] },
  { base: 'paper-color', label: 'PaperColor', group: 'PaperColor', variants: ['light', 'dark'] },
  { base: 'obsidian', label: 'Obsidian', group: 'Obsidian', variants: ['light', 'dark'] },
  { base: 'mocha-latte', label: 'Mocha Latte', group: 'Mocha Latte', variants: ['light', 'dark'] },
  { base: 'cyberpunk', label: 'Cyberpunk', group: 'Cyberpunk', variants: ['light', 'dark'] },
  { base: 'pixel-ui', label: 'Pixel UI', group: 'Pixel UI', variants: ['light', 'dark'] },
  { base: 'inkdrop', label: 'Inkdrop', group: 'Inkdrop', variants: ['light', 'dark'] },
  { base: 'black', label: 'Pure Black', group: 'Monochrome', variants: ['dark'] },
  { base: 'white', label: 'Pure White', group: 'Monochrome', variants: ['light'] },
];


export function useCustomTheme() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  // Store as base + variant
  const [themeBase, setThemeBase] = useLocalStorage<CustomThemeBase>({
    key: 'docmost-theme-base',
    defaultValue: 'auto',
  });
  const [themeVariant, setThemeVariant] = useLocalStorage<ThemeVariant>({
    key: 'docmost-theme-variant',
    defaultValue: 'light',
  });

  // Helper to get theme string
  const getThemeString = (base: CustomThemeBase, variant: ThemeVariant): CustomTheme => {
    if (base === 'auto') return 'auto';
    if (base === 'black') return 'black';
    if (base === 'white') return 'white';
    return `${base}-${variant}`;
  };

  // Migration logic for old theme names
  const migrateTheme = (theme: string): { base: CustomThemeBase, variant: ThemeVariant } => {
    if (theme === 'auto') return { base: 'auto', variant: 'light' };
    if (theme === 'black') return { base: 'black', variant: 'dark' };
    if (theme === 'white') return { base: 'white', variant: 'light' };
    const match = theme.match(/^(.*)-(light|dark)$/);
    if (match) {
      return { base: match[1] as CustomThemeBase, variant: match[2] as ThemeVariant };
    }
    // fallback
    return { base: theme as CustomThemeBase, variant: 'light' };
  };

  // Apply theme
  const applyTheme = (base: CustomThemeBase, variant: ThemeVariant) => {
    setThemeBase(base);
    setThemeVariant(variant);
    const theme = getThemeString(base, variant);
    // Remove all theme classes
    const root = document.documentElement;
    ALL_THEMES.forEach(({ base: b, variants }) => {
      variants.forEach(v => {
        root.classList.remove(`theme-${b}-${v}`);
      });
    });
    root.classList.remove('theme-black', 'theme-white', 'theme-auto');

    if (theme === 'auto') {
      setColorScheme('auto');
    } else if (theme === 'black') {
      setColorScheme('dark');
      root.classList.add('theme-black');
    } else if (theme === 'white') {
      setColorScheme('light');
      root.classList.add('theme-white');
    } else {
      root.classList.add(`theme-${base}-${variant}`);
      setColorScheme(variant);
    }
    // Force update data-mantine-color-scheme attribute for proper icon rendering
    setTimeout(() => {
      root.setAttribute('data-mantine-color-scheme', variant);
      // Force re-render of Mantine components by triggering a style recalculation
      const mantineComponents = document.querySelectorAll('[class*="mantine-"]');
      mantineComponents.forEach(el => {
        if (el instanceof HTMLElement) {
          const computedStyle = window.getComputedStyle(el);
          el.style.color = computedStyle.color;
          el.offsetHeight;
          el.style.color = '';
        }
      });
    }, 50);
  };

  // On load, migrate old theme if needed
  // (for backward compatibility)
  // If localStorage has old theme string, migrate to new base/variant
  // (This logic can be expanded as needed)

  return {
    themeBase,
    themeVariant,
    setThemeBase,
    setThemeVariant,
    applyTheme,
    ALL_THEMES,
    getThemeString,
    colorScheme,
  };
}
