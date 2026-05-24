import React, { useState } from 'react';
import {
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Building2 } from 'lucide-react-native';

import { Box, Text } from '@/themes';
import type { Theme } from '@/themes';
import type { AuthStackScreenProps } from '@/navigation/types';

import { useLogin } from '../hooks/useLogin';
import { ENV } from '@/config/environment';

// ---------------------------------------------------------------------------
// LoginScreen
// ---------------------------------------------------------------------------
export function LoginScreen({ navigation }: AuthStackScreenProps<'Login'>): React.JSX.Element {
  const { colors, spacing, borderRadii } = useTheme<Theme>();
  const { mutate, isPending, isError, error } = useLogin();

  const [usuario, setUsuario] = useState<string>('');
  const [clave, setClave] = useState<string>('');

  const handleSubmit = (): void => {
    if (usuario.trim().length === 0 || clave.trim().length === 0) {
      return;
    }

    mutate(
      { usuario: usuario.trim(), clave: clave.trim() },
      {
        onSuccess: () => {
          navigation.navigate('BranchSelector');
        },
      },
    );
  };

  return (
    <Box flex={1} backgroundColor="background" alignItems="center" justifyContent="center" padding="l">
      {/* Brand header */}
      <Box alignItems="center" marginBottom="xxl">
        <Building2 color={colors.primary} size={48} />
        <Text variant="header" color="primary" marginTop="s">
          Intermotors
        </Text>
      </Box>

      {/* Form */}
      <Box width="100%">
        {/* Usuario */}
        <Box marginBottom="m">
          <Text variant="body" color="text" marginBottom="xs">
            Usuario
          </Text>
          <Box
            borderWidth={1}
            borderColor="border"
            borderRadius="m"
            paddingHorizontal="m"
          >
            <TextInput
              value={usuario}
              onChangeText={setUsuario}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={colors.textSecondary}
              style={{
                height: 48,
                color: colors.text,
                fontSize: 14,
              }}
            />
          </Box>
        </Box>

        {/* Contraseña */}
        <Box marginBottom="l">
          <Text variant="body" color="text" marginBottom="xs">
            Contraseña
          </Text>
          <Box
            borderWidth={1}
            borderColor="border"
            borderRadius="m"
            paddingHorizontal="m"
          >
            <TextInput
              value={clave}
              onChangeText={setClave}
              secureTextEntry={true}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={colors.textSecondary}
              style={{
                height: 48,
                color: colors.text,
                fontSize: 14,
              }}
            />
          </Box>
        </Box>

        {/* Error banner */}
        {isError && (
          <Box
            backgroundColor="dangerBackground"
            borderRadius="m"
            padding="m"
            marginBottom="m"
          >
            <Text variant="body" color="danger">
              {error?.message ?? 'Error al iniciar sesión'}
            </Text>
          </Box>
        )}

        {/* Submit */}
        <TouchableOpacity onPress={handleSubmit} disabled={isPending} activeOpacity={0.8}>
          <Box
            backgroundColor="primary"
            borderRadius="m"
            padding="m"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: 48 }}
          >
            {isPending ? (
              <ActivityIndicator color={colors.textInverse} />
            ) : (
              <Text variant="body" color="textInverse" style={{ fontWeight: '600' }}>
                Ingresar
              </Text>
            )}
          </Box>
        </TouchableOpacity>
      </Box>
    </Box>
  );
}
