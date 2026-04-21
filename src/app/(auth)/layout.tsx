import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', minHeight: '100vh', background: 'var(--background)' }}>
      {/* LEFT SPLIT - Brand Splash Element */}
      <div style={{
        position: 'relative',
        background: 'var(--primary-dark)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3rem',
        overflow: 'hidden',
      }} className="hide-on-mobile">
        {/* Subtle Decorative Gradient Blobs */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'var(--primary)',
          opacity: 0.15,
          filter: 'blur(100px)',
          borderRadius: '50%',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-10%',
          width: '600px',
          height: '600px',
          background: 'var(--accent)',
          opacity: 0.08,
          filter: 'blur(120px)',
          borderRadius: '50%',
          zIndex: 0
        }} />

        {/* Top Header Identity */}
        <div style={{ zIndex: 10 }}>
          <Link href="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            textDecoration: 'none',
            color: 'white',
          }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '0.5rem',
              background: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <span className="brand-script" style={{ fontSize: '1.4rem', fontWeight: 800 }}>AxisTutors</span>
          </Link>
        </div>

        {/* Center Main Quote */}
        <div style={{ zIndex: 10, maxWidth: '500px', marginTop: 'auto', marginBottom: 'auto' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: 'white', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            Elevate learning. <br/>
            Guaranteed outcomes.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: 1.6, fontWeight: 400 }}>
            Axis Tutors is Pakistan's premier ecosystem for verified elite educators, equipping families with rigorous transparency and exceptional academic progress.
          </p>
        </div>

        {/* Bottom Status Marker */}
        <div style={{ zIndex: 10 }}>
          <div style={{ display: 'inline-flex', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }} />
            <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>System Operational</span>
          </div>
        </div>
      </div>

      {/* RIGHT SPLIT - Form Area */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative'
      }}>
        {/* Render child form pages centered */}
        {children}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hide-on-mobile {
            display: none !important;
          }
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
