import React from 'react';

import { EmptyState, ScreenLayout } from '@/shared/components';

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export function TransfersListScreen(): React.JSX.Element {
  return (
    <ScreenLayout>
      <EmptyState title="Transferencias" message="Módulo en desarrollo" />
    </ScreenLayout>
  );
}
