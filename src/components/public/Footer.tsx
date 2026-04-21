import Link from 'next/link'
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react'

const footerLinks = {
  'For Students': [
    { label: 'Find a Tutor', href: '/find-tutor' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Subjects', href: '/subjects' },
    { label: 'FAQ', href: '/faq' },
  ],
  'For Tutors': [
    { label: 'Become a Tutor', href: '/become-a-tutor' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'FAQ', href: '/faq' },
  ],
  'Company': [
    { label: 'About Us', href: '/about' },
    { label: 'Safety & Trust', href: '/safety' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
    { label: 'Success Stories', href: '/success-stories' },
  ],
  'Legal': [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Refund Policy', href: '/pricing' },
  ],
}

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--primary-dark)',
      color: 'rgba(236,255,242,0.7)',
      paddingTop: '5rem',
      paddingBottom: '2.5rem',
      marginTop: '4rem',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '4rem',
        }}>
          <div style={{ gridColumn: 'span 1' }}>
            <Link href="/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              textDecoration: 'none',
              marginBottom: '1.25rem',
            }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.5rem',
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <GraduationCap size={20} color="white" />
              </div>
              <span className="brand-script" style={{ fontWeight: 800, fontSize: '1.4rem', color: 'white' }}>
                AxisTutors
              </span>
            </Link>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem', maxWidth: '280px' }}>
              Pakistan&apos;s premier online tutoring platform. Verified tutors, parental oversight, and results that matter.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={14} />
                <span>support@axistutors.pk</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={14} />
                <span>+92 300 1234567</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={14} />
                <span>Lahore, Pakistan</span>
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{
                color: '#d5f6df',
                fontWeight: 600,
                fontSize: '0.875rem',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {title}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="footer-link" style={{
                      color: 'rgba(224, 248, 229, 0.62)',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      transition: 'all 0.15s',
                    }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{
          borderTop: '1px solid rgba(170, 238, 190, 0.2)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.8125rem',
          color: 'rgba(206, 238, 215, 0.56)',
        }}>
          <p>&copy; {new Date().getFullYear()} Axis Tutors. All rights reserved.</p>
          <p>Built for learners across Pakistan</p>
        </div>
      </div>

      <style>{`
        .footer-link:hover {
          color: #b5f28b !important;
          transform: translateX(2px);
        }
      `}</style>
    </footer>
  )
}
