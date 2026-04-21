'use client'

import Link from 'next/link'
import { Search, Star, MapPin, Filter, BookOpen, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { GRADE_LEVELS } from '@/lib/utils'

const mockTutors = [
  { id: '1', username: 'ahmed-khan', full_name: 'Ahmed Khan', avatar: 'AK', bio: 'Experienced Physics and Mathematics tutor with 10+ years of teaching in FSc and A-Level curricula. I help students build strong conceptual foundations.', hourly_rate: 2000, rating_avg: 4.9, total_sessions: 342, subjects: [{ name: 'Physics', level: 'FSc' }, { name: 'Mathematics', level: 'All' }], city: 'Lahore' },
  { id: '2', username: 'fatima-noor', full_name: 'Fatima Noor', avatar: 'FN', bio: 'Chemistry and Biology specialist with an MSc in Biochemistry. Passionate about making science fun and accessible for students at all levels.', hourly_rate: 1800, rating_avg: 4.8, total_sessions: 218, subjects: [{ name: 'Chemistry', level: 'O-Level' }, { name: 'Biology', level: 'All' }], city: 'Karachi' },
  { id: '3', username: 'hassan-ali', full_name: 'Hassan Ali', avatar: 'HA', bio: 'Full-stack developer and CS educator. I teach programming concepts, data structures, and web development with hands-on projects.', hourly_rate: 2500, rating_avg: 5.0, total_sessions: 156, subjects: [{ name: 'Computer Science', level: 'University' }], city: 'Islamabad' },
  { id: '4', username: 'ayesha-malik', full_name: 'Ayesha Malik', avatar: 'AM', bio: 'English language expert specializing in IELTS and academic writing. Over 200 students coached to Band 7+ scores.', hourly_rate: 1500, rating_avg: 4.7, total_sessions: 189, subjects: [{ name: 'English', level: 'All' }, { name: 'IELTS Prep', level: 'All' }], city: 'Lahore' },
  { id: '5', username: 'usman-tariq', full_name: 'Usman Tariq', avatar: 'UT', bio: 'Economics and Accounting tutor with a CA background. I simplify complex business concepts for commerce students.', hourly_rate: 1700, rating_avg: 4.9, total_sessions: 275, subjects: [{ name: 'Economics', level: 'A-Level' }, { name: 'Accounts', level: 'FSc' }], city: 'Rawalpindi' },
  { id: '6', username: 'sara-qureshi', full_name: 'Sara Qureshi', avatar: 'SQ', bio: 'O-Level Mathematics specialist. Former Cambridge examiner with deep knowledge of the CIE curriculum and exam patterns.', hourly_rate: 2200, rating_avg: 4.8, total_sessions: 198, subjects: [{ name: 'O-Level Maths', level: 'O-Level' }], city: 'Karachi' },
  { id: '7', username: 'rizwan-ahmed', full_name: 'Rizwan Ahmed', avatar: 'RA', bio: 'Statistics and Mathematics tutor with 8 years of teaching experience. I focus on exam preparation and problem-solving techniques.', hourly_rate: 1600, rating_avg: 4.6, total_sessions: 145, subjects: [{ name: 'Statistics', level: 'FSc' }, { name: 'Mathematics', level: 'Matric' }], city: 'Faisalabad' },
  { id: '8', username: 'maria-hassan', full_name: 'Maria Hassan', avatar: 'MH', bio: 'Urdu literature and Pakistan Studies expert with a passion for helping students ace their board exams with focused preparation.', hourly_rate: 1200, rating_avg: 4.5, total_sessions: 110, subjects: [{ name: 'Urdu', level: 'Matric' }, { name: 'Pak Studies', level: 'All' }], city: 'Multan' },
]

export default function FindTutorPage() {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="container section-sm" style={{ position: 'relative' }}>
      {/* Expensive Ambient Background Glow */}
      <div style={{
        position: 'absolute', top: 0, right: '10%', width: '600px', height: '400px',
        background: 'var(--primary)', filter: 'blur(150px)', opacity: 0.05, zIndex: -1, pointerEvents: 'none'
      }} />

      <div style={{ marginBottom: '3.5rem', marginTop: '1rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary-dark)', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>Find an Axis Tutor</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', fontWeight: 400 }}>Discover your perfect match from {mockTutors.length}00+ verified premium educators.</p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Filters Sidebar */}
        <aside className="card" style={{
          width: '300px',
          flexShrink: 0,
          padding: '2rem',
          position: 'sticky',
          top: '6.5rem',
          maxHeight: 'calc(100vh - 8rem)',
          overflowY: 'auto',
          background: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.4)',
          boxShadow: '0 8px 32px rgba(26,59,43,0.08)',
          borderRadius: 'var(--radius-xl)',
          scrollbarWidth: 'none', // Failsafe for Firefox
        }}>
          {/* Hide scrollbar for Chrome/Safari for a cleaner look */}
          <style>{`
            aside::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-dark)' }}>Filters</h3>
            <button style={{
              background: 'none', border: 'none', fontSize: '0.8125rem',
              color: 'var(--primary)', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              Reset
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Subject</label>
              <select className="select" style={{ background: '#F8FAFC', border: 'none', padding: '0.875rem' }}>
                <option value="">All Subjects</option>
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Biology</option>
                <option>English</option>
                <option>Computer Science</option>
                <option>Economics</option>
                <option>Urdu</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Grade Level</label>
              <select className="select" style={{ background: '#F8FAFC', border: 'none', padding: '0.875rem' }}>
                <option value="">All Levels</option>
                {GRADE_LEVELS.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Price Range (PKR/h)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input className="input" type="number" placeholder="Min" min="0" style={{ background: '#F8FAFC', border: 'none' }} />
                <input className="input" type="number" placeholder="Max" min="0" style={{ background: '#F8FAFC', border: 'none' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>City</label>
              <input className="input" type="text" placeholder="e.g. Lahore" style={{ background: '#F8FAFC', border: 'none', padding: '0.875rem' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Rating</label>
              <select className="select" style={{ background: '#F8FAFC', border: 'none', padding: '0.875rem' }}>
                <option value="">Any</option>
                <option>4+ stars</option>
                <option>4.5+ stars</option>
                <option>5 stars</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Sort By</label>
              <select className="select" style={{ background: '#F8FAFC', border: 'none', padding: '0.875rem' }}>
                <option>Relevance</option>
                <option>Price (Low to High)</option>
                <option>Price (High to Low)</option>
                <option>Rating</option>
                <option>Most Sessions</option>
              </select>
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }}>
              <Filter size={16} /> Apply Filters
            </button>
          </div>
        </aside>

        {/* Tutor Grid */}
        <div style={{ flex: 1 }}>
          {/* Search bar */}
          <div style={{
            display: 'flex', gap: '0.5rem', marginBottom: '1.5rem',
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={16} style={{
                position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }} />
              <input className="input" type="text" placeholder="Search by name or subject..." style={{ paddingLeft: '2.25rem' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {mockTutors.map((tutor) => (
              <div key={tutor.id} className="card card-hover" style={{ 
                padding: '1.75rem', 
                border: 'none', 
                boxShadow: '0 4px 20px rgba(26,59,43,0.04)',
                background: 'white',
                borderRadius: 'var(--radius-xl)'
              }}>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <div className="avatar avatar-xl" style={{
                    background: `linear-gradient(135deg, var(--primary-dark), var(--primary))`,
                    color: 'white', fontWeight: 700, fontSize: '1.4rem',
                    width: '4.5rem', height: '4.5rem', flexShrink: 0,
                    boxShadow: '0 8px 16px rgba(26,59,43,0.15)'
                  }}>
                    {tutor.avatar}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                      <div>
                        <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary-dark)' }}>{tutor.full_name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.125rem' }}>
                          <MapPin size={13} color="var(--text-muted)" /><span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{tutor.city}</span>
                          <span style={{ color: 'var(--border)' }}>·</span>
                          <Star size={13} fill="#FBBF24" color="#FBBF24" />
                          <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{tutor.rating_avg}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({tutor.total_sessions} sessions)</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>PKR {tutor.hourly_rate.toLocaleString()}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>per hour</div>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0.75rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {tutor.bio}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {tutor.subjects.map((sub) => (
                          <span key={sub.name} style={{
                            padding: '0.35rem 0.85rem', borderRadius: '99px',
                            background: 'var(--primary-50)', color: 'var(--primary-dark)',
                            fontSize: '0.85rem', fontWeight: 600, border: '1px solid rgba(26,59,43,0.1)'
                          }}>
                            {sub.name} <span style={{ opacity: 0.5, margin: '0 4px' }}>|</span> {sub.level}
                          </span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className="btn" style={{ background: '#F8FAFC', color: 'var(--text-primary)', padding: '0.5rem 1.25rem' }}>Message</button>
                        <Link href={`/tutor/${tutor.username}`} className="btn btn-primary">
                          Book Trial <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
