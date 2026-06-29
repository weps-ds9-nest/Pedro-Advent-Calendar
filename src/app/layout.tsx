import type { Metadata } from 'next'
import { Inter, Geist } from 'next/font/google'
import './globals.css'
import { cn } from "@/lib/utils";
import { headers } from 'next/headers'
import { getProgress } from '@/lib/kv'
import AdminToolbar from '@/components/AdminToolbar'

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Claude Code Advent Calendar',
  description: 'An internal, sequential learning calendar built with Claude Code.',
  robots: { index: false, follow: false },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headerStore = await headers()
  const actualRole = headerStore.get('x-actual-role')
  const viewMode = headerStore.get('x-view-mode') ?? 'admin'

  const showToolbar = actualRole === 'admin'
  const completedSimulated = showToolbar ? await getProgress('simulated') : []

  return (
    <html lang="en" className={cn("dark h-full", inter.variable, "font-sans", geist.variable)}>
      <body className={cn(
        "min-h-full bg-[#0a0d1a] text-slate-100 antialiased font-sans",
        showToolbar && "pt-10"
      )}>
        {showToolbar && (
          <AdminToolbar
            currentViewMode={viewMode}
            initialCompletedCount={completedSimulated.length}
          />
        )}
        {children}
      </body>
    </html>
  )
}
