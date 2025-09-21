"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useAuth } from "@/hooks/useAuth";
import styles from "./Header.module.css";
import { useState, useEffect } from "react";

export default function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [lang, setLang] = useState<"en" | "ru">("en");
  const [scrolled, setScrolled] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 5); 
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <Link href="/" className={styles.link}>
        REST Client App
      </Link>

      <nav className={styles.nav}>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as "en" | "ru")}
          className={styles.langToggle}
        >
          <option value="en">EN</option>
          <option value="ru">RU</option>
        </select>

        {loading ? (
          <div>Loading...</div>
        ) : user ? (
          <>
            <span>Welcome, {user.email}</span>
            <button onClick={handleSignOut} className={styles.button}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/signin" className={styles.link}>
              Sign In
            </Link>
            <Link href="/signup" className={styles.link}>
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
