import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: {
    default: 'Axis Tutors — Find the Perfect Tutor in Pakistan',
    template: '%s | Axis Tutors',
  },
  description: 'Pakistan\'s premier online tutoring marketplace. Find verified tutors for Matric, FSc, O-Level, A-Level, and university subjects. Safe, monitored, and affordable.',
  keywords: ['tutoring', 'Pakistan', 'online tutor', 'Matric', 'FSc', 'O-Level', 'A-Level', 'home tuition'],
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    siteName: 'Axis Tutors',
    title: 'Axis Tutors — Find the Perfect Tutor in Pakistan',
    description: 'Pakistan\'s premier online tutoring marketplace. Verified tutors, parental oversight, and affordable rates.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
