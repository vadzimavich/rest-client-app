'use client';

import { useState, ReactNode } from 'react';
import styles from './Tabs.module.css';

interface TabsProps {
  labels: string[];
  children: ReactNode[];
}

export default function Tabs({ labels, children }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabButtons}>
        {labels.map((label, idx) => (
          <button
            key={idx}
            className={`${styles.tabButton} ${activeIndex === idx ? styles.active : ''}`}
            onClick={() => setActiveIndex(idx)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {children[activeIndex]}
      </div>
    </div>
  );
}
