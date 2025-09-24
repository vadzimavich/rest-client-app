'use client';
import { useState } from 'react';
import { RequestHeader } from '@/types/request';
import { useTranslations } from 'next-intl';
import styles from './HeadersEditor.module.css';

interface HeadersEditorProps {
  headers: RequestHeader[];
  onChange: (headers: RequestHeader[]) => void;
}

export default function HeadersEditor({
  headers,
  onChange,
}: HeadersEditorProps) {
  const t = useTranslations('HeadersEditor');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAddHeader = () => {
    if (!newKey.trim()) return;
    const newHeader: RequestHeader = {
      id: crypto.randomUUID(),
      key: newKey,
      value: newValue,
    };
    onChange([...headers, newHeader]);
    setNewKey('');
    setNewValue('');
  };

  const handleHeaderChange = (
    id: string,
    field: 'key' | 'value',
    value: string
  ) => {
    const newHeaders = headers.map((h) =>
      h.id === id ? { ...h, [field]: value } : h
    );
    onChange(newHeaders);
  };

  const handleRemoveHeader = (id: string) => {
    onChange(headers.filter((h) => h.id !== id));
  };

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{t('title')}</h4>

      {headers.map((header) => (
        <div key={header.id} className={styles.row}>
          <input
            className={styles.input}
            type="text"
            placeholder={t('key')}
            value={header.key}
            onChange={(e) =>
              handleHeaderChange(header.id, 'key', e.target.value)
            }
          />
          <input
            className={styles.input}
            type="text"
            placeholder={t('value')}
            value={header.value}
            onChange={(e) =>
              handleHeaderChange(header.id, 'value', e.target.value)
            }
          />
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.removeBtn}`}
            onClick={() => handleRemoveHeader(header.id)}
            aria-label="Remove header"
          >
            <span className={styles.icon}></span>
          </button>
        </div>
      ))}

      <div className={styles.row}>
        <input
          className={styles.input}
          type="text"
          placeholder={t('key')}
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
        />
        <input
          className={styles.input}
          type="text"
          placeholder={t('value')}
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
        />
        <button
          type="button"
          className={`${styles.actionBtn} ${styles.addBtn}`}
          onClick={handleAddHeader}
          aria-label="Add header"
        >
          <span className={styles.icon}></span>
        </button>
      </div>
    </div>
  );
}
