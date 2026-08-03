import { FiGrid, FiPackage, FiUsers, FiShoppingCart, FiClipboard, FiBarChart2, FiSettings } from 'react-icons/fi';
import type { IconType } from 'react-icons';

export interface NavItem {
  path: string;
  icon: IconType;
  label: string;
}

export const navItems: NavItem[] = [
  { path: '/', icon: FiGrid, label: 'Dashboard' },
  { path: '/inventory', icon: FiPackage, label: 'Inventory' },
  { path: '/customers', icon: FiUsers, label: 'Customers' },
  { path: '/sales', icon: FiShoppingCart, label: 'Sales' },
  { path: '/purchase-orders', icon: FiClipboard, label: 'Purchase Orders' },
  { path: '/reports', icon: FiBarChart2, label: 'Reports' },
  { path: '/settings', icon: FiSettings, label: 'Settings' },
];