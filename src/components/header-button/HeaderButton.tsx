import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HeaderButton.module.css';

interface HeaderButtonProps {
  to: string;
  children: React.ReactNode;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({ to, children }) => {
  return (
    <li className={styles.listItem}>
      <Link to={to} className={styles.link}>
        {children}
      </Link>
    </li>
  );
};

export default HeaderButton;