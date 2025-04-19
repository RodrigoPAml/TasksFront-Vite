import React from 'react';
import styles from './Snackbar.module.css';

export type SnackbarType = 'success' | 'error' | 'info' | 'warning';

interface SnackbarProps {
  message: string;
  type: SnackbarType;
  onClose: () => void;
  timeout?: number;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, type, onClose, timeout }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, timeout);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.container}>
      <div className={`${styles.snackbar} ${styles[type]}`}>
        <span>{message}</span>
        <button
          onClick={onClose}
          className={styles.closeButton}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Snackbar;