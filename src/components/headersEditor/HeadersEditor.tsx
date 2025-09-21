'use client';
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

  const handleAddHeader = () => {
    onChange([...headers, { id: crypto.randomUUID(), key: '', value: '' }]);
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
            className={styles.removeBtn}
            onClick={() => handleRemoveHeader(header.id)}
          >
            ✕
          </button>
        </div>
      ))}

      <div className={styles.addRow}>
        <button
          type="button"
          className={styles.addBtn}
          onClick={handleAddHeader}
        >
          {t('buttonText')}
        </button>
      </div>
    </div>
  );
}
