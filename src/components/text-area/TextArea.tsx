import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import styles from './TextArea.module.css';

interface TextAreaProps {
  id: string;
  label: string;
  placeholder?: string;
  error?: string;
  registration?: UseFormRegisterReturn;
  className?: string;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
}

const TextArea: React.FC<TextAreaProps> = ({
  id,
  label,
  placeholder,
  error,
  registration,
  className = '',
  disabled = false,
  rows = 4,
  maxLength,
}) => {
  return (
    <div className={className}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <textarea
        id={id}
        className={`${styles.textarea} ${error ? styles.error : ''}`}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        {...registration}
      />
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default TextArea;