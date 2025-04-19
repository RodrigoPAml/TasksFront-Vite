import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import styles from './SelectInput.module.css';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectInputProps {
  id: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  registration?: UseFormRegisterReturn;
  className?: string;
  disabled?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({
  id,
  label,
  options,
  placeholder,
  error,
  registration,
  className = '',
  disabled = false,
}) => {
  return (
    <div className={className}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <select
        id={id}
        className={`${styles.select} ${error ? styles.error : ''}`}
        disabled={disabled}
        {...registration}
      >
        {placeholder && (
          <option value="">
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default SelectInput;