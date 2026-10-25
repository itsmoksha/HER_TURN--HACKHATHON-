import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4A1C40' },
    { media: '(prefers-color-scheme: dark)', color: '#1a0a17' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: {
    default: 'HER TURN — Your Health, Your Way',
    template: '%s | HER TURN',
  },
  description:
    'AI-powered healthcare companion designed for women. Understand your records, manage medicines, and take control of your health journey.',
  keywords: ['women health', 'healthcare companion', 'medical records', 'AI health assistant'],
  authors: [{ name: 'HER TURN' }],
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    title: 'HER TURN — Everyone else had their turn. This one is yours.',
    description: 'AI-powered healthcare companion designed for women.',
    siteName: 'HER TURN',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
