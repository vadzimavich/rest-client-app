"use client";
import { HttpMethod } from "@/types/request";

interface MethodSelectorProps {
  value: HttpMethod;
  onChange: (method: HttpMethod) => void;
}

export default function MethodSelector({ value, onChange }: MethodSelectorProps) {
  const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as HttpMethod)}
    >
      {methods.map(method => (
        <option key={method} value={method}>{method}</option>
      ))}
    </select>
  );
}
