import Sidebar from '@/components/portal/Sidebar'

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="portal-root">
      <Sidebar role="parent" userName="Parent" />
      <div className="portal-content portal-main">
        {children}
      </div>
    </div>
  )
}
