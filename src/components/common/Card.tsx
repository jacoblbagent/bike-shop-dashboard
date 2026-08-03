import React from 'react';
import styles from './Card.module.scss';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export default function Card({ children, className = '', padding = 'md', hover = false }: CardProps) {
  return (
    <div className={`${styles.card} ${styles[padding]} ${hover ? styles.hover : ''} ${className}`}>
      {children}
    </div>
  );
}