import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text as RNText,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createDrawerNavigator,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import {
  Package,
  ShoppingCart,
  FileText,
  Menu,
  Sun,
  Moon,
  Monitor,
  LogOut,
  List,
  AlertTriangle,
  Archive,
  TrendingUp,
  ShoppingBag,
  BarChart2,
  Star,
  ClipboardList,
  ArrowLeftRight,
  CreditCard,
  Bell,
  Settings as SettingsIcon,
  ChevronDown,
  Check,
} from 'lucide-react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Theme } from '../themes/theme';
import { useThemeStore, type SelectedThemeId } from '../themes/themeStore';
import { useLogout } from '@/modules/auth/hooks/useLogout';
import { useAuthStore } from '@/modules/auth/stores/authStore';
import type { DrawerParamList } from './types';
import { TreeMenu, type TreeMenuSection } from '@/shared/navigation';
import { IconBadge } from '@/shared/components';
import { useCartStore, selectCartCount } from '@/modules/cart/stores/cartStore';
import {
  useNotificationsStore,
  selectUnreadCount,
} from '@/modules/notifications/stores/notificationsStore';

// Existing screens
import { ProductsListScreen } from '@/modules/products/screens/ProductsListScreen';
import { OrdersListScreen } from '@/modules/orders/screens/OrdersListScreen';
import { SalesListScreen } from '@/modules/sales/screens/SalesListScreen';
import { QuotationsListScreen } from '@/modules/quotations/screens/QuotationsListScreen';

// New stub screens
import { PurchasesListScreen } from '@/modules/purchases/screens/PurchasesListScreen';
import { TransfersListScreen } from '@/modules/transfers/screens/TransfersListScreen';
import { AccountsReceivableScreen } from '@/modules/accounts/screens/AccountsReceivableScreen';
import { MinStockScreen } from '@/modules/inventory/screens/MinStockScreen';
import { InventoryScreen } from '@/modules/inventory/screens/InventoryScreen';
import { UtilitiesScreen } from '@/modules/inventory/screens/UtilitiesScreen';
import { SalesReportScreen } from '@/modules/reports/screens/SalesReportScreen';
import { BestSellersScreen } from '@/modules/reports/screens/BestSellersScreen';
import { SettingsScreen } from '@/modules/settings/screens/SettingsScreen';

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
      { label: 'Stock Mínimo', routeName: 'MinStock', icon: AlertTriangle },
      { label: 'Inventario', routeName: 'Inventory', icon: Archive },
      { label: 'Utilidades', routeName: 'Utilities', icon: TrendingUp },
    ],
  },
  {
    key: 'ventas',
    label: 'Ventas',
    icon: ShoppingBag,
    items: [
      { label: 'Lista', routeName: 'Sales', icon: List },
      { label: 'Reporte General', routeName: 'SalesReport', icon: BarChart2 },
      { label: 'Más Vendidos', routeName: 'BestSellers', icon: Star },
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
// BranchPickerTitle — header center: shows active branch, opens dropdown to switch
// Hidden picker if user only has one branch.
// ---------------------------------------------------------------------------
function BranchPickerTitle(): React.JSX.Element {
  const { colors } = useTheme<Theme>();
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
    setVisible(false);
  };

  if (!activeBranch) return <View />;

  // Single branch — no picker, just the name
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

// ---------------------------------------------------------------------------
// Header right icons — ShoppingCart (left) + Bell (right/last)
// ---------------------------------------------------------------------------
function HeaderIcons(): React.JSX.Element {
  const { colors } = useTheme<Theme>();
  const cartCount = useCartStore(selectCartCount);
  const notifCount = useNotificationsStore(selectUnreadCount);

  return (
    <View style={styles.headerIconsRow}>
      <IconBadge
        icon={<ShoppingCart color={colors.text} size={22} />}
        count={cartCount}
      />
      <IconBadge
        icon={<Bell color={colors.text} size={22} />}
        count={notifCount}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Custom drawer toggle button — avoids @react-navigation/drawer PNG asset bug
// ---------------------------------------------------------------------------
function DrawerToggleButton(): React.JSX.Element {
  const { colors } = useTheme<Theme>();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={{ paddingHorizontal: 16, paddingVertical: 8 }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Menu color={colors.text} size={24} />
    </TouchableOpacity>
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
        headerRight: () => <HeaderIcons />,
      }}
    >
      <Drawer.Screen
        name="Products"
        component={ProductsListScreen}
        options={{ title: 'Productos' }}
      />
      <Drawer.Screen
        name="MinStock"
        component={MinStockScreen}
        options={{ title: 'Stock Mínimo' }}
      />
      <Drawer.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{ title: 'Inventario' }}
      />
      <Drawer.Screen
        name="Utilities"
        component={UtilitiesScreen}
        options={{ title: 'Utilidades' }}
      />
      <Drawer.Screen
        name="Sales"
        component={SalesListScreen}
        options={{ title: 'Ventas' }}
      />
      <Drawer.Screen
        name="SalesReport"
        component={SalesReportScreen}
        options={{ title: 'Reporte General' }}
      />
      <Drawer.Screen
        name="BestSellers"
        component={BestSellersScreen}
        options={{ title: 'Más Vendidos' }}
      />
      <Drawer.Screen
        name="Orders"
        component={OrdersListScreen}
        options={{ title: 'Pedidos' }}
      />
      <Drawer.Screen
        name="Purchases"
        component={PurchasesListScreen}
        options={{ title: 'Compras' }}
      />
      <Drawer.Screen
        name="Quotations"
        component={QuotationsListScreen}
        options={{ title: 'Cotizaciones' }}
      />
      <Drawer.Screen
        name="Transfers"
        component={TransfersListScreen}
        options={{ title: 'Transferencias' }}
      />
      <Drawer.Screen
        name="AccountsReceivable"
        component={AccountsReceivableScreen}
        options={{ title: 'Cuentas por Cobrar' }}
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
  headerIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingRight: 8,
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
  // BranchPickerTitle
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
