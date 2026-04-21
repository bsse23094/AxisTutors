'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react'

const navLinks = [
  { label: 'Find a Tutor', href: '/find-tutor' },
  { 
    label: 'Platform',
    children: [
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'Subjects Directory', href: '/subjects' },
      { label: 'Pricing & Plans', href: '/pricing' },
      { label: 'Safety & Verification', href: '/safety' },
    ]
  },
  { label: 'Become a Tutor', href: '/become-a-tutor' },
  { 
    label: 'Resources',
    children: [
      { label: 'Success Stories', href: '/success-stories' },
      { label: 'Learning Blog', href: '/blog' },
      { label: 'Help Center & FAQ', href: '/faq' },
      { label: 'Contact Support', href: '/contact' },
    ]
  },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: scrolled ? 'rgba(247, 245, 240, 0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>
      <nav className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '5rem',
      }}>
        {/* LOGO */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          textDecoration: 'none',
          color: 'var(--text-primary)',
        }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.5rem',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow)',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <span className="brand-script" style={{ fontSize: '1.35rem' }}>AxisTutors</span>
        </Link>

        {/* DESKTOP NAV */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="desktop-nav">
          {navLinks.map((item) => (
            item.children ? (
              <div key={item.label} style={{ position:'relative' }}
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.5rem 1rem',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: openDropdown === item.label ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  background: openDropdown === item.label ? 'var(--surface)' : 'transparent',
                  border: 'none',
                  fontFamily: 'inherit',
                  borderRadius: 'var(--radius-full)',
                  transition: 'all 0.2s ease',
                }}>
                  {item.label}
                  <ChevronDown size={14} style={{
                    transition: 'transform 0.2s',
                    transform: openDropdown === item.label ? 'rotate(180deg)' : 'rotate(0)',
                  }} />
                </button>
                {openDropdown === item.label && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    paddingTop: '0.5rem', /* Bridges the hover gap perfectly */
                    zIndex: 50,
                  }}>
                    <div style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-xl)',
                      padding: '0.75rem',
                      minWidth: '15rem',
                      animation: 'slideDown 0.2s ease',
                    }}>
                      {item.children.map((child) => (
                        <Link key={child.href} href={child.href} style={{
                          display: 'block',
                          padding: '0.6rem 1rem',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                          borderRadius: 'var(--radius-sm)',
                          transition: 'all 0.15s',
                        }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = 'var(--background)'
                            e.currentTarget.style.color = 'var(--primary)'
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'transparent'
                            e.currentTarget.style.color = 'var(--text-secondary)'
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.href} href={item.href!} style={{
                padding: '0.5rem 1rem',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                borderRadius: 'var(--radius-full)',
                transition: 'all 0.2s ease',
              }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = 'var(--primary)'
                  e.currentTarget.style.background = 'var(--surface)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {item.label}
              </Link>
            )
          ))}
        </div>

        {/* ACTIONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="desktop-nav">
          <Link href="/login" style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.color = 'var(--primary)' }}
          onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
          >
            Log In
          </Link>
          <Link href="/register" className="btn btn-primary" style={{
            borderRadius: '99px',
            padding: '0.65rem 1.5rem',
            fontSize: '0.95rem'
          }}>
            Get Started
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '0.6rem',
            cursor: 'pointer',
            color: 'var(--text-primary)',
          }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* MOBILE DROPDOWN */}
      {mobileOpen && (
        <div className="mobile-menu" style={{
          position: 'absolute',
          top: '5rem',
          left: 0,
          right: 0,
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '1.5rem 1rem',
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideDown 0.3s ease',
          maxHeight: 'calc(100vh - 5rem)',
          overflowY: 'auto'
        }}>
          {navLinks.map((item) => (
            item.children ? (
              <div key={item.label} style={{ marginBottom: '1rem' }}>
                <div style={{
                  padding: '0.75rem 0.5rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {item.label}
                </div>
                {item.children.map((child) => (
                  <Link key={child.href} href={child.href} style={{
                    display: 'block',
                    padding: '0.6rem 0.5rem',
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                  }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link key={item.href} href={item.href!} style={{
                display: 'block',
                padding: '0.75rem 0.5rem',
                fontSize: '1.05rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                textDecoration: 'none',
                marginBottom: '0.5rem'
              }}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            )
          ))}
          <div style={{ 
            borderTop: '1px solid var(--border)', 
            marginTop: '1.5rem', 
            paddingTop: '1.5rem', 
            display:'flex', 
            flexDirection: 'column',
            gap:'1rem' 
          }}>
            <Link href="/login" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }}
              onClick={() => setMobileOpen(false)}>
              Log In
            </Link>
            <Link href="/register" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }}
              onClick={() => setMobileOpen(false)}>
              Get Started
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (min-width: 901px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </header>
  )
}
