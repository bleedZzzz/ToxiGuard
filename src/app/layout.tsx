import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { createClient } from '@/lib/supabase/server'
import { Toaster } from '@/components/ui/sonner'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ToxiGuard',
  description: 'Toxic Comment Classifier for Instagram & Facebook',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background`}>

        <div className="min-h-screen font-sans antialiased">
          <Navbar user={user} />
          <main className="container py-6">
            {children}
          </main>
          <Toaster />
        </div>
      </body>
    </html>
  )
}
