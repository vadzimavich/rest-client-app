'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';
import styles from './error.module.css';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        console.error(error);
        toast.error(error.message, {
            duration: 4000,
        });
    }, [error]);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h2 className={styles.title}>Something went wrong</h2>
                <button className={styles.button} onClick={reset}>
                    Try Again
                </button>
            </div>
        </div>
    );
}
