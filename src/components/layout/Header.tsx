import { FiMenu, FiBell, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import type { RootState } from '@/app/store';
import { useState, useRef, useEffect } from 'react';
import styles from './Header.module.scss';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/inventory': 'Inventory',
  '/inventory/bikes': 'Bikes',
  '/inventory/parts': 'Parts',
  '/customers': 'Customers',
  '/sales': 'Sales',
  '/purchase-orders': 'Purchase Orders',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

interface HeaderProps {
  onMenuToggle: () => void;
  mobile?: boolean;
}

// ── Mock notifications ────────────────────────────────────────
const mockNotifications = [
  { id: '1', type: 'order', title: 'New Order Received', message: 'Order ORD-1023 from Sarah Johnson', time: '2m ago', unread: true, route: '/sales' },
  { id: '2', type: 'stock', title: 'Low Stock Alert', message: 'Fuel EX 8 has only 1 unit left', time: '15m ago', unread: true, route: '/inventory' },
  { id: '3', type: 'order', title: 'Order Shipped', message: 'PO-2006 has been marked as shipped', time: '1h ago', unread: false, route: '/purchase-orders' },
  { id: '4', type: 'info', title: 'Report Ready', message: 'Monthly sales report is available', time: '3h ago', unread: false, route: '/reports' },
];

const notificationIcons: Record<string, typeof FiInfo> = {
  order: FiInfo,
  stock: FiAlertTriangle,
  info: FiInfo,
};

export default function Header({ onMenuToggle, mobile = false }: HeaderProps) {
  const navigate = useNavigate();
  const { sidebarCollapsed } = useSelector((s: RootState) => s.ui);
  const location = useLocation();
  const pageTitle = Object.entries(pageTitles).find(([path]) => location.pathname.startsWith(path))?.[1] || 'Dashboard';

  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifOpen && notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userOpen && userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [notifOpen, userOpen]);

  const unreadCount = mockNotifications.filter(n => n.unread).length;

  return (
    <header className={`${styles.header} ${mobile ? styles.mobileHeader : ''} ${!mobile && sidebarCollapsed ? styles.headerCollapsed : ''}`}>
      <div className={styles.left}>
        {mobile && (
          <button className={styles.iconBtn} onClick={onMenuToggle} aria-label="Menu">
            <FiMenu size={20} />
          </button>
        )}
        <h2 className={`${styles.pageTitle} ${mobile ? styles.mobileTitle : ''}`}>{pageTitle}</h2>
      </div>
      <div className={styles.right}>

        {/* Notifications */}
        <div className={styles.dropdownWrap} ref={notifRef}>
          <button className={styles.iconBtn} onClick={() => { setNotifOpen(v => !v); setUserOpen(false); }} aria-label="Notifications">
            <FiBell size={18} />
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </button>
          {notifOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <span className={styles.dropdownTitle}>Notifications</span>
                <button className={styles.dropdownAction} onClick={() => setNotifOpen(false)}>Mark all read</button>
              </div>
              <div className={styles.notifList}>
                {mockNotifications.map(n => {
                  const Icon = notificationIcons[n.type] || FiInfo;
                  return (
                    <div key={n.id} className={`${styles.notifItem} ${n.unread ? styles.notifUnread : ''}`} onClick={() => { navigate(n.route); setNotifOpen(false); }}>
                      <div className={styles.notifIcon}><Icon size={14} /></div>
                      <div className={styles.notifBody}>
                        <div className={styles.notifTitle}>{n.title}</div>
                        <div className={styles.notifMsg}>{n.message}</div>
                        <div className={styles.notifTime}>{n.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        {!mobile && (
          <div className={styles.dropdownWrap} ref={userRef}>
            <div className={styles.user} onClick={() => { setUserOpen(v => !v); setNotifOpen(false); }}>
              <div className={styles.avatar}>JD</div>
              <span className={styles.userName}>Shop Owner</span>
            </div>
            {userOpen && (
              <div className={styles.dropdown}>
                <div className={styles.userCard}>
                  <div className={styles.avatarLarge}>JD</div>
                  <div>
                    <div className={styles.userCardName}>Shop Owner</div>
                    <div className={styles.userCardEmail}>owner@chainlinkbikes.com</div>
                  </div>
                </div>
                <div className={styles.menuList}>
                  <button className={styles.menuItem} onClick={() => { navigate('/settings'); setUserOpen(false); }}>
                    Settings
                  </button>
                  <button className={styles.menuItem} onClick={() => { navigate('/settings'); setUserOpen(false); }}>
                    Profile
                  </button>
                  <div className={styles.menuDivider} />
                  <button className={styles.menuItem} onClick={() => { setUserOpen(false); }}>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}