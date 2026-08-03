import styles from './LoadingSpinner.module.scss';

interface LoadingSpinnerProps { size?: 'sm' | 'md' | 'lg'; }

export default function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  return <span className={`${styles.spinner} ${styles[size]}`} />;
}