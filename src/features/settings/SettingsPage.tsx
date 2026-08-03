import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { FiUser, FiShoppingBag, FiBell, FiNavigation } from 'react-icons/fi';
import type { RootState } from '@/app/store';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { navItems } from '@/components/layout/navConfig';
import { useBottomNav } from '@/components/layout/useBottomNav';
import styles from './SettingsPage.module.scss';

export default function SettingsPage() {
  const { items, setSlot } = useBottomNav();
  const bottomNavPaths = useSelector((s: RootState) => s.ui.bottomNav);

  // ── Profile ─────────────────────────────────────────────────
  const initialProfile = useRef({ storeName: 'ChainLink Bike Shop', email: 'owner@chainlinkbikes.com', phone: '(555) 123-4567' });
  const [profile, setProfile] = useState({ ...initialProfile.current });
  const profileDirty =
    profile.storeName !== initialProfile.current.storeName ||
    profile.email !== initialProfile.current.email ||
    profile.phone !== initialProfile.current.phone;

  // ── Store Configuration ─────────────────────────────────────
  const initialConfig = useRef({ currency: 'USD', taxRate: '8', lowStockThreshold: '5' });
  const [config, setConfig] = useState({ ...initialConfig.current });
  const configDirty =
    config.currency !== initialConfig.current.currency ||
    config.taxRate !== initialConfig.current.taxRate ||
    config.lowStockThreshold !== initialConfig.current.lowStockThreshold;

  // ── Bottom Nav ──────────────────────────────────────────────
  const initialNavPaths = useRef([...bottomNavPaths]);
  const navDirty = bottomNavPaths.some((p, i) => p !== initialNavPaths.current[i]);

  // ── Notifications ───────────────────────────────────────────
  const initialNotifs = useRef({ lowStock: true, newOrder: true, poStatus: true, dailySummary: false });
  const [notifs, setNotifs] = useState({ ...initialNotifs.current });
  const notifsDirty =
    notifs.lowStock !== initialNotifs.current.lowStock ||
    notifs.newOrder !== initialNotifs.current.newOrder ||
    notifs.poStatus !== initialNotifs.current.poStatus ||
    notifs.dailySummary !== initialNotifs.current.dailySummary;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Settings</h1>
      <div className={styles.grid}>

        {/* Profile */}
        <Card className={styles.section}>
          <div className={styles.sectionHeader}>
            <FiUser size={18} />
            <h3>Profile</h3>
          </div>
          <div className={styles.field}>
            <label>Store Name</label>
            <input
              type="text"
              value={profile.storeName}
              onChange={e => setProfile(p => ({ ...p, storeName: e.target.value }))}
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label>Phone</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
              className={styles.input}
            />
          </div>
          <Button disabled={!profileDirty}>Save Changes</Button>
        </Card>

        {/* Store Configuration */}
        <Card className={styles.section}>
          <div className={styles.sectionHeader}>
            <FiShoppingBag size={18} />
            <h3>Store Configuration</h3>
          </div>
          <div className={styles.field}>
            <label>Currency</label>
            <select
              value={config.currency}
              onChange={e => setConfig(c => ({ ...c, currency: e.target.value }))}
              className={styles.input}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Tax Rate (%)</label>
            <input
              type="number"
              value={config.taxRate}
              onChange={e => setConfig(c => ({ ...c, taxRate: e.target.value }))}
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label>Low Stock Threshold</label>
            <input
              type="number"
              value={config.lowStockThreshold}
              onChange={e => setConfig(c => ({ ...c, lowStockThreshold: e.target.value }))}
              className={styles.input}
            />
          </div>
          <Button disabled={!configDirty}>Save Changes</Button>
        </Card>

        {/* Bottom Nav Bar */}
        <Card className={styles.section}>
          <div className={styles.sectionHeader}>
            <FiNavigation size={18} />
            <h3>Bottom Nav Bar</h3>
          </div>
          <p className={styles.hint}>Choose up to 4 shortcuts for the mobile bottom navigation bar.</p>
          {items.map((item, i) => (
            <div key={i} className={styles.field}>
              <label>Slot {i + 1}</label>
              <select
                className={styles.input}
                value={item.path}
                onChange={e => setSlot(i, e.target.value)}
              >
                {navItems.map(n => (
                  <option key={n.path} value={n.path}>{n.label}</option>
                ))}
              </select>
            </div>
          ))}
          <Button disabled={!navDirty}>Save Nav Layout</Button>
        </Card>

        {/* Notifications */}
        <Card className={styles.section}>
          <div className={styles.sectionHeader}>
            <FiBell size={18} />
            <h3>Notifications</h3>
          </div>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={notifs.lowStock}
              onChange={e => setNotifs(n => ({ ...n, lowStock: e.target.checked }))}
            />
            <span>Low stock alerts</span>
          </label>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={notifs.newOrder}
              onChange={e => setNotifs(n => ({ ...n, newOrder: e.target.checked }))}
            />
            <span>New order notifications</span>
          </label>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={notifs.poStatus}
              onChange={e => setNotifs(n => ({ ...n, poStatus: e.target.checked }))}
            />
            <span>Purchase order status updates</span>
          </label>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={notifs.dailySummary}
              onChange={e => setNotifs(n => ({ ...n, dailySummary: e.target.checked }))}
            />
            <span>Daily sales summary email</span>
          </label>
          <Button disabled={!notifsDirty}>Save Preferences</Button>
        </Card>

      </div>
    </div>
  );
}