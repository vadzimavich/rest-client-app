'use client';

import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>404 | Page Not Found</h2>
            <Link href="/" className={styles.link}>
                Back home
            </Link>
        </div>
    );
}
