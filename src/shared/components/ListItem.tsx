import React from 'react';
import { TouchableOpacity } from 'react-native';

import { Box, Text } from '@/themes';

type ListItemProps = {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  onPress?: () => void;
};

export function ListItem({ title, subtitle, rightSlot, onPress }: ListItemProps) {
  const content = (
    <Box
      flexDirection="row"
      alignItems="center"
      paddingVertical="m"
      borderBottomWidth={1}
      borderBottomColor="border"
    >
      <Box flex={1}>
        <Text variant="body" color="text">
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" color="textSecondary" marginTop="xs">
            {subtitle}
          </Text>
        ) : null}
      </Box>
      {rightSlot ? <Box marginLeft="s">{rightSlot}</Box> : null}
    </Box>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}
