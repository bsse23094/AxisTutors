import Sidebar from '@/components/portal/Sidebar'

export default function TutorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="portal-root">
      <Sidebar role="tutor" userName="Tutor" />
      <div className="portal-content portal-main">
        {children}
      </div>
    </div>
  )
}
