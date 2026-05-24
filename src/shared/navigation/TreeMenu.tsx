import React, { useState, useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import { ChevronDown, ChevronRight } from 'lucide-react-native';

import { Box, Text } from '@/themes';
import type { Theme } from '@/themes';
import type { DrawerParamList } from '@/navigation/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type TreeMenuItem = {
  label: string;
  routeName: keyof DrawerParamList;
  icon?: React.ComponentType<{ color: string; size: number }>;
};

export type TreeMenuSection = {
  key: string;
  label: string;
  icon?: React.ComponentType<{ color: string; size: number }>;
  items: TreeMenuItem[];
  defaultExpanded?: boolean;
  /** If true, renders as a direct link (no accordion). Requires items.length === 1. */
  direct?: boolean;
};

export type TreeMenuProps = {
  sections: TreeMenuSection[];
  navigation: any; // DrawerContentComponentProps['navigation']
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const ICON_SIZE = 18;

function findSectionKeyForRoute(
  sections: TreeMenuSection[],
  routeName: string | undefined,
): string | null {
  if (!routeName) return null;
  for (const section of sections) {
    if (section.items.some((item) => item.routeName === routeName)) {
      return section.key;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// TreeMenu
// ---------------------------------------------------------------------------
export function TreeMenu({ sections, navigation }: TreeMenuProps) {
  const theme = useTheme<Theme>();

  const activeRouteName = useNavigationState(
    (state) => state?.routes[state.index]?.name,
  );

  const [expandedKey, setExpandedKey] = useState<string | null>(() => {
    // Auto-expand the section containing the active route on mount.
    // If none matches, check defaultExpanded.
    const matchedKey = findSectionKeyForRoute(sections, activeRouteName);
    if (matchedKey) return matchedKey;
    const defaultSection = sections.find((s) => s.defaultExpanded);
    return defaultSection?.key ?? null;
  });

  const handleSectionPress = useCallback((key: string) => {
    setExpandedKey((prev) => (prev === key ? null : key));
  }, []);

  const handleItemPress = useCallback(
    (routeName: keyof DrawerParamList) => {
      navigation.navigate(routeName);
    },
    [navigation],
  );

  return (
    <Box>
      {sections.map((section) => {
        const SectionIcon = section.icon;

        // ── Direct link (no accordion) ──────────────────────────────────────
        if (section.direct) {
          const item = section.items[0];
          if (!item) return null;
          const isActive = item.routeName === activeRouteName;
          const activeBackgroundColor = theme.colors.primaryLight + '15';
          const DirectIcon = section.icon;

          return (
            <TouchableOpacity
              key={section.key}
              onPress={() => handleItemPress(item.routeName)}
              activeOpacity={0.7}
            >
              <Box
                paddingVertical="s"
                paddingHorizontal="m"
                flexDirection="row"
                alignItems="center"
                borderRadius="s"
                style={isActive ? { backgroundColor: activeBackgroundColor } : undefined}
              >
                {DirectIcon && (
                  <Box marginRight="s">
                    <DirectIcon
                      color={isActive ? theme.colors.primary : theme.colors.text}
                      size={ICON_SIZE}
                    />
                  </Box>
                )}
                <Text
                  variant="body"
                  style={{
                    fontWeight: isActive ? '600' : '500',
                    color: isActive ? theme.colors.primary : theme.colors.text,
                  }}
                >
                  {section.label}
                </Text>
              </Box>
            </TouchableOpacity>
          );
        }

        // ── Accordion section ───────────────────────────────────────────────
        const isExpanded = expandedKey === section.key;

        return (
          <Box key={section.key}>
            {/* Section header */}
            <TouchableOpacity
              onPress={() => handleSectionPress(section.key)}
              activeOpacity={0.7}
            >
              <Box
                paddingVertical="s"
                paddingHorizontal="m"
                flexDirection="row"
                alignItems="center"
              >
                {SectionIcon && (
                  <Box marginRight="s">
                    <SectionIcon
                      color={theme.colors.text}
                      size={ICON_SIZE}
                    />
                  </Box>
                )}

                <Box flex={1}>
                  <Text variant="body" style={{ fontWeight: '600' }}>
                    {section.label}
                  </Text>
                </Box>

                {isExpanded ? (
                  <ChevronDown
                    color={theme.colors.textSecondary}
                    size={ICON_SIZE}
                  />
                ) : (
                  <ChevronRight
                    color={theme.colors.textSecondary}
                    size={ICON_SIZE}
                  />
                )}
              </Box>
            </TouchableOpacity>

            {/* Section items — instant show/hide, no animation */}
            {isExpanded &&
              section.items.map((item) => {
                const isActive = item.routeName === activeRouteName;
                const ItemIcon = item.icon;

                // hex alpha suffix trick: primaryLight (#818cf8) + '15' opacity
                const activeBackgroundColor =
                  theme.colors.primaryLight + '15';

                return (
                  <TouchableOpacity
                    key={item.routeName}
                    onPress={() => handleItemPress(item.routeName)}
                    activeOpacity={0.7}
                  >
                    <Box
                      paddingVertical="xs"
                      paddingHorizontal="m"
                      paddingLeft="l"
                      flexDirection="row"
                      alignItems="center"
                      borderRadius="s"
                      style={
                        isActive
                          ? { backgroundColor: activeBackgroundColor }
                          : undefined
                      }
                    >
                      {ItemIcon && (
                        <Box marginRight="s">
                          <ItemIcon
                            color={
                              isActive
                                ? theme.colors.primary
                                : theme.colors.textSecondary
                            }
                            size={ICON_SIZE}
                          />
                        </Box>
                      )}

                      <Text
                        variant="body"
                        style={{
                          fontWeight: isActive ? '600' : '400',
                          color: isActive
                            ? theme.colors.primary
                            : theme.colors.textSecondary,
                        }}
                      >
                        {item.label}
                      </Text>
                    </Box>
                  </TouchableOpacity>
                );
              })}
          </Box>
        );
      })}
    </Box>
  );
}
