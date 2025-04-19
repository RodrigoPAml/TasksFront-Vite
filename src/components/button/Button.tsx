import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary';
  title?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  disabled,
  loading = false,
  onClick,
  className,
  variant = 'primary',
  title = '',
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      title={title}
      disabled={disabled || loading}
      className={`${variant === 'primary' ? styles.button : styles.buttonSecondary} ${className ||''}`}
    >
      {children}
      {loading && <span className={styles.spinner} />}
    </button>
  );
};

export default Button;