'use client'

import Link from 'next/link'
import { GraduationCap, Users, BookOpenCheck, ArrowRight } from 'lucide-react'

const roles = [
  {
    role: 'student',
    icon: <GraduationCap size={32} />,
    title: 'Student',
    description: 'Find expert tutors, book sessions, and supercharge your academic trajectory.',
    facts: ['Browse 500+ verified tutors', 'Book optimal sessions in minutes', 'Track actionable progress'],
    color: 'var(--primary-dark)',
    bgColor: 'var(--primary-50)',
    gradient: 'linear-gradient(135deg, rgba(26, 59, 43, 0.05), rgba(26, 59, 43, 0.15))',
  },
  {
    role: 'tutor',
    icon: <BookOpenCheck size={32} />,
    title: 'Tutor',
    description: 'Instruct on your exact schedule, define your rates, and escalate your career.',
    facts: ['Set your own hourly rate', 'Total flexible scheduling', 'Earn independently'],
    color: 'var(--primary)',
    bgColor: 'var(--primary-50)',
    gradient: 'linear-gradient(135deg, rgba(42, 90, 67, 0.08), rgba(42, 90, 67, 0.2))',
  },
  {
    role: 'parent',
    icon: <Users size={32} />,
    title: 'Parent',
    description: 'Oversee your child\'s exact sessions, manage payments, and stay perfectly informed.',
    facts: ['Approve session bookings', 'Direct read-only chat oversight', 'Centralized payment control'],
    color: 'var(--secondary-dark)',
    bgColor: 'var(--accent-light)',
    gradient: 'linear-gradient(135deg, rgba(159, 208, 170, 0.1), rgba(159, 208, 170, 0.25))',
  },
]

export default function RegisterPage() {
  return (
    <div style={{ width: '100%', maxWidth: '880px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--primary-dark)', letterSpacing: '-0.02em' }}>
          Create Your Account
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', fontWeight: 500 }}>
          Choose how you want to experience Axis Tutors
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1.25rem',
      }}>
        {roles.map((r) => (
          <Link
            key={r.role}
            href={`/register/${r.role}`}
            className="card card-hover"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              padding: '1.75rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Colored top accent */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: r.color,
            }} />

            {/* Icon */}
            <div style={{
              width: '4rem',
              height: '4rem',
              borderRadius: 'var(--radius-lg)',
              background: r.gradient,
              color: r.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}>
              {r.icon}
            </div>

            {/* Title and description */}
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              {r.title}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {r.description}
            </p>

            {/* Key facts */}
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {r.facts.map((fact) => (
                <li key={fact} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8125rem',
                  color: 'var(--text-secondary)',
                  justifyContent: 'center',
                }}>
                  <div style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: r.color,
                    flexShrink: 0,
                  }} />
                  {fact}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="btn btn-primary" style={{
              width: '100%',
              justifyContent: 'center',
              background: r.color,
            }}>
              Get Started <ArrowRight size={16} />
            </div>
          </Link>
        ))}
      </div>

      <p style={{
        textAlign: 'center',
        marginTop: '1.5rem',
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
      }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
          Log In
        </Link>
      </p>
    </div>
  )
}
