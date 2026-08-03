import styles from './MetricCard.module.scss';

interface MetricCardProps {
  label: string;
  value: string;
  trend?: number;
  icon?: React.ReactNode;
}

export default function MetricCard({ label, value, trend, icon }: MetricCardProps) {
  const trendColor = trend ? (trend > 0 ? 'var(--color-success)' : trend < 0 ? 'var(--color-danger)' : 'var(--color-text-muted)') : undefined;

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        {icon && <span className={styles.iconIcon}>{icon}</span>}
      </div>
      <div className={styles.valueRow}>
        <span className={styles.value}>{value}</span>
        {trend !== undefined && (
          <span className={styles.trendValue} style={{ color: trendColor }}>
            ({trend > 0 ? '+' : ''}{trend}%)
          </span>
        )}
      </div>
    </div>
  );
}