import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold mb-6">404</h1>
      <p className="text-lg text-secondary mb-8">Page not found</p>
      <Link
        href="/"
        className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
      >
        Go Home
      </Link>
    </main>
  )
}
