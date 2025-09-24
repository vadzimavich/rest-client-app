import { HttpMethod } from '@/types/request';
import styles from './MethodSelector.module.css';

interface MethodSelectorProps {
  value: HttpMethod;
  onChange: (method: HttpMethod) => void;
  className?: string;
}

export default function MethodSelector({
  value,
  onChange,
  className,
}: MethodSelectorProps) {
  const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  return (
    <div className={`${styles.methodSelectorWrapper} ${className || ''}`}>
      <select
        className={styles.methodSelector}
        value={value}
        onChange={(e) => onChange(e.target.value as HttpMethod)}
      >
        {methods.map((method) => (
          <option key={method} value={method}>
            {method}
          </option>
        ))}
      </select>
    </div>
  );
}
