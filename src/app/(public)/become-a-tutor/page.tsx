'use client'

import Link from 'next/link'
import type { Metadata } from 'next'
import { DollarSign, Calculator, ArrowRight, Sparkles, TrendingUp, Shield, Clock, Users, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

export default function BecomeATutorPage() {
  const [hoursPerWeek, setHoursPerWeek] = useState(10)
  const [hourlyRate, setHourlyRate] = useState(2000)
  const commission = 0.15
  const monthlyEarning = Math.round(hoursPerWeek * 4 * hourlyRate * (1 - commission))

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--surface), var(--primary-50))',
        padding: '6rem 0',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container">
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              background: 'var(--primary-dark)', color: 'white',
              padding: '0.45rem 1.25rem', borderRadius: '99px',
              fontSize: '0.85rem', fontWeight: 600, marginBottom: '2rem',
              boxShadow: '0 4px 14px rgba(26, 59, 43, 0.25)'
            }}>
              <Sparkles size={14} /> Now accepting applications
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, marginBottom: '1.25rem', lineHeight: 1.1, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              Teach on Your Schedule.<br />
              <span style={{ color: 'var(--primary-dark)' }}>Earn from Home.</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
              Join World's fastest-growing premium tutoring platform. Set your exact rates, choose your subjects, and scale your income instantly.
            </p>
            <Link href="/register/tutor" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Apply Now <ArrowRight size={18} />
            </Link>
          </div>
          
          {/* Decorative CSS Geometric Visual Asset */}
          <div style={{
            position: 'absolute', right: '5%', top: '15%', width: '300px', height: '300px',
            background: 'var(--primary)', borderRadius: '100px 30px 150px 40px',
            opacity: 0.1, filter: 'blur(40px)', transform: 'rotate(15deg)', zIndex: 0
          }} className="hide-on-mobile" />
          <div style={{
            position: 'absolute', left: '10%', bottom: '20%', width: '200px', height: '200px',
            background: 'var(--accent)', borderRadius: '50%',
            opacity: 0.1, filter: 'blur(50px)', zIndex: 0
          }} className="hide-on-mobile" />
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="section">
        <div className="container" style={{ maxWidth: '640px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, textAlign: 'center', marginBottom: '2rem', color: 'var(--primary-dark)' }}>
            <Calculator size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--primary)' }} />
            Earnings Calculator
          </h2>
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="label" style={{ marginBottom: '0.5rem' }}>Hours per week: <strong>{hoursPerWeek}h</strong></label>
              <input type="range" min="1" max="40" value={hoursPerWeek} onChange={e => setHoursPerWeek(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary-dark)' }} />
            </div>
            <div style={{ marginBottom: '2.5rem' }}>
              <label className="label" style={{ marginBottom: '0.5rem' }}>Hourly rate: <strong>CAD {hourlyRate.toLocaleString()}</strong></label>
              <input type="range" min="30" max="200" step="10" value={hourlyRate} onChange={e => setHourlyRate(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary-dark)' }} />
            </div>
            <div style={{
              textAlign: 'center', padding: '2rem',
              background: 'linear-gradient(135deg, var(--primary-dark), #10261C)',
              borderRadius: 'var(--radius-lg)', color: 'white',
              boxShadow: '0 20px 40px rgba(26, 59, 43, 0.25)',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.25rem' }}>Estimated Monthly Earnings</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>CAD {monthlyEarning.toLocaleString()}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>After {(commission * 100).toFixed(0)}% platform fee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section gradient-bg">
        <div className="container">
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, textAlign: 'center', marginBottom: '2.5rem' }}>Why Teach on Axis Tutors?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', maxWidth: '960px', margin: '0 auto' }}>
            {[
              { icon: <Clock size={24} />, title: 'Flexible Hours', desc: 'Set your own schedule and teach when it suits you.', color: 'var(--primary)' },
              { icon: <Users size={24} />, title: 'Verified Students', desc: 'Our platform attracts serious, dedicated students.', color: 'var(--primary-dark)' },
              { icon: <DollarSign size={24} />, title: 'Automatic Payments', desc: 'Get paid automatically after each session.', color: 'var(--secondary-dark)' },
              { icon: <TrendingUp size={24} />, title: 'Growing Platform', desc: 'Join a rapidly expanding student base across the globe.', color: 'var(--accent)' },
            ].map(b => (
              <div key={b.title} className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius)', background: `${b.color}14`, color: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                  {b.icon}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.375rem' }}>{b.title}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="section">
        <div className="container" style={{ maxWidth: '640px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem' }}>Requirements</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', textAlign: 'left' }}>
            {[
              'Degree or strong subject knowledge',
              'Patience and communication skills',
              'Reliable internet connection',
              'Valid National ID or passport for verification',
              'Willingness to maintain a professional profile',
            ].map(r => (
              <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={20} color="var(--accent)" style={{ flexShrink: 0 }} />
                {r}
              </div>
            ))}
          </div>
          <Link href="/register/tutor" className="btn btn-accent btn-lg" style={{ marginTop: '2rem' }}>
            Start Your Application <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
