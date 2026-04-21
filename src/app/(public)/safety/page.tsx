import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Eye, Lock, FileCheck, AlertTriangle, Users, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = { title: 'Safety & Trust' }

export default function SafetyPage() {
  return (
    <div className="container section">
      <div style={{ textAlign: 'center', marginBottom: '3.5rem', marginTop: '2rem' }}>
        <div style={{ display: 'inline-flex', padding: '0.5rem', borderRadius: 'var(--radius-full)', background: 'var(--primary-50)', marginBottom: '1rem' }}>
          <Shield size={28} color="var(--primary)" />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--primary-dark)', letterSpacing: '-0.02em' }}>Axis Tutors Trust & Safety</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', fontWeight: 500, maxWidth: '560px', margin: '0 auto' }}>
          Your child's safety is our absolute priority. Here's how we protect every family on the platform.
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {[
          { icon: <FileCheck size={24} />, title: 'Tutor Verification Process', color: 'var(--primary)', points: ['Every tutor must submit valid CNIC and educational certificates', 'Our team manually reviews each application within 24-48 hours', 'Tutors cannot interact with students until approved', 'Ongoing monitoring of tutor interactions and ratings'] },
          { icon: <Eye size={24} />, title: 'Parent Monitoring Features', color: 'var(--primary-dark)', points: ['Full read-only access to all student-tutor chat conversations', 'Calendar view of all upcoming and past sessions', 'Approve or decline every session booking', 'Complete control over all payments — students cannot pay', 'Flag suspicious messages for admin review'] },
          { icon: <Lock size={24} />, title: 'Data Privacy for Children', color: 'var(--secondary)', points: ['GDPR-aligned data handling practices', 'No personal data is shared with third parties', 'Encryption for all sensitive information at rest and in transit', 'Minimal data collection — only what\'s needed for the service', 'Right to deletion — contact us to remove all data'] },
          { icon: <AlertTriangle size={24} />, title: 'Reporting Concerns', color: 'var(--accent)', points: ['Parents can flag any chat message for admin review', 'Contact us immediately for urgent safety concerns', 'All reports are investigated within 24 hours', 'Accounts can be suspended pending investigation'] },
          { icon: <Users size={24} />, title: 'Community Standards', color: 'var(--primary-light)', points: ['Zero tolerance for inappropriate behavior', 'Professional conduct expected from all tutors', 'Chat rooms only created after session booking — no unsolicited contact', 'Regular reviews and audits of platform interactions'] },
        ].map(section => (
          <div key={section.title} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: 'var(--radius)', background: `${section.color}14`, color: section.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {section.icon}
              </div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{section.title}</h2>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {section.points.map(point => (
                <li key={point} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem', background: 'var(--primary-50)', borderRadius: 'var(--radius-lg)' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Have a concern?</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9375rem' }}>We take every report seriously. Don&apos;t hesitate to reach out.</p>
        <Link href="/contact" className="btn btn-primary">Contact Us</Link>
      </div>
    </div>
  )
}
