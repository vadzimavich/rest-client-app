"use client";

import styles from "./Footer.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.year}>{year}</div>
            <div className={styles.links}>
                <span>Created by </span>
                <Link
                    href="https://github.com/vadzimavich"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                >
                    Andrei Kaspiarovich
                </Link>
                <span> & </span>
                <Link
                    href="https://github.com/tffl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                >
                    Natalya Merkulova
                </Link>
            </div>

            <Link
                href="https://rs.school/courses/reactjs"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.logo}
            >
                <Image
                    src="/rss-logo.svg"
                    alt="RS School"
                    width={40}
                    height={40}
                />
            </Link>
        </footer>
    );
}
