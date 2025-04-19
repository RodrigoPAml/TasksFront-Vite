import React from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  className?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  children,
  className,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.overlay}>
      <div className={`${styles.modal} ${className || ''}`}>
        {children}
      </div>
    </div>,
    document.getElementById('modals')!
  );
};

export default Modal;