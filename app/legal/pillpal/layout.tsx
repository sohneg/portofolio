import type { Metadata } from 'next'
import Link from 'next/link'
import { Lexend } from 'next/font/google'
import '../../globals.css'

const lexend = Lexend({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'PillPal — Legal',
  description: 'Terms of Service and Privacy Policy for the PillPal Android app by Sohneg.ch.',
}

export default function PillPalLegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
      </head>
      <body className={lexend.className}>
        <div className="max-w-3xl mx-auto px-6 py-16">
          {/* Top navigation */}
          <nav className="mb-12 text-sm">
            <Link href="/" className="text-secondary hover:text-orange-500 transition-colors">
              ← Portfolio
            </Link>
          </nav>

          <div className="legal-prose">{children}</div>
        </div>
      </body>
    </html>
  )
}
