'use client';

import { useState, useEffect } from 'react';
import PrivateRoute from '@/components/PrivateRoute';
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
  const [variables, setVariables] = useState<Variable[]>([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setVariables(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse variables from Local Storage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(variables));
  }, [variables]);

  const handleAddVariable = () => {
    if (!newKey || !newValue) return;
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
          <button onClick={handleAddVariable} className={styles.addButton}>
            {t('addButton')}
          </button>
        </div>

        <ul className={styles.list}>
          {variables.map((variable) => (
            <li key={variable.id} className={styles.listItem}>
              <span>
                <strong>{variable.key}</strong>: {variable.value}
              </span>
              <button
                onClick={() => handleRemoveVariable(variable.id)}
                className={styles.deleteButton}
              >
                {t('deleteButton')}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </PrivateRoute>
  );
}
