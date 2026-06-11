import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Analytics } from '@vercel/analytics/react'
import { PWAInstallBanner } from '@/components/PWAInstallBanner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DuitPintar — Teman Ngobrol Soal Keuangan',
  description: 'Asisten keuangan personal untuk anak muda Indonesia.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'DuitPintar',
  },
  icons: {
    apple: '/icons/icon-192.png',
  },
  themeColor: '#059669',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full antialiased`}>
        <ThemeProvider>
          {children}
          <Analytics />
          <PWAInstallBanner />
        </ThemeProvider>
      </body>
    </html>
  )
}