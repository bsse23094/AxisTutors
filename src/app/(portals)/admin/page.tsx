import StatCard from '@/components/portal/StatCard'
import { Users, GraduationCap, Calendar, DollarSign, Clock, AlertTriangle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
}

export default function AdminDashboard() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Overview of Axis Tutors platform</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <StatCard label="Active Tutors" value="142" icon={<GraduationCap size={20} />} color="#4E9B64" change="+8 this month" changeType="positive" />
        <StatCard label="Active Students" value="1,284" icon={<Users size={20} />} color="#1F8F62" change="+56 this month" changeType="positive" />
        <StatCard label="Sessions Today" value="38" icon={<Calendar size={20} />} color="#3B82F6" />
        <StatCard label="Revenue (Month)" value="PKR 847K" icon={<DollarSign size={20} />} color="#22C55E" change="+12% vs last month" changeType="positive" />
        <StatCard label="Pending Approvals" value="7" icon={<Clock size={20} />} color="#F59E0B" />
        <StatCard label="Open Disputes" value="2" icon={<AlertTriangle size={20} />} color="#EF4444" />
      </div>

      {/* Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Sessions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { student: 'Ali Hassan', tutor: 'Ahmed Khan', subject: 'Physics', status: 'completed' },
              { student: 'Sara Malik', tutor: 'Fatima Noor', subject: 'Chemistry', status: 'confirmed' },
              { student: 'Usman Ali', tutor: 'Hassan Ali', subject: 'CS', status: 'pending_payment' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{s.student} → {s.tutor}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.subject}</div>
                </div>
                <span className={`badge ${s.status === 'completed' ? 'badge-success' : s.status === 'confirmed' ? 'badge-info' : 'badge-warning'}`}>
                  {s.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Pending Tutor Applications</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { name: 'Zainab Tariq', subjects: 'Maths, Stats', date: '2 hours ago' },
              { name: 'Bilal Ahmed', subjects: 'English, Urdu', date: '5 hours ago' },
              { name: 'Hira Shah', subjects: 'Biology', date: '1 day ago' },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{t.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.subjects}</div>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
