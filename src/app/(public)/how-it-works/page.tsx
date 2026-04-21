import Link from 'next/link'
import type { Metadata } from 'next'
import {
  Search, Calendar, GraduationCap, CreditCard, CheckCircle2, 
  Star, FileCheck, Clock, DollarSign, UserCheck, BookOpen
} from 'lucide-react'

export const metadata: Metadata = { title: 'How It Works' }

export default function HowItWorksPage() {
  return (
    <div className="container section" style={{ position: 'relative' }}>
      {/* Decorative High-End Visuals */}
      <div style={{
        position: 'absolute', top: '5%', left: '-5%', width: '400px', height: '400px',
        background: 'var(--primary)', filter: 'blur(120px)', opacity: 0.08, zIndex: -1, pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', top: '45%', right: '-5%', width: '500px', height: '500px',
        background: 'var(--accent)', filter: 'blur(150px)', opacity: 0.05, zIndex: -1, pointerEvents: 'none'
      }} />

      <div style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '1rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-dark)', letterSpacing: '-0.03em' }}>How Axis Tutors Works</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '580px', margin: '0 auto', lineHeight: 1.6 }}>
          An effortlessly secure educational ecosystem designed to scale your child's outcomes.
        </p>
      </div>

      {/* Student Path */}
      <div style={{ marginBottom: '5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2.5rem', textAlign: 'center', color: 'var(--primary-dark)' }}>
          <span style={{ fontSize: '0.9rem', padding: '0.5rem 1.25rem', background: 'var(--primary-dark)', color: 'white', borderRadius: '99px', boxShadow: '0 4px 14px rgba(26,59,43,0.2)' }}>For Students & Parents</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
          {[
            { step: 1, icon: <UserCheck size={26} strokeWidth={1.5} />, title: 'Create a Free Account', desc: 'Register as a student in 30 seconds. Share your parent\'s phone number for secure linking.', color: 'var(--primary)' },
            { step: 2, icon: <Search size={26} strokeWidth={1.5} />, title: 'Find Your Tutor', desc: 'Browse and filter elite tutors by subject, level, price, and authenticated reviews.', color: 'var(--primary-dark)' },
            { step: 3, icon: <Calendar size={26} strokeWidth={1.5} />, title: 'Book a Time Slot', desc: 'Select an available time that works for you and execute a booking request.', color: 'var(--secondary)' },
            { step: 4, icon: <CreditCard size={26} strokeWidth={1.5} />, title: 'Parent Approves', desc: 'Your parent is notified, reviews the session details, and safely authorizes payment.', color: 'var(--accent)' },
            { step: 5, icon: <CheckCircle2 size={26} strokeWidth={1.5} />, title: 'Session Confirmed', desc: 'Session instantly confirms and binds directly into both Google Calendars.', color: 'var(--primary)' },
            { step: 6, icon: <Star size={26} strokeWidth={1.5} />, title: 'Learn & Elevate', desc: 'Attend your session seamlessly. Leave feedback to help fuel top educators.', color: 'var(--primary-dark)' },
          ].map(item => (
            <div key={item.step} className="card card-hover" style={{ padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden', border: 'none', boxShadow: '0 4px 20px rgba(26,59,43,0.05)' }}>
              {/* Massive Watermark Numbering Visual */}
              <div style={{
                position: 'absolute', top: '-1rem', right: '-1rem', fontSize: '8rem', fontWeight: 900, 
                color: item.color, opacity: 0.04, lineHeight: 1, userSelect: 'none'
              }}>
                {item.step}
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                
                {/* Expensive Dual-Ring Icon Container */}
                <div style={{
                  position: 'relative', width: '5rem', height: '5rem', margin: '0 auto 1.5rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {/* Outer Dashed Orbit */}
                  <div style={{
                    position: 'absolute', inset: 0, border: `1px dashed ${item.color}`, 
                    borderRadius: '50%', opacity: 0.3, transform: 'rotate(15deg)'
                  }} />
                  {/* Inner Solid Hub */}
                  <div style={{
                    position: 'absolute', inset: '0.4rem', background: 'var(--primary-50)', 
                    borderRadius: '50%', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', color: item.color,
                    boxShadow: '0 4px 10px rgba(26,59,43,0.08)'
                  }}>
                    {item.icon}
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: item.color, marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Step {item.step}</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{item.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tutor Path */}
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2.5rem', textAlign: 'center', color: 'var(--primary-dark)' }}>
          <span style={{ fontSize: '0.9rem', padding: '0.5rem 1.25rem', background: 'white', color: 'var(--primary-dark)', border: '1px solid var(--border)', borderRadius: '99px', boxShadow: '0 4px 14px rgba(26,59,43,0.05)' }}>For Educators</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
          {[
            { step: 1, icon: <FileCheck size={26} strokeWidth={1.5} />, title: 'Apply & Upload Docs', desc: 'Construct your comprehensive profile and upload required credentials for strict verification.', color: 'var(--primary)' },
            { step: 2, icon: <Clock size={26} strokeWidth={1.5} />, title: 'Set Schedule & Rates', desc: 'Engineered for flexibility. Dictate your own hourly fees and available booking windows.', color: 'var(--primary-dark)' },
            { step: 3, icon: <BookOpen size={26} strokeWidth={1.5} />, title: 'Get Verified', desc: 'Our team manually audits your submissions, clearing you for access within 24-48 hours.', color: 'var(--secondary)' },
            { step: 4, icon: <GraduationCap size={26} strokeWidth={1.5} />, title: 'Teach & Scale', desc: 'Acquire bookings immediately. Teach dynamically while platform architecture processes payments.', color: 'var(--accent)' },
          ].map(item => (
            <div key={item.step} className="card card-hover" style={{ padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden', border: 'none', boxShadow: '0 4px 20px rgba(26,59,43,0.05)' }}>
               {/* Massive Watermark Numbering Visual */}
               <div style={{
                position: 'absolute', top: '-1rem', right: '-1rem', fontSize: '8rem', fontWeight: 900, 
                color: item.color, opacity: 0.04, lineHeight: 1, userSelect: 'none'
              }}>
                {item.step}
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                
                {/* Expensive Dual-Ring Icon Container */}
                <div style={{
                  position: 'relative', width: '5rem', height: '5rem', margin: '0 auto 1.5rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {/* Outer Dashed Orbit */}
                  <div style={{
                    position: 'absolute', inset: 0, border: `1px dashed ${item.color}`, 
                    borderRadius: '50%', opacity: 0.3, transform: 'rotate(15deg)'
                  }} />
                  {/* Inner Solid Hub */}
                  <div style={{
                    position: 'absolute', inset: '0.4rem', background: 'var(--primary-50)', 
                    borderRadius: '50%', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', color: item.color,
                    boxShadow: '0 4px 10px rgba(26,59,43,0.08)'
                  }}>
                    {item.icon}
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: item.color, marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Step {item.step}</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{item.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Link href="/register/student" className="btn btn-primary btn-lg">Register as Student</Link>
          <Link href="/register/tutor" className="btn btn-secondary btn-lg">Apply as Tutor</Link>
        </div>
      </div>
    </div>
  )
}
