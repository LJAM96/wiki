import {
  Group,
  Text,
  useMantineColorScheme,
  Select,
  MantineColorScheme,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useCustomTheme, CustomTheme } from "@/hooks/use-custom-theme.tsx";
import { useEffect } from "react";

export default function AccountTheme() {
  const { t } = useTranslation();

  return (
    <Group justify="space-between" wrap="nowrap" gap="xl">
      <div>
        <Text size="md">{t("Theme")}</Text>
        <Text size="sm" c="dimmed">
          {t("Choose your preferred color scheme.")}
        </Text>
      </div>

      <ThemeSwitcher />
    </Group>
  );
}


import { SegmentedControl } from "@mantine/core";
import { ALL_THEMES, ThemeVariant, CustomThemeBase } from "@/hooks/use-custom-theme.tsx";

function ThemeSwitcher() {
  const { t } = useTranslation();
  const {
    themeBase,
    themeVariant,
    setThemeBase,
    setThemeVariant,
    applyTheme,
    ALL_THEMES,
  } = useCustomTheme();

  // Build dropdown options for just the base themes
  const themeOptions = ALL_THEMES.map((theme) => ({
    value: theme.base,
    label: t(theme.label),
    group: t(theme.group),
  }));

  // Find the selected theme definition
  const selectedTheme = ALL_THEMES.find((t) => t.base === themeBase);
  const hasLight = selectedTheme?.variants.includes("light");
  const hasDark = selectedTheme?.variants.includes("dark");

  // When theme changes, reset variant to first available
  const handleThemeChange = (base: CustomThemeBase) => {
    setThemeBase(base);
    const def = ALL_THEMES.find((t) => t.base === base);
    if (def) {
      const newVariant = def.variants.includes(themeVariant)
        ? themeVariant
        : def.variants[0];
      setThemeVariant(newVariant);
      applyTheme(base, newVariant);
    }
  };

  // When variant changes
  const handleVariantChange = (variant: ThemeVariant) => {
    if (selectedTheme && selectedTheme.variants.includes(variant)) {
      setThemeVariant(variant);
      applyTheme(themeBase, variant);
    }
  };

  return (
    <div style={{ minWidth: 260 }}>
      <Select
        label={t("Theme")}
        data={themeOptions}
        value={themeBase}
        onChange={handleThemeChange}
        allowDeselect={false}
        searchable
        maxDropdownHeight={400}
      />
      <SegmentedControl
        fullWidth
        mt="md"
        value={themeVariant}
        onChange={handleVariantChange}
        data={[
          {
            label: t("Light"),
            value: "light",
            disabled: !hasLight,
          },
          {
            label: t("Dark"),
            value: "dark",
            disabled: !hasDark,
          },
        ]}
      />
    </div>
  );
}
