import styles from './StatusBadge.module.scss';

interface StatusBadgeProps { status: string; }

const colorMap: Record<string, string> = {
  Pending: '#f59e0b', Processing: '#3b82f6', Shipped: '#3b82f6',
  Delivered: '#10b981', Completed: '#10b981', Cancelled: '#9ca3af',
  Refunded: '#ef4444', Draft: '#9ca3af', Approved: '#3b82f6',
  Partial: '#f59e0b', Received: '#10b981',
  Bronze: '#cd7f32', Silver: '#c0c0c0', Gold: '#ffd700', Platinum: '#e5e4e2',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const color = colorMap[status] || 'var(--color-text)';
  return (
    <span className={styles.badge} style={{ background: `${color}20`, color }}>
      {status}
    </span>
  );
}