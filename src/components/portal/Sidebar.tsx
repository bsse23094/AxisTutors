'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Calendar, BookOpen, MessageSquare,
  DollarSign, BarChart3, FileText, AlertTriangle, Clock,
  Heart, Settings, GraduationCap, Search, CheckCircle, Menu, X, LogOut, ChevronDown
} from 'lucide-react'
import { useState } from 'react'

const iconMap: Record<string, React.ReactNode> = {
  'dashboard': <LayoutDashboard size={18} />,
  'users': <Users size={18} />,
  'calendar': <Calendar size={18} />,
  'book': <BookOpen size={18} />,
  'chat': <MessageSquare size={18} />,
  'dollar': <DollarSign size={18} />,
  'analytics': <BarChart3 size={18} />,
  'content': <FileText size={18} />,
  'disputes': <AlertTriangle size={18} />,
  'clock': <Clock size={18} />,
  'heart': <Heart size={18} />,
  'settings': <Settings size={18} />,
  'graduation': <GraduationCap size={18} />,
  'search': <Search size={18} />,
  'check': <CheckCircle size={18} />,
}

interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
  children?: { label: string; href: string }[]
}

const navByRole: Record<string, NavItem[]> = {
  admin: [
    { label: 'Dashboard', href: '/admin', icon: 'dashboard' },
    { label: 'Users', href: '/admin/users', icon: 'users', children: [
      { label: 'All Users', href: '/admin/users' },
      { label: 'Tutor Approvals', href: '/admin/users/tutors' },
    ]},
    { label: 'Sessions', href: '/admin/sessions', icon: 'calendar' },
    { label: 'Financials', href: '/admin/financials', icon: 'dollar' },
    { label: 'Analytics', href: '/admin/analytics', icon: 'analytics' },
    { label: 'Content', href: '/admin/content', icon: 'content' },
    { label: 'Disputes', href: '/admin/disputes', icon: 'disputes' },
  ],
  tutor: [
    { label: 'Dashboard', href: '/tutor', icon: 'dashboard' },
    { label: 'Calendar', href: '/tutor/calendar', icon: 'calendar' },
    { label: 'Availability', href: '/tutor/availability', icon: 'clock' },
    { label: 'My Students', href: '/tutor/students', icon: 'graduation' },
    { label: 'Messages', href: '/tutor/chat', icon: 'chat' },
    { label: 'Earnings', href: '/tutor/earnings', icon: 'dollar' },
    { label: 'My Profile', href: '/tutor/profile', icon: 'users' },
    { label: 'Settings', href: '/tutor/settings', icon: 'settings' },
  ],
  student: [
    { label: 'Dashboard', href: '/student', icon: 'dashboard' },
    { label: 'Find a Tutor', href: '/student/find-tutor', icon: 'search' },
    { label: 'My Calendar', href: '/student/calendar', icon: 'calendar' },
    { label: 'Messages', href: '/student/chat', icon: 'chat' },
    { label: 'My Sessions', href: '/student/sessions', icon: 'book' },
    { label: 'Saved Tutors', href: '/student/saved-tutors', icon: 'heart' },
    { label: 'Settings', href: '/student/settings', icon: 'settings' },
  ],
  parent: [
    { label: 'Dashboard', href: '/parent', icon: 'dashboard' },
    { label: 'Calendar', href: '/parent/calendar', icon: 'calendar' },
    { label: 'Messages', href: '/parent/chat', icon: 'chat' },
    { label: 'Payments', href: '/parent/payments', icon: 'dollar' },
    { label: 'Progress Reports', href: '/parent/reports', icon: 'analytics' },
    { label: 'Settings', href: '/parent/settings', icon: 'settings' },
  ],
}

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  tutor: 'Tutor',
  student: 'Student',
  parent: 'Parent',
}

const roleColors: Record<string, string> = {
  admin: '#2f8cc2',
  tutor: '#1f8f62',
  student: '#6ebf43',
  parent: '#4e9b64',
}

interface SidebarProps {
  role: string
  userName?: string
}

export default function Sidebar({ role, userName = 'User' }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const items = navByRole[role] || []

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    )
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div style={{
        padding: '0 1.25rem 1.25rem',
        borderBottom: '1px solid var(--border)',
        marginBottom: '0.5rem',
      }}>
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          textDecoration: 'none', fontWeight: 800, fontSize: '1.125rem', color: 'var(--text-primary)',
        }}>
          <div style={{
            width: '2rem', height: '2rem', borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, var(--primary), var(--accent-dark))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <GraduationCap size={16} color="white" />
          </div>
          Axis <span className="brand-script" style={{ color: 'var(--primary)' }}>Tutors</span>
        </Link>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.875rem',
          padding: '0.5rem 0.625rem', borderRadius: 'var(--radius-sm)',
          background: 'color-mix(in oklab, var(--surface-hover) 84%, var(--primary-50) 16%)',
        }}>
          <div className="avatar avatar-sm" style={{
            background: roleColors[role],
            color: 'white',
            fontSize: '0.625rem',
          }}>
            {userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</div>
            <div style={{ fontSize: '0.6875rem', color: roleColors[role], fontWeight: 600 }}>{roleLabels[role]}</div>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ padding: '0.375rem 0' }}>
        {items.map((item) => {
          const isActive = pathname === item.href || (item.children && item.children.some(c => pathname === c.href))
          const isExpanded = expandedItems.includes(item.label)

          return (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleExpand(item.label)}
                    className={`sidebar-item ${isActive ? 'active' : ''}`}
                    style={{ width: '100%', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit', textAlign: 'left' }}
                  >
                    {iconMap[item.icon]}
                    <span style={{ flex: 1 }}>{item.label}</span>
                    <ChevronDown size={14} style={{
                      transition: 'transform 0.2s',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                    }} />
                  </button>
                  {isExpanded && (
                    <div style={{ paddingLeft: '2.75rem' }}>
                      {item.children.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`sidebar-item ${pathname === child.href ? 'active' : ''}`}
                          style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem', borderLeft: 'none' }}
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {iconMap[item.icon]}
                  {item.label}
                  {item.badge && item.badge > 0 && (
                    <span style={{
                      marginLeft: 'auto',
                      background: 'var(--error)',
                      color: 'white',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '0.125rem 0.375rem',
                      borderRadius: 'var(--radius-full)',
                      minWidth: '1.25rem',
                      textAlign: 'center',
                    }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}
            </div>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '1rem 0.75rem',
        borderTop: '1px solid var(--border)',
      }}>
        <button
          className="sidebar-item"
          style={{
            width: '100%', cursor: 'pointer', background: 'none',
            border: 'none', fontFamily: 'inherit', textAlign: 'left',
            color: 'var(--text-muted)',
          }}
          onClick={async () => {
            const { createClient } = await import('@/lib/supabase/client')
            const supabase = createClient()
            await supabase.auth.signOut()
            window.location.href = '/'
          }}
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          display: 'none',
          position: 'fixed',
          top: '0.75rem',
          left: '0.75rem',
          zIndex: 50,
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: 'var(--radius)',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow)',
          color: 'var(--text-primary)',
        }}
        className="sidebar-toggle"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            zIndex: 39, display: 'none',
          }}
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        {sidebarContent}
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-toggle { display: flex !important; }
          .sidebar-overlay { display: block !important; }
        }
      `}</style>
    </>
  )
}
