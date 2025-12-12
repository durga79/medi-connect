import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MediConnect - Healthcare Patient Portal',
  description: 'Secure healthcare patient portal for managing medical records and appointments',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}


