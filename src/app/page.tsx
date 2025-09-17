"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import styles from "./page.module.css";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      {!user ? (
        <>
          <h1 className={styles.title}>Welcome!</h1>
          <p className={styles.text}>
            Please{" "}
            <Link href="/signin" className={styles.link}>
              Sign In
            </Link>{" "}
            or{" "}
            <Link href="/signup" className={styles.link}>
              Sign Up
            </Link>{" "}
            to continue.
          </p>
        </>
      ) : (
        <>
          <h1 className={styles.title}>
            Welcome back, {user.email?.split("@")[0]}!
          </h1>
          <nav className={styles.nav}>
            <Link href="/client" className={styles.button}>
              REST Client
            </Link>
            <Link href="/history" className={styles.button}>
              History
            </Link>
          </nav>
        </>
      )}
    </div>
  );
}
