import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiPackage, FiUsers, FiShoppingCart, FiClipboard, FiBarChart2, FiSettings, FiMenu, FiSun, FiMoon, FiLogIn, FiLogOut,
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { toggleSidebar, setTheme } from '@/app/store/slices/uiSlice';
import { useAuth } from '@/features/auth/useAuth';
import { navItems } from './navConfig';
import styles from './Sidebar.module.scss';

export default function Sidebar() {
  const dispatch = useDispatch();
  const { sidebarCollapsed: collapsed, theme } = useSelector((s: RootState) => s.ui);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={`${styles.logo} ${collapsed ? styles.collapsed : ''}`}>
        <button className={styles.toggleBtn} onClick={() => dispatch(toggleSidebar())} aria-label="Toggle sidebar">
          <FiMenu size={18} />
        </button>
        {!collapsed && <span className={styles.logoText}>ChainLink</span>}
      </div>
      <nav className={styles.nav}>
        {navItems.filter(item => item.path !== '/settings').map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.activeLink : ''}`}
          >
            <item.icon size={18} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className={styles.spacer} />
      <div className={styles.bottomSection}>
        <button className={`${styles.link} ${styles.themeToggle}`} onClick={() => dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'))}>
          {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
          {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        <NavLink
          to="/settings"
          className={({ isActive }) => `${styles.link} ${isActive ? styles.activeLink : ''}`}
        >
          <FiSettings size={18} />
          {!collapsed && <span>Settings</span>}
        </NavLink>
        <div className={styles.authDivider} />
        {isAuthenticated ? (
          <button className={styles.link} onClick={() => navigate('/logout')}>
            <FiLogOut size={18} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        ) : (
          <NavLink to="/login" className={styles.link}>
            <FiLogIn size={18} />
            {!collapsed && <span>Sign In</span>}
          </NavLink>
        )}
      </div>
    </aside>
  );
}
