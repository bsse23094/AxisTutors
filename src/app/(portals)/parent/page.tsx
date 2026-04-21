import ParentDashboardClient from './ParentDashboardClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Parent Dashboard',
}

export default function ParentDashboard() {
  return <ParentDashboardClient />
}
