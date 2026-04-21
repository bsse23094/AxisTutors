import Sidebar from '@/components/portal/Sidebar'

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="portal-root">
      <Sidebar role="student" userName="Student" />
      <div className="portal-content portal-main">
        {children}
      </div>
    </div>
  )
}
