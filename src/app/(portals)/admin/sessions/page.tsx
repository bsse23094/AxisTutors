import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Sessions' }

const sessions = [
  { id: '1', student: 'Ali Hassan', tutor: 'Ahmed Khan', subject: 'Physics', date: 'Apr 20, 2026', time: '4:00 PM', status: 'completed', amount: 2000 },
  { id: '2', student: 'Sara Malik', tutor: 'Fatima Noor', subject: 'Chemistry', date: 'Apr 21, 2026', time: '3:00 PM', status: 'confirmed', amount: 1800 },
  { id: '3', student: 'Usman Ali', tutor: 'Hassan Ali', subject: 'CS', date: 'Apr 22, 2026', time: '5:00 PM', status: 'pending_payment', amount: 2500 },
  { id: '4', student: 'Hamza Tariq', tutor: 'Usman Tariq', subject: 'Economics', date: 'Apr 19, 2026', time: '2:00 PM', status: 'completed', amount: 1700 },
]

export default function AdminSessionsPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Session Monitoring</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>View and manage all platform sessions</p>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Tutor</th>
              <th>Subject</th>
              <th>Date & Time</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 500 }}>{s.student}</td>
                <td>{s.tutor}</td>
                <td>{s.subject}</td>
                <td>{s.date} {s.time}</td>
                <td style={{ fontWeight: 600 }}>PKR {s.amount.toLocaleString()}</td>
                <td>
                  <span className={`badge ${s.status === 'completed' ? 'badge-success' : s.status === 'confirmed' ? 'badge-info' : 'badge-warning'}`}>
                    {s.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
