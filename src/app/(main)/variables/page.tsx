'use client';

import { useState, useEffect } from 'react';
import PrivateRoute from '@/components/PrivateRoute';
import styles from './VariablesPage.module.css';

interface Variable {
  id: string;
  key: string;
  value: string;
}

const STORAGE_KEY = 'rest-client-variables';

export default function VariablesPage() {
  const [variables, setVariables] = useState<Variable[]>([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setVariables(JSON.parse(stored));
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
        <h1 className={styles.title}>Variables</h1>

        <div className={styles.form}>
          <input
            type="text"
            placeholder="Key"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className={styles.input}
          />
          <button onClick={handleAddVariable} className={styles.addButton}>
            Add Variable
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
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </PrivateRoute>
  );
}
