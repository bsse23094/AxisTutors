import type { Metadata } from 'next'
import StatCard from '@/components/portal/StatCard'
import { DollarSign, TrendingUp, Calendar, Clock } from 'lucide-react'

export const metadata: Metadata = { title: 'Earnings' }

export default function EarningsPage() {
  return (
    <div>
      <div style={{ marginBottom: '3rem', marginTop: '1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-dark)', letterSpacing: '-0.02em' }}>Axis Tutors Earnings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500, marginTop: '0.25rem' }}>Track your income and session history</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="This Month" value="PKR 45,600" icon={<DollarSign size={20} />} color="var(--primary-dark)" change="+15%" changeType="positive" />
        <StatCard label="Total Earned" value="PKR 385K" icon={<TrendingUp size={20} />} color="var(--primary)" />
        <StatCard label="This Week Sessions" value="8" icon={<Calendar size={20} />} color="var(--secondary)" />
        <StatCard label="Pending Payout" value="PKR 5,200" icon={<Clock size={20} />} color="var(--accent)" />
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Earnings</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { student: 'Ali Hassan', subject: 'Physics', date: 'Apr 20', amount: 2000, fee: 300, payout: 1700 },
            { student: 'Sara Malik', subject: 'Chemistry', date: 'Apr 19', amount: 1800, fee: 270, payout: 1530 },
            { student: 'Usman Ali', subject: 'Maths', date: 'Apr 18', amount: 2000, fee: 300, payout: 1700 },
            { student: 'Hamza Tariq', subject: 'Physics', date: 'Apr 17', amount: 2000, fee: 300, payout: 1700 },
          ].map((e, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-hover)',
            }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{e.student}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{e.subject} · {e.date}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--success)' }}>+PKR {e.payout.toLocaleString()}</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Fee: PKR {e.fee}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
