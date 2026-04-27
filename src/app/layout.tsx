import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { createClient } from '@/lib/supabase/server'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'ToxiGuard — AI Toxicity Protection',
    template: '%s | ToxiGuard',
  },
  description: 'Automated toxicity detection and protection for your Instagram and Facebook pages using advanced AI.',
  keywords: ['toxicity detection', 'content moderation', 'AI', 'social media', 'facebook', 'instagram', 'hate speech'],
  authors: [{ name: 'ToxiGuard' }],
  openGraph: {
    title: 'ToxiGuard — AI Toxicity Protection',
    description: 'Automated toxicity detection for social media using AI.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-background antialiased`}>
        <div className="relative min-h-screen flex flex-col">
          <Navbar user={user} />
          <main className="flex-1 container py-6">
            {children}
          </main>
          <Toaster richColors closeButton position="bottom-right" />
        </div>
      </body>
    </html>
  )
}
