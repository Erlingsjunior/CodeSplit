import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CodeSplit - Visual Code Editor',
  description: 'Logic, code flow and abstraction like you\'ve never seen before',
  keywords: ['code-editor', 'visual-coding', 'react', 'nextjs', 'typescript'],
  authors: [{ name: 'Erling Sriubas Junior', url: 'https://github.com/Erlingsjunior' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}