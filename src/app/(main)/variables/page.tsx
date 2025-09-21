'use client';

import { useState, useEffect } from 'react';
import PrivateRoute from '@/components/PrivateRoute';
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

  // initial ls load
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setVariables(JSON.parse(stored));
    }
  }, []);

  // ls save
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
      <h1>{t('title')}</h1>
      <div>
        <input
          type="text"
          placeholder={t('keyPlaceholder')}
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
        />
        <input
          type="text"
          placeholder={t('valuePlaceholder')}
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
        />
        <button onClick={handleAddVariable}>{t('addButton')}</button>
      </div>

      <ul style={{ listStyle: 'none', marginTop: '2rem' }}>
        {variables.map((variable) => (
          <li key={variable.id}>
            <strong>{variable.key}</strong>: {variable.value}
            <button
              onClick={() => handleRemoveVariable(variable.id)}
              style={{ marginLeft: '1rem' }}
            >
              {t('deleteButton')}
            </button>
          </li>
        ))}
      </ul>
    </PrivateRoute>
  );
}
