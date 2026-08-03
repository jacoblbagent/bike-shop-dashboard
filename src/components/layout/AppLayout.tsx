import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import Header from './Header';
import styles from './AppLayout.module.scss';

export default function AppLayout() {
  const sidebarCollapsed = useSelector((s: RootState) => s.ui.sidebarCollapsed);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <div className={styles.layout}>
      {!isMobile && <Sidebar />}
      {isMobile && (
        <>
          <Header onMenuToggle={() => setMobileMenuOpen(prev => !prev)} mobile />
          <MobileNav open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </>
      )}
      {!isMobile && <Header onMenuToggle={() => {}} />}
      <main
        className={styles.main}
        style={{
          marginLeft: isMobile ? 0 : (sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)'),
          paddingBottom: isMobile ? '80px' : undefined,
        }}
      >
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}