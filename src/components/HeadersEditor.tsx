"use client";
import { RequestHeader } from "@/types/request";

interface HeadersEditorProps {
  headers: RequestHeader[];
  onChange: (headers: RequestHeader[]) => void;
}

export default function HeadersEditor({ headers, onChange }: HeadersEditorProps) {
  const handleAddHeader = () => {
    onChange([...headers, { id: crypto.randomUUID(), key: '', value: '' }]);
  };

  const handleHeaderChange = (id: string, field: 'key' | 'value', value: string) => {
    const newHeaders = headers.map(h =>
      h.id === id ? { ...h, [field]: value } : h
    );
    onChange(newHeaders);
  };

  const handleRemoveHeader = (id: string) => {
    onChange(headers.filter(h => h.id !== id));
  };

  return (
    <div>
      <h4>Headers</h4>
      {headers.map(header => (
        <div key={header.id} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="text"
            placeholder="Key"
            value={header.key}
            onChange={(e) => handleHeaderChange(header.id, 'key', e.target.value)}
          />
          <input
            type="text"
            placeholder="Value"
            value={header.value}
            onChange={(e) => handleHeaderChange(header.id, 'value', e.target.value)}
          />
          <button onClick={() => handleRemoveHeader(header.id)}>Remove</button>
        </div>
      ))}
      <button onClick={handleAddHeader}>Add Header</button>
    </div>
  );
}
