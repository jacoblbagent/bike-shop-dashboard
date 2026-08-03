import { NavLink } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import { navItems } from './navConfig';
import { useBottomNav } from './useBottomNav';
import styles from './MobileNav.module.scss';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const { items } = useBottomNav();

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${open ? styles.overlayVisible : ''}`}
        onClick={onClose}
      />

      {/* Bottom nav bar — 4 programmable buttons */}
      <nav className={styles.bottomNav}>
        {items.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <item.icon size={20} />
            <span className={styles.navLabel}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Slide-out full menu panel */}
      <div className={`${styles.menuPanel} ${open ? styles.menuOpen : ''}`}>
        <div className={styles.menuHeader}>
          <span className={styles.menuTitle}>ChainLink</span>
          <button className={styles.closeBtn} onClick={onClose}><FiX size={20} /></button>
        </div>
        <div className={styles.menuBody}>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.menuActive : ''}`}
              onClick={onClose}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}