import React from 'react';
import {
  View,
  StyleSheet,
  Text as RNText,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  createDrawerNavigator,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import {
  Package,
  ShoppingCart,
  FileText,
  Sun,
  Moon,
  Monitor,
  LogOut,
  List,
  Archive,
  ShoppingBag,
  ClipboardList,
  ArrowLeftRight,
  CreditCard,
  Settings as SettingsIcon,
} from 'lucide-react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Theme } from '../themes/theme';
import { useThemeStore, type SelectedThemeId } from '../themes/themeStore';
import { useLogout } from '@/modules/auth/hooks/useLogout';
import { useAuthStore } from '@/modules/auth/stores/authStore';
import type { DrawerParamList } from './types';
import { TreeMenu, type TreeMenuSection } from '@/shared/navigation';
import { DrawerToggleButton, BranchPickerTitle } from '@/navigation/components';

// Stack navigators for modules with detail screens
import { ProductsStackNavigator } from '@/navigation/stacks/ProductsStackNavigator';
import { SalesStackNavigator } from '@/navigation/stacks/SalesStackNavigator';
import { OrdersStackNavigator } from '@/navigation/stacks/OrdersStackNavigator';
import { QuotationsStackNavigator } from '@/navigation/stacks/QuotationsStackNavigator';

// New stub screens
import { InventoryScreen } from '@/modules/inventory/screens/InventoryScreen';
import { AccountsReceivableStackNavigator } from '@/navigation/stacks/AccountsReceivableStackNavigator';
import { SettingsScreen } from '@/modules/settings/screens/SettingsScreen';

import { PurchasesStackNavigator } from '@/navigation/stacks/PurchasesStackNavigator';
import { TransfersStackNavigator } from '@/navigation/stacks/TransfersStackNavigator';

// ---------------------------------------------------------------------------
// Tree sections config
// ---------------------------------------------------------------------------
const TREE_SECTIONS: TreeMenuSection[] = [
  {
    key: 'productos',
    label: 'Productos',
    icon: Package,
    items: [
      { label: 'Lista', routeName: 'Products', icon: List },
      { label: 'Inventario', routeName: 'Inventory', icon: Archive },
    ],
  },
  {
    key: 'ventas',
    label: 'Ventas',
    icon: ShoppingBag,
    direct: true,
    items: [
      { label: 'Ventas', routeName: 'Sales', icon: List },
    ],
  },
  {
    key: 'compras',
    label: 'Compras',
    icon: ShoppingCart,
    items: [
      { label: 'Pedidos', routeName: 'Orders', icon: ClipboardList },
      { label: 'Compras', routeName: 'Purchases', icon: Package },
    ],
  },
  {
    key: 'cotizaciones',
    label: 'Cotizaciones',
    icon: FileText,
    direct: true,
    items: [{ label: 'Cotizaciones', routeName: 'Quotations', icon: FileText }],
  },
  {
    key: 'transferencias',
    label: 'Transferencias',
    icon: ArrowLeftRight,
    direct: true,
    items: [{ label: 'Transferencias', routeName: 'Transfers', icon: ArrowLeftRight }],
  },
  {
    key: 'cuentas',
    label: 'Cuentas por Cobrar',
    icon: CreditCard,
    direct: true,
    items: [{ label: 'Cuentas por Cobrar', routeName: 'AccountsReceivable', icon: CreditCard }],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

// ---------------------------------------------------------------------------
// UserProfileCard — drawer header with avatar, name, email, branch + role
// ---------------------------------------------------------------------------
function UserProfileCard(): React.JSX.Element {
  const { colors } = useTheme<Theme>();
  const { top } = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const selectedBranchId = useAuthStore((s) => s.selectedBranchId);

  const activeBranch =
    user?.sucursales.find((s) => s.id === selectedBranchId) ??
    user?.sucursales[0] ??
    null;

  // full_name may come empty from backend — fallback to name
  const displayName = user?.full_name || user?.name || '—';
  const initials = getInitials(displayName);

  return (
    <View style={[styles.drawerHeader, { borderBottomColor: colors.border, paddingTop: top + 12 }]}>
      <View style={styles.profileRow}>
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <RNText style={[styles.avatarText, { color: colors.textInverse }]}>
            {initials}
          </RNText>
        </View>

        {/* Info */}
        <View style={styles.profileInfo}>
          <RNText
            style={[styles.profileName, { color: colors.text }]}
            numberOfLines={1}
          >
            {displayName}
          </RNText>

          {activeBranch && (
            <>
              <View style={[styles.rolePill, { backgroundColor: colors.primary + '18' }]}>
                <RNText style={[styles.roleText, { color: colors.primary }]} numberOfLines={1}>
                  {activeBranch.rol}
                </RNText>
              </View>
              <View style={styles.branchNameRow}>
                <View style={[styles.siglaPill, { backgroundColor: colors.border }]}>
                  <RNText style={[styles.siglaText, { color: colors.textSecondary }]}>
                    {activeBranch.sigla}
                  </RNText>
                </View>
                <RNText
                  style={[styles.profileBranch, { color: colors.textSecondary }]}
                  numberOfLines={1}
                >
                  {activeBranch.sucursal}
                </RNText>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Theme selector — quick brightness toggle: light / system / dark
// Full theme collection is in the Settings screen.
// ---------------------------------------------------------------------------
const QUICK_OPTIONS: { id: SelectedThemeId; Icon: typeof Sun }[] = [
  { id: 'light', Icon: Sun },
  { id: 'system', Icon: Monitor },
  { id: 'dark-amoled', Icon: Moon },
];

function ThemeSelector(): React.JSX.Element {
  const { colors } = useTheme<Theme>();
  const themeId = useThemeStore((s) => s.themeId);
  const setThemeId = useThemeStore((s) => s.setThemeId);

  function isActive(id: SelectedThemeId): boolean {
    if (id === 'system') return themeId === 'system';
    if (id === 'light') return themeId === 'light' || (themeId as string).startsWith('light-');
    // 'dark-default' button = active for any dark theme
    return (themeId as string).startsWith('dark');
  }

  return (
    <View style={styles.themeOptionsRow}>
      {QUICK_OPTIONS.map(({ id, Icon }) => {
        const active = isActive(id);
        return (
          <TouchableOpacity
            key={id}
            onPress={() => setThemeId(id)}
            style={[
              styles.themeOption,
              {
                backgroundColor: active ? colors.primary + '22' : 'transparent',
                borderColor: active ? colors.primary : colors.border,
              },
            ]}
          >
            <Icon size={14} color={active ? colors.primary : colors.textSecondary} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Logout button
// ---------------------------------------------------------------------------
function LogoutButton(): React.JSX.Element {
  const { colors } = useTheme<Theme>();
  const { logout } = useLogout();

  return (
    <TouchableOpacity
      onPress={() => void logout()}
      style={[styles.logoutButton, { borderColor: colors.border }]}
    >
      <LogOut size={14} color={colors.danger} />
      <RNText style={[styles.logoutLabel, { color: colors.danger }]}>
        Cerrar sesión
      </RNText>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Custom drawer content — pinned header + scrollable tree + pinned footer
// ---------------------------------------------------------------------------
function DrawerContent(props: DrawerContentComponentProps): React.JSX.Element {
  const { colors } = useTheme<Theme>();
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.drawerRoot, { backgroundColor: colors.surface }]}>
      {/* Header — pinned */}
      <UserProfileCard />

      {/* Scrollable nav area */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TreeMenu sections={TREE_SECTIONS} navigation={props.navigation} />
      </ScrollView>

      {/* Footer — pinned outside scroll */}
      <View style={[styles.drawerFooter, { borderTopColor: colors.border, paddingBottom: bottom + 12 }]}>
        <View style={styles.footerRow}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Settings')}
            style={styles.settingsButton}
          >
            <SettingsIcon size={13} color={colors.textSecondary} />
            <RNText style={[styles.footerLabel, { color: colors.textSecondary }]}>
              Configuración
            </RNText>
          </TouchableOpacity>
          <ThemeSelector />
        </View>
        <LogoutButton />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Navigator
// ---------------------------------------------------------------------------
const Drawer = createDrawerNavigator<DrawerParamList>();

export function MainNavigator(): React.JSX.Element {
  const { colors } = useTheme<Theme>();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        drawerPosition: 'left',
        drawerStyle: {
          backgroundColor: colors.surface,
          borderRightWidth: StyleSheet.hairlineWidth,
          borderRightColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.surface,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.text,
        headerTitle: () => <BranchPickerTitle />,
        headerLeft: () => <DrawerToggleButton />,
      }}
    >
      <Drawer.Screen
        name="Products"
        component={ProductsStackNavigator}
        options={({ route }) => ({
          headerShown: getFocusedRouteNameFromRoute(route) !== 'ProductDetail',
        })}
      />
      <Drawer.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{ title: 'Inventario' }}
      />
      <Drawer.Screen
        name="Sales"
        component={SalesStackNavigator}
        options={({ route }) => ({
          headerShown: getFocusedRouteNameFromRoute(route) !== 'SaleDetail',
        })}
      />
      <Drawer.Screen
        name="Orders"
        component={OrdersStackNavigator}
        options={({ route }) => ({
          headerShown: getFocusedRouteNameFromRoute(route) !== 'OrderDetail',
        })}
      />
      <Drawer.Screen
        name="Purchases"
        component={PurchasesStackNavigator}
        options={({ route }) => ({
          headerShown: getFocusedRouteNameFromRoute(route) !== 'PurchaseDetail',
        })}
      />
      <Drawer.Screen
        name="Quotations"
        component={QuotationsStackNavigator}
        options={({ route }) => ({
          headerShown: getFocusedRouteNameFromRoute(route) !== 'QuotationDetail',
        })}
      />
      <Drawer.Screen
        name="Transfers"
        component={TransfersStackNavigator}
        options={({ route }) => ({
          headerShown: getFocusedRouteNameFromRoute(route) !== 'TransferDetail',
        })}
      />
      <Drawer.Screen
        name="AccountsReceivable"
        component={AccountsReceivableStackNavigator}
        options={({ route }) => ({
          headerShown: getFocusedRouteNameFromRoute(route) !== 'AccountReceivableDetail',
        })}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Configuración' }}
      />
    </Drawer.Navigator>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  drawerRoot: {
    flex: 1,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: 15,
    fontWeight: '600',
  },
  rolePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 3,
    marginBottom: 4,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  branchNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  siglaPill: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  siglaText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  profileBranch: {
    fontSize: 11,
    flex: 1,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 4,
  },
  drawerFooter: {
    paddingTop: 12,
    paddingHorizontal: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  footerLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  themeOptionsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  themeOption: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
  },
  logoutLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});
