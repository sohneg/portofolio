import type { Metadata } from 'next'
import { Lexend } from 'next/font/google'
import '../../globals.css'

const lexend = Lexend({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Lab — Text Reveals',
  description: 'Prototype playground for project description reveal animations.',
  robots: { index: false, follow: false },
}

export default function RevealsLabLayout({
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
      <body className={lexend.className}>{children}</body>
    </html>
  )
}
