"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext"; // custom hook

export default function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/"); // redirect to main
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link href="/">Logo</Link>
      <nav>
        {loading ? (
          <div>Loading...</div>
        ) : user ? (
          // if logged in
          <>
            <span>Welcome, {user.email}</span>
            <button onClick={handleSignOut} style={{ marginLeft: '1rem' }}>Sign Out</button>
          </>
        ) : (
          // if logged out
          <>
            <Link href="/signin" style={{ marginRight: '1rem' }}>Sign In</Link>
            <Link href="/signup">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
}