'use client';

import { useState, useEffect } from 'react';
import PrivateRoute from '@/components/privateRoute/PrivateRoute';
import styles from './VariablesPage.module.css';
import { useTranslations } from 'next-intl';

interface Variable {
  id: string;
  key: string;
  value: string;
}

const STORAGE_KEY = 'rest-client-variables';

export default function VariablesPage() {
  const t = useTranslations('VariablesPage');

  const [variables, setVariables] = useState<Variable[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to parse variables from Local Storage:', error);
      return [];
    }
  });

  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(variables));
  }, [variables]);

  const handleAddVariable = () => {
    if (!newKey.trim() || !newValue.trim()) return;
    setVariables([
      ...variables,
      { id: crypto.randomUUID(), key: newKey, value: newValue },
    ]);
    setNewKey('');
    setNewValue('');
  };

  const handleRemoveVariable = (id: string) => {
    setVariables(variables.filter((v) => v.id !== id));
  };

  return (
    <PrivateRoute>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('title')}</h1>

        <div className={styles.list}>
          {variables.map((variable) => (
            <div key={variable.id} className={styles.row}>
              <input
                type="text"
                value={variable.key}
                className={`${styles.input} ${styles.existingInput}`}
                readOnly
              />
              <input
                type="text"
                value={variable.value}
                className={`${styles.input} ${styles.existingInput}`}
                readOnly
              />
              <button
                onClick={() => handleRemoveVariable(variable.id)}
                className={`${styles.actionBtn} ${styles.removeBtn}`}
                aria-label={t('deleteButton')}
              >
                <span className={styles.icon}></span>
              </button>
            </div>
          ))}
        </div>

        <div className={styles.form}>
          <input
            type="text"
            placeholder={t('keyPlaceholder')}
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder={t('valuePlaceholder')}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className={styles.input}
          />
          <button
            onClick={handleAddVariable}
            className={`${styles.actionBtn} ${styles.addBtn}`}
            aria-label={t('addButton')}
          >
            <span className={styles.icon}></span>
          </button>
        </div>
      </div>
    </PrivateRoute>
  );
}
