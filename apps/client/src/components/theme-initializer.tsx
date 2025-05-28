import { useEffect } from 'react';
import { useCustomTheme } from '@/hooks/use-custom-theme.tsx';

export function ThemeInitializer() {
  const { themeBase, themeVariant, applyTheme } = useCustomTheme();

  useEffect(() => {
    // Apply the stored theme and variant on mount
    applyTheme(themeBase, themeVariant);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null; // This component doesn't render anything
}
