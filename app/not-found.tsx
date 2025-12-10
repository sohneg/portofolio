import Link from 'next/link'

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#1a1210',
        color: '#f9f7f4'
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>404</h1>
        <p style={{ marginBottom: '2rem', color: '#a09890' }}>Page not found</p>
        <Link
          href="/en"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#f97316',
            color: 'white',
            borderRadius: '9999px',
            textDecoration: 'none'
          }}
        >
          Go Home
        </Link>
      </body>
    </html>
  )
}
