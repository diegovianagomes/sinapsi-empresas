'use client';
import type { Metadata } from 'next'
import './globals.css'
import { usePathname } from 'next/navigation'



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <main className="flex-grow">
          {children}
        </main>
        {pathname === '/' && (
          <footer className="py-4 bg-background ">
            <div className="container flex justify-center">
              <a href="/researcher-login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Área Restrita
              </a>
            </div>
          </footer>
        )}
      </body>
    </html>
  )
}
