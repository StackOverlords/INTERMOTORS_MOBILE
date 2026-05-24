import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Bell, Check, ChevronRight } from 'lucide-react-native';

import type { Theme } from '@/themes/theme';
import { THEME_COLLECTION, type ThemeMeta } from '@/themes/theme';
import { useThemeStore } from '@/themes/themeStore';
import type { SelectedThemeId } from '@/themes/themeStore';
import { Box, Text } from '@/themes';

const darkThemes = THEME_COLLECTION.filter((t) => t.isDark);
const lightThemes = THEME_COLLECTION.filter((t) => !t.isDark);

const H_PADDING = 16;
const CARD_GAP = 10;
const CARD_WIDTH = 140;
const CARD_HEIGHT_PREVIEW = 100;

// ---------------------------------------------------------------------------
// SectionHeader
// ---------------------------------------------------------------------------
function SectionHeader({ label }: { label: string }): React.JSX.Element {
  const { colors } = useTheme<Theme>();
  return (
    <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
      {label.toUpperCase()}
    </Text>
  );
}

// ---------------------------------------------------------------------------
// SubSectionLabel — within a section (Claros / Oscuros)
// ---------------------------------------------------------------------------
function SubSectionLabel({ label }: { label: string }): React.JSX.Element {
  const { colors } = useTheme<Theme>();
  return (
    <Text style={[styles.subSectionLabel, { color: colors.textSecondary }]}>
      {label}
    </Text>
  );
}

// ---------------------------------------------------------------------------
// SettingRow — generic row for system settings (toggle or arrow)
// ---------------------------------------------------------------------------
interface SettingRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  toggle?: boolean;
  value?: boolean;
  onValueChange?: (val: boolean) => void;
  onPress?: () => void;
}

function SettingRow({
  icon,
  title,
  subtitle,
  toggle,
  value,
  onValueChange,
  onPress,
}: SettingRowProps): React.JSX.Element {
  const { colors } = useTheme<Theme>();

  const inner = (
    <View style={[styles.settingRow, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <View style={[styles.settingIconWrap, { backgroundColor: colors.primary + '18' }]}>
        {icon}
      </View>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {toggle ? (
        <Switch
          value={value ?? false}
          onValueChange={onValueChange}
          trackColor={{ true: colors.primary, false: colors.border }}
          thumbColor="#fff"
        />
      ) : (
        <ChevronRight size={16} color={colors.textSecondary} />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {inner}
      </TouchableOpacity>
    );
  }

  return inner;
}

// ---------------------------------------------------------------------------
// ThemeCard
// ---------------------------------------------------------------------------
interface ThemeCardProps {
  meta: ThemeMeta;
  isActive: boolean;
  onSelect: () => void;
}

function ThemeCard({ meta, isActive, onSelect }: ThemeCardProps): React.JSX.Element {
  const { colors } = useTheme<Theme>();

  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.75}
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          borderColor: isActive ? colors.primary : colors.border,
          borderWidth: isActive ? 2 : StyleSheet.hairlineWidth,
        },
      ]}
    >
      {/* Mini color preview */}
      <View style={[styles.preview, { backgroundColor: meta.preview.background }]}>
        <View
          style={[
            styles.previewCard,
            { backgroundColor: meta.preview.card, borderColor: meta.preview.border },
          ]}
        >
          <View style={[styles.previewAccent, { backgroundColor: meta.preview.primary }]} />
          <View style={[styles.previewLine, { backgroundColor: meta.preview.text + 'cc' }]} />
          <View style={[styles.previewLine, styles.previewLineShort, { backgroundColor: meta.preview.text + '55' }]} />
        </View>
      </View>

      {/* Label */}
      <View style={styles.cardFooter}>
        <Text style={[styles.cardLabel, { color: isActive ? colors.primary : colors.text }]} numberOfLines={1}>
          {meta.label}
        </Text>
        {isActive && (
          <View style={[styles.checkBadge, { backgroundColor: colors.primary }]}>
            <Check size={10} color="#fff" strokeWidth={3} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// ThemeRow — horizontal scroll strip
// ---------------------------------------------------------------------------
function ThemeRow({ themes, activeId, onSelect }: {
  themes: ThemeMeta[];
  activeId: SelectedThemeId;
  onSelect: (id: SelectedThemeId) => void;
}): React.JSX.Element {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.themeRow}
      contentContainerStyle={styles.themeRowContent}
    >
      {themes.map((meta) => (
        <ThemeCard
          key={meta.id}
          meta={meta}
          isActive={activeId === meta.id}
          onSelect={() => onSelect(meta.id)}
        />
      ))}
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// SettingsScreen
// ---------------------------------------------------------------------------
export function SettingsScreen(): React.JSX.Element {
  const { colors } = useTheme<Theme>();
  const themeId = useThemeStore((s) => s.themeId);
  const setThemeId = useThemeStore((s) => s.setThemeId);

  // Stub state for system settings (will be wired to a store later)
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  return (
    <Box flex={1} backgroundColor="background">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── SISTEMA ──────────────────────────────────────────────────── */}
        <SectionHeader label="Sistema" />

        <View style={[styles.settingGroup, { borderColor: colors.border }]}>
          <SettingRow
            icon={<Bell size={15} color={colors.primary} />}
            title="Notificaciones"
            subtitle="Alertas de pedidos y stock mínimo"
            toggle
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </View>

        {/* ── APARIENCIA ───────────────────────────────────────────────── */}
        <SectionHeader label="Apariencia" />

        {/* Follow system */}
        <TouchableOpacity
          onPress={() => setThemeId('system')}
          activeOpacity={0.7}
          style={[
            styles.systemRow,
            {
              backgroundColor: themeId === 'system' ? colors.primary + '15' : colors.cardBackground,
              borderColor: themeId === 'system' ? colors.primary : colors.border,
            },
          ]}
        >
          <View style={styles.systemRowLeft}>
            <Text style={[styles.systemRowTitle, { color: colors.text }]}>
              Seguir el sistema
            </Text>
            <Text style={[styles.systemRowSub, { color: colors.textSecondary }]}>
              Cambia automáticamente con el modo del dispositivo
            </Text>
          </View>
          {themeId === 'system' && (
            <View style={[styles.checkBadge, styles.checkBadgeLg, { backgroundColor: colors.primary }]}>
              <Check size={12} color="#fff" strokeWidth={3} />
            </View>
          )}
        </TouchableOpacity>

        {/* Light themes */}
        <SubSectionLabel label="Claros" />
        <ThemeRow themes={lightThemes} activeId={themeId} onSelect={setThemeId} />

        {/* Dark themes */}
        <SubSectionLabel label="Oscuros" />
        <ThemeRow themes={darkThemes} activeId={themeId} onSelect={setThemeId} />

        <View style={{ height: 24 }} />
      </ScrollView>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: H_PADDING,
    paddingTop: 20,
    gap: 12,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: -2,
    marginTop: 4,
  },
  subSectionLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: -4,
  },
  // ── System settings ──────────────────────────────────────────────────────
  settingGroup: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 12,
  },
  settingIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  settingInfo: {
    flex: 1,
    gap: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 12,
  },
  // ── Theme horizontal row ─────────────────────────────────────────────────
  // Negative margin breaks out of the parent paddingHorizontal → full-bleed scroll
  themeRow: {
    marginHorizontal: -H_PADDING,
  },
  themeRowContent: {
    paddingHorizontal: H_PADDING,
    gap: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    overflow: 'hidden',
  },
  preview: {
    height: CARD_HEIGHT_PREVIEW,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewCard: {
    width: '82%',
    borderRadius: 6,
    padding: 8,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 5,
  },
  previewAccent: {
    height: 4,
    borderRadius: 2,
    width: '40%',
  },
  previewLine: {
    height: 3,
    borderRadius: 2,
    width: '100%',
  },
  previewLineShort: {
    width: '60%',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  checkBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadgeLg: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  // ── System row (seguir sistema) ──────────────────────────────────────────
  systemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  systemRowLeft: {
    flex: 1,
    gap: 2,
  },
  systemRowTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  systemRowSub: {
    fontSize: 12,
  },
});
