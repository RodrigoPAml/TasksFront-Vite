import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import styles from './DateInput.module.css';

interface DateInputProps {
  id: string;
  label: string;
  placeholder?: string;
  error?: string;
  registration?: UseFormRegisterReturn;
  className?: string;
  disabled?: boolean;
  onInvalidDate?: (isValid: boolean) => void;
}

const DateInput: React.FC<DateInputProps> = ({
  id,
  label,
  placeholder = 'DD/MM/YYYY',
  error,
  registration,
  className = '',
  disabled = false,
  onInvalidDate,
}) => {
  const isValidDate = (dateString: string): boolean => {
    if(!dateString) {
      return true;
    }

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      return false;
    }
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month, day);

    return date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day;
  };

  const modifiedRegistration: UseFormRegisterReturn = {
    ...registration,
    name: id,
    onChange: (e) => {
      let val = e.target.value;

      if (val) {
        val = val.replace(/[^\d/]/g, '');

        if (val.length === 2 && !val.includes('/')) {
          val = val + '/';
        } else if (val.length === 5 && val.charAt(2) === '/' && !val.includes('/', 3)) {
          val = val + '/';
        }
        const slashCount = (val.match(/\//g) || []).length;
        if (slashCount > 2) {
          val = val.substring(0, val.lastIndexOf('/'));
        }

        if (val.length > 10) {
          val = val.substring(0, 10);
        }

        e.target.value = val;
      }
     
      if (val.length === 10 && onInvalidDate) {
        onInvalidDate(isValidDate(val));
      }

      return registration!.onChange(e);
    },
    onBlur: (e) => {
      let val = e.target.value;

      if (onInvalidDate) {
        onInvalidDate(isValidDate(val));
      }
      return registration!.onBlur(e)
    },
    ref: registration!.ref,
  };

  return (
    <div className={className}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        type="text"
        className={`${styles.input} ${(error) ? styles.error : ''}`}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={10}
        {...modifiedRegistration}
      />
      {(error) && (
        <p className={styles.errorText}>{error}</p>
      )}
    </div>
  );
};

export default DateInput;