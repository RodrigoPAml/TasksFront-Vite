import React from 'react';
import styles from './LinkButton.module.css';

interface LinkButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  onClick,
  className,
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${className || ''}`}
      type="button"
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default LinkButton;