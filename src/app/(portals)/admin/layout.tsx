import Sidebar from '@/components/portal/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="portal-root">
      <Sidebar role="admin" userName="Admin" />
      <div className="portal-content portal-main">
        {children}
      </div>
    </div>
  )
}
