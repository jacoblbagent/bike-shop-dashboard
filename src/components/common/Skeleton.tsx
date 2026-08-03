import styles from './Skeleton.module.scss';

interface SkeletonProps {
  width?: string;
  height?: string;
  count?: number;
  className?: string;
}

export default function Skeleton({ width = '100%', height = '16px', count = 1, className = '' }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={`${styles.skeleton} ${className}`} style={{ width, height, display: 'block', marginBottom: count > 1 ? '8px' : 0 }} />
      ))}
    </>
  );
}