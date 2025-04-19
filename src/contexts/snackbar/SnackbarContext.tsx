import React, { createContext, useContext, useState, useCallback } from 'react';
import Snackbar, { SnackbarType } from '../../components/snackbar/Snackbar';
import styles from './SnackbarContext.module.css';

interface SnackbarMessage {
  id: number;
  message: string;
  type: SnackbarType;
  timeout?: number;
}

interface SnackbarContextType {
  showSnackbar: (message: string, type: SnackbarType, timeout?: number) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snackbars, setSnackbars] = useState<SnackbarMessage[]>([]);

  const showSnackbar = useCallback((message: string, type: SnackbarType, timeout?: number) => {
    setSnackbars(current => [...current, {
      id: Date.now(),
      message,
      type,
      timeout
    }]);
  }, []);

  const handleClose = useCallback((id: number) => {
    setSnackbars(current => current.filter(snackbar => snackbar.id !== id));
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <div className={styles.snackbarContainer}>
        {snackbars.map(snackbar => (
          <Snackbar
            key={snackbar.id}
            message={snackbar.message}
            type={snackbar.type}
            timeout={snackbar.timeout ?? 4000}
            onClose={() => handleClose(snackbar.id)}
          />
        ))}
      </div>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }

  return context;
};