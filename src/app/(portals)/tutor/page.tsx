import TutorDashboardClient from './TutorDashboardClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tutor Dashboard',
}

export default function TutorDashboard() {
  return <TutorDashboardClient />
}
