import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DrawerScreenProps } from '@react-navigation/drawer';

// ---------------------------------------------------------------------------
// Root stack — gates between Auth, Branch, and Main (Drawer) flows
// ---------------------------------------------------------------------------
export type RootStackParamList = {
  Auth: undefined;
  Branch: undefined;
  Main: undefined;
};

// ---------------------------------------------------------------------------
// Auth flow — Login + BranchSelector
// ---------------------------------------------------------------------------
export type AuthStackParamList = {
  Login: undefined;
  BranchSelector: undefined;
};

// ---------------------------------------------------------------------------
// Main flow — Drawer navigator screens
// ---------------------------------------------------------------------------
export type DrawerParamList = {
  Products: undefined;
  Orders: undefined;
  Sales: undefined;
  Quotations: undefined;
  Purchases: undefined;
  Transfers: undefined;
  AccountsReceivable: undefined;
  MinStock: undefined;
  Inventory: undefined;
  Utilities: undefined;
  SalesReport: undefined;
  BestSellers: undefined;
  Settings: undefined;
};

// ---------------------------------------------------------------------------
// Screen prop helpers
// ---------------------------------------------------------------------------
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type DrawerScreenPropsHelper<T extends keyof DrawerParamList> =
  DrawerScreenProps<DrawerParamList, T>;
