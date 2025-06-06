import './globals.css'
import { Inter } from 'next/font/google'
import { SessionProvider } from '@/components/SessionProvider'
import { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Skoob Food Ordering',
  description: 'Role-based food ordering application',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
