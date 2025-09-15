import Link from 'next/link';

export default function HomePage() {
  const clientHref = "/client?method=GET&url=&body="; 

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Welcome Back!</h1>
      <nav style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Link href={clientHref} style={{ textDecoration: 'underline' }}>
          Go to REST Client
        </Link>
        {/* links (history & variables) */}
      </nav>
    </main>
  );
}
