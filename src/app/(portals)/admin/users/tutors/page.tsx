import type { Metadata } from 'next'
import { Clock, CheckCircle2, XCircle, FileText, Mail } from 'lucide-react'

export const metadata: Metadata = { title: 'Tutor Approvals' }

const pendingTutors = [
  { id: '1', name: 'Zainab Tariq', email: 'zainab@email.com', subjects: 'Mathematics, Statistics', experience: 5, rate: 1800, docs: 3, applied: '2 hours ago', education: 'MSc Mathematics, PU Lahore' },
  { id: '2', name: 'Bilal Ahmed', email: 'bilal@email.com', subjects: 'English, Urdu', experience: 3, rate: 1500, docs: 2, applied: '5 hours ago', education: 'MA English Literature, GCU' },
  { id: '3', name: 'Hira Shah', email: 'hira@email.com', subjects: 'Biology', experience: 7, rate: 2000, docs: 4, applied: '1 day ago', education: 'MBBS, KEMU' },
  { id: '4', name: 'Kamran Javed', email: 'kamran@email.com', subjects: 'Computer Science', experience: 4, rate: 2200, docs: 2, applied: '1 day ago', education: 'BS Computer Science, FAST' },
  { id: '5', name: 'Nadia Pervez', email: 'nadia@email.com', subjects: 'Chemistry, O-Level Chemistry', experience: 8, rate: 1900, docs: 3, applied: '2 days ago', education: 'MSc Chemistry, QAU' },
]

export default function TutorApprovalsPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Tutor Approvals</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{pendingTutors.length} applications pending review</p>
        </div>
        <span className="badge badge-warning" style={{ fontSize: '0.875rem', padding: '0.375rem 0.875rem' }}>
          <Clock size={14} /> {pendingTutors.length} Pending
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {pendingTutors.map(tutor => (
          <div key={tutor.id} className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                <div className="avatar avatar-lg" style={{ background: 'linear-gradient(135deg, var(--accent), var(--primary))', color: 'white' }}>
                  {tutor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{tutor.name}</h3>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
                    <Mail size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.25rem' }} />
                    {tutor.email}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>📚 {tutor.subjects}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>🎓 {tutor.education}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>{tutor.experience} yrs exp</span>
                    <span>PKR {tutor.rate.toLocaleString()}/hr</span>
                    <span><FileText size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {tutor.docs} docs</span>
                    <span>Applied {tutor.applied}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button className="btn btn-sm" style={{ background: '#DCFCE7', color: '#166534', border: '1px solid #86EFAC' }}>
                  <CheckCircle2 size={14} /> Approve
                </button>
                <button className="btn btn-sm" style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' }}>
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
