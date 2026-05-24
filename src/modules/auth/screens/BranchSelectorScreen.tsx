import React, { useEffect } from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Building2 } from 'lucide-react-native';
import { useTheme } from '@shopify/restyle';

import { Box, Text } from '@/themes';
import type { Theme } from '@/themes';

import { useAuthStore } from '../stores/authStore';

// ---------------------------------------------------------------------------
// BranchSelectorScreen — store-driven, no navigation props needed
// ---------------------------------------------------------------------------
export function BranchSelectorScreen(): React.JSX.Element {
  const { colors } = useTheme<Theme>();
  const user = useAuthStore((s) => s.user);
  const selectedBranchId = useAuthStore((s) => s.selectedBranchId);
  const setBranch = useAuthStore((s) => s.setBranch);

  const sucursales = user?.sucursales ?? [];

  // Auto-select branch 1 when user has no branches configured
  useEffect(() => {
    if (sucursales.length === 0) {
      void AsyncStorage.setItem('intermotors_branch_id', '1');
      setBranch(1);
    }
  }, [sucursales.length, setBranch]);

  const handleSelectBranch = async (branchId: number): Promise<void> => {
    await AsyncStorage.setItem('intermotors_branch_id', String(branchId));
    setBranch(branchId);
    // RootNavigator reacts to hasBranch becoming true and renders Main
  };

  if (sucursales.length === 0) {
    // Auto-redirect case — nothing to show
    return <Box flex={1} backgroundColor="background" />;
  }

  return (
    <Box flex={1} backgroundColor="background">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* Header */}
        <Box marginBottom="xl">
          <Text variant="header" color="text">
            Bienvenido, {user?.name ?? ''}
          </Text>
          <Text variant="body" color="textSecondary" marginTop="xs">
            Seleccioná una sucursal
          </Text>
        </Box>

        {/* Branch list */}
        {sucursales.map((branch) => {
          const isActive = selectedBranchId === branch.id;

          return (
            <TouchableOpacity
              key={branch.id}
              onPress={() => void handleSelectBranch(branch.id)}
              activeOpacity={0.75}
            >
              <Box
                borderWidth={isActive ? 2 : 1}
                borderColor={isActive ? 'primary' : 'border'}
                borderRadius="m"
                padding="m"
                marginBottom="s"
                flexDirection="row"
                alignItems="center"
                backgroundColor="surface"
              >
                <Building2
                  color={isActive ? colors.primary : colors.textSecondary}
                  size={20}
                />
                <Text
                  variant="body"
                  color={isActive ? 'primary' : 'text'}
                  marginLeft="s"
                >
                  {branch.sucursal}
                </Text>
              </Box>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Box>
  );
}
