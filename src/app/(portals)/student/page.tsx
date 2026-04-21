import StatCard from '@/components/portal/StatCard'
import { Calendar, BookOpen, Star, Clock } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Student Dashboard',
}

export default function StudentDashboard() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Welcome Back! 📚</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Keep up the great work with your studies</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <StatCard label="Upcoming Sessions" value="3" icon={<Calendar size={20} />} color="#3B82F6" />
        <StatCard label="Completed Sessions" value="24" icon={<BookOpen size={20} />} color="#22C55E" />
        <StatCard label="Active Tutors" value="2" icon={<Star size={20} />} color="#F59E0B" />
        <StatCard label="Hours Learned" value="48" icon={<Clock size={20} />} color="#1F8F62" />
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <Link href="/student/find-tutor" className="card card-hover" style={{
          textDecoration: 'none', color: 'inherit',
          display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem',
        }}>
          <div style={{
            width: '3rem', height: '3rem', borderRadius: 'var(--radius)',
            background: 'var(--primary-50)', color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BookOpen size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Find a Tutor</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Browse verified tutors</div>
          </div>
        </Link>

        <Link href="/student/calendar" className="card card-hover" style={{
          textDecoration: 'none', color: 'inherit',
          display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem',
        }}>
          <div style={{
            width: '3rem', height: '3rem', borderRadius: 'var(--radius)',
            background: '#DCFCE7', color: 'var(--success)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Calendar size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>My Calendar</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>View upcoming sessions</div>
          </div>
        </Link>
      </div>

      {/* Upcoming */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Upcoming Sessions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { tutor: 'Ahmed Khan', subject: 'Physics', time: 'Today 4:00 PM' },
            { tutor: 'Fatima Noor', subject: 'Chemistry', time: 'Tomorrow 3:00 PM' },
            { tutor: 'Ahmed Khan', subject: 'Maths', time: 'Wed 5:00 PM' },
          ].map((s, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-hover)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="avatar avatar-md" style={{ background: 'var(--accent)', color: 'white' }}>
                  {s.tutor.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{s.tutor}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.subject} · {s.time}</div>
                </div>
              </div>
              <span className="badge badge-success">Confirmed</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
