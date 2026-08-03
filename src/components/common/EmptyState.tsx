import { FiInbox } from 'react-icons/fi';
import styles from './EmptyState.module.scss';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  message?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, title = 'Nothing here', description, message, action }: EmptyStateProps) {
  const desc = description || message;
  return (
    <div className={styles.empty}>
      <div className={styles.iconWrap}>{icon || <FiInbox size={40} />}</div>
      <h4 className={styles.title}>{title}</h4>
      {desc && <p className={styles.description}>{desc}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}