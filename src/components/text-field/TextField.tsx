import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import styles from './TextField.module.css';

interface TextFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  registration?: UseFormRegisterReturn;
  className?: string;
  disabled?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({
  id,
  label,
  placeholder,
  error,
  registration,
  className = '',
  type = 'text',
  disabled = false,
}) => {
  return (
    <div className={className}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        className={`${styles.input} ${error ? styles.error : ''}`}
        placeholder={placeholder}
        disabled={disabled}
        {...registration}
      />
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default TextField;