import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text as RNText,
  TouchableOpacity,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { useTheme } from '@shopify/restyle';
import { ChevronDown, Check } from 'lucide-react-native';

import type { Theme } from '@/themes';
import { useAuthStore } from '@/modules/auth/stores/authStore';

export function BranchPickerTitle(): React.JSX.Element {
  const { colors } = useTheme<Theme>();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const selectedBranchId = useAuthStore((s) => s.selectedBranchId);
  const setBranch = useAuthStore((s) => s.setBranch);
  const [visible, setVisible] = useState(false);

  const sucursales = user?.sucursales ?? [];
  const activeBranch =
    sucursales.find((s) => s.id === selectedBranchId) ?? sucursales[0] ?? null;

  const handleSelect = async (branchId: number): Promise<void> => {
    await AsyncStorage.setItem('intermotors_branch_id', String(branchId));
    setBranch(branchId);
    queryClient.invalidateQueries();
    setVisible(false);
  };

  if (!activeBranch) return <View />;

  if (sucursales.length <= 1) {
    return (
      <RNText style={[styles.headerBranchTitle, { color: colors.text }]} numberOfLines={1}>
        {activeBranch.sucursal}
      </RNText>
    );
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={styles.branchPickerTrigger}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        activeOpacity={0.7}
      >
        <RNText style={[styles.headerBranchTitle, { color: colors.text }]} numberOfLines={1}>
          {activeBranch.sucursal}
        </RNText>
        <ChevronDown size={14} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View
            style={[
              styles.branchDropdown,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {sucursales.map((branch) => {
              const isActive = branch.id === selectedBranchId;
              return (
                <TouchableOpacity
                  key={branch.id}
                  onPress={() => void handleSelect(branch.id)}
                  style={[
                    styles.branchOption,
                    isActive && { backgroundColor: colors.primary + '15' },
                  ]}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.siglaPillSmall,
                      { backgroundColor: isActive ? colors.primary + '25' : colors.border },
                    ]}
                  >
                    <RNText
                      style={[
                        styles.siglaTextSmall,
                        { color: isActive ? colors.primary : colors.textSecondary },
                      ]}
                    >
                      {branch.sigla}
                    </RNText>
                  </View>
                  <RNText
                    style={[
                      styles.branchOptionText,
                      { color: isActive ? colors.primary : colors.text },
                    ]}
                    numberOfLines={1}
                  >
                    {branch.sucursal}
                  </RNText>
                  {isActive && <Check size={14} color={colors.primary} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  branchPickerTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    maxWidth: 180,
  },
  headerBranchTitle: {
    fontSize: 15,
    fontWeight: '600',
    flexShrink: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingTop: 56,
    paddingHorizontal: 32,
  },
  branchDropdown: {
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  branchOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  branchOptionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  siglaPillSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  siglaTextSmall: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
