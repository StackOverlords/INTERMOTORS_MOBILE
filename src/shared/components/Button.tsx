import React from 'react';
import { ActivityIndicator, Pressable } from 'react-native';

import { Box, Text } from '@/themes';
import type { Theme } from '@/themes';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md';

type VariantTokens = {
  background: keyof Theme['colors'];
  foreground: keyof Theme['colors'];
  borderColor?: keyof Theme['colors'];
  borderWidth?: number;
};

const VARIANT_MAP: Record<ButtonVariant, VariantTokens> = {
  primary: {
    background: 'primary',
    foreground: 'textInverse',
  },
  secondary: {
    background: 'surface',
    foreground: 'text',
    borderColor: 'border',
    borderWidth: 1,
  },
  ghost: {
    background: 'transparent',
    foreground: 'primary',
  },
  danger: {
    background: 'dangerBackground',
    foreground: 'danger',
    borderColor: 'danger',
    borderWidth: 1,
  },
};

type SizeTokens = {
  height: number;
  fontSize: number;
  paddingHorizontal: keyof Theme['spacing'];
};

const SIZE_MAP: Record<ButtonSize, SizeTokens> = {
  sm: {
    height: 32,
    fontSize: 13,
    paddingHorizontal: 'm',
  },
  md: {
    height: 44,
    fontSize: 14,
    paddingHorizontal: 'l',
  },
};

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  fullWidth?: boolean;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  fullWidth = false,
}: ButtonProps) {
  const tokens = VARIANT_MAP[variant];
  const sizeTokens = SIZE_MAP[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={{ opacity: isDisabled ? 0.5 : 1, alignSelf: fullWidth ? 'stretch' : 'flex-start' }}
    >
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        backgroundColor={tokens.background}
        paddingHorizontal={sizeTokens.paddingHorizontal}
        borderRadius="m"
        borderWidth={tokens.borderWidth}
        borderColor={tokens.borderColor}
        style={{ height: sizeTokens.height }}
      >
        {loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <>
            {leftIcon != null && (
              <Box marginRight="xs">{leftIcon}</Box>
            )}
            <Text
              color={tokens.foreground}
              style={{ fontSize: sizeTokens.fontSize, fontWeight: '600' }}
            >
              {label}
            </Text>
          </>
        )}
      </Box>
    </Pressable>
  );
}
