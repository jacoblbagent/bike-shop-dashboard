import { FiUser, FiShoppingBag, FiBell, FiNavigation } from 'react-icons/fi';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { navItems } from '@/components/layout/navConfig';
import { useBottomNav } from '@/components/layout/useBottomNav';
import styles from './SettingsPage.module.scss';

export default function SettingsPage() {
  const { items, setSlot } = useBottomNav();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Settings</h1>
      <div className={styles.grid}>
        <Card className={styles.section}>
          <div className={styles.sectionHeader}>
            <FiUser size={18} />
            <h3>Profile</h3>
          </div>
          <div className={styles.field}>
            <label>Store Name</label>
            <input type="text" defaultValue="ChainLink Bike Shop" className={styles.input} />
          </div>
          <div className={styles.field}>
            <label>Email</label>
            <input type="email" defaultValue="owner@chainlinkbikes.com" className={styles.input} />
          </div>
          <div className={styles.field}>
            <label>Phone</label>
            <input type="tel" defaultValue="(555) 123-4567" className={styles.input} />
          </div>
          <Button>Save Changes</Button>
        </Card>

        <Card className={styles.section}>
          <div className={styles.sectionHeader}>
            <FiShoppingBag size={18} />
            <h3>Store Configuration</h3>
          </div>
          <div className={styles.field}>
            <label>Currency</label>
            <select defaultValue="USD" className={styles.input}>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Tax Rate (%)</label>
            <input type="number" defaultValue="8" className={styles.input} />
          </div>
          <div className={styles.field}>
            <label>Low Stock Threshold</label>
            <input type="number" defaultValue="5" className={styles.input} />
          </div>
          <Button>Save Changes</Button>
        </Card>

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
        </Card>

        <Card className={styles.section}>
          <div className={styles.sectionHeader}>
            <FiBell size={18} />
            <h3>Notifications</h3>
          </div>
          <label className={styles.checkbox}>
            <input type="checkbox" defaultChecked />
            <span>Low stock alerts</span>
          </label>
          <label className={styles.checkbox}>
            <input type="checkbox" defaultChecked />
            <span>New order notifications</span>
          </label>
          <label className={styles.checkbox}>
            <input type="checkbox" defaultChecked />
            <span>Purchase order status updates</span>
          </label>
          <label className={styles.checkbox}>
            <input type="checkbox" />
            <span>Daily sales summary email</span>
          </label>
          <Button>Save Preferences</Button>
        </Card>
      </div>
    </div>
  );
}