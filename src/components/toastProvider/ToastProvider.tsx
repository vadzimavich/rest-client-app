'use client';

import { Toaster } from 'react-hot-toast';
import styles from './ToastProvider.module.css';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        className: styles.toast,
      }}
    />
  );
}
