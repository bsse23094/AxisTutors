import type { Metadata } from 'next'
import { Search, Filter } from 'lucide-react'

export const metadata: Metadata = { title: 'All Users' }

const users = [
  { id: '1', name: 'Ahmed Khan', email: 'ahmed@email.com', role: 'tutor', status: 'active', joined: 'Jan 2026' },
  { id: '2', name: 'Ali Hassan', email: 'ali@email.com', role: 'student', status: 'active', joined: 'Feb 2026' },
  { id: '3', name: 'Amna Raza', email: 'amna@email.com', role: 'parent', status: 'active', joined: 'Feb 2026' },
  { id: '4', name: 'Fatima Noor', email: 'fatima@email.com', role: 'tutor', status: 'active', joined: 'Jan 2026' },
  { id: '5', name: 'Sara Malik', email: 'sara@email.com', role: 'student', status: 'active', joined: 'Mar 2026' },
  { id: '6', name: 'Zainab Tariq', email: 'zainab@email.com', role: 'tutor', status: 'pending', joined: 'Apr 2026' },
]

const roleBadge: Record<string, string> = { tutor: 'badge-info', student: 'badge-primary', parent: 'badge-warning', admin: 'badge-error' }

export default function AllUsersPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>User Management</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Manage all platform users</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input" placeholder="Search users..." style={{ paddingLeft: '2.25rem' }} />
        </div>
        <select className="select" style={{ width: 'auto' }}>
          <option>All Roles</option>
          <option>Tutors</option>
          <option>Students</option>
          <option>Parents</option>
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</td>
                <td>{user.email}</td>
                <td><span className={`badge ${roleBadge[user.role]}`}>{user.role}</span></td>
                <td><span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-warning'}`}>{user.status}</span></td>
                <td>{user.joined}</td>
                <td>
                  <button className="btn btn-ghost btn-sm">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
