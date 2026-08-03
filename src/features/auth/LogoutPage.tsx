import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import styles from './LogoutPage.module.scss';

export default function LogoutPage() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign Out</h1>
        <p className={styles.subtitle}>
          {isAuthenticated
            ? 'Are you sure you want to sign out?'
            : 'You are not currently signed in.'}
        </p>
        {isAuthenticated ? (
          <div className={styles.actions}>
            <button className={styles.button} onClick={handleLogout}>
              Sign Out
            </button>
            <button className={styles.secondary} onClick={() => navigate('/')}>
              Cancel
            </button>
          </div>
        ) : (
          <button className={styles.button} onClick={() => navigate('/login')}>
            Go to Sign In
          </button>
        )}
      </div>
    </div>
  );
}