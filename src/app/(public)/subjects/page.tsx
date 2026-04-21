import Link from 'next/link'
import type { Metadata } from 'next'
import {
  Calculator, Atom, FlaskConical, Leaf, BookOpenCheck, PenLine,
  Monitor, Receipt, TrendingUp, Map, Star, BarChart3, Award, GraduationCap, BookOpen
} from 'lucide-react'

export const metadata: Metadata = { title: 'Subjects' }

const iconMap: Record<string, React.ReactNode> = {
  'calculator': <Calculator size={28} />, 'atom': <Atom size={28} />,
  'flask-conical': <FlaskConical size={28} />, 'leaf': <Leaf size={28} />,
  'book-open': <BookOpenCheck size={28} />, 'pen-line': <PenLine size={28} />,
  'monitor': <Monitor size={28} />, 'receipt': <Receipt size={28} />,
  'trending-up': <TrendingUp size={28} />, 'map': <Map size={28} />,
  'star': <Star size={28} />, 'bar-chart': <BarChart3 size={28} />,
  'award': <Award size={28} />, 'graduation-cap': <GraduationCap size={28} />,
}

const subjects = [
  { name: 'Mathematics', slug: 'mathematics', category: 'Science', icon: 'calculator', tutors: 85, color: '#1F8F62' },
  { name: 'Physics', slug: 'physics', category: 'Science', icon: 'atom', tutors: 62, color: '#2C7F58' },
  { name: 'Chemistry', slug: 'chemistry', category: 'Science', icon: 'flask-conical', tutors: 54, color: '#4E9B64' },
  { name: 'Biology', slug: 'biology', category: 'Science', icon: 'leaf', tutors: 48, color: '#22c55e' },
  { name: 'Computer Science', slug: 'computer-science', category: 'Science', icon: 'monitor', tutors: 41, color: '#27A271' },
  { name: 'Statistics', slug: 'statistics', category: 'Science', icon: 'bar-chart', tutors: 22, color: '#2F8CC2' },
  { name: 'English', slug: 'english', category: 'Languages', icon: 'book-open', tutors: 73, color: '#f59e0b' },
  { name: 'Urdu', slug: 'urdu', category: 'Languages', icon: 'pen-line', tutors: 29, color: '#ef4444' },
  { name: 'IELTS Preparation', slug: 'ielts-preparation', category: 'Languages', icon: 'award', tutors: 18, color: '#3b82f6' },
  { name: 'SAT Preparation', slug: 'sat-preparation', category: 'Languages', icon: 'graduation-cap', tutors: 12, color: '#2C7F58' },
  { name: 'Accounts', slug: 'accounts', category: 'Commerce', icon: 'receipt', tutors: 35, color: '#2F7F55' },
  { name: 'Economics', slug: 'economics', category: 'Commerce', icon: 'trending-up', tutors: 30, color: '#d97706' },
  { name: 'Pakistan Studies', slug: 'pakistan-studies', category: 'Arts', icon: 'map', tutors: 20, color: '#059669' },
  { name: 'Islamiat', slug: 'islamiat', category: 'Arts', icon: 'star', tutors: 15, color: '#dc2626' },
  { name: 'O-Level Mathematics', slug: 'o-level-mathematics', category: 'Science', icon: 'calculator', tutors: 32, color: '#4f46e5' },
  { name: 'A-Level Physics', slug: 'a-level-physics', category: 'Science', icon: 'atom', tutors: 25, color: '#be185d' },
]

const categories = [...new Set(subjects.map(s => s.category))]

export default function SubjectsPage() {
  return (
    <div className="container section">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Browse Subjects</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Find expert tutors across 50+ subjects and curricula</p>
      </div>

      {categories.map(cat => (
        <div key={cat} style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>{cat}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1rem' }}>
            {subjects.filter(s => s.category === cat).map(sub => (
              <Link key={sub.slug} href={`/subjects/${sub.slug}`} className="card card-hover" style={{
                textDecoration: 'none', color: 'inherit', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem',
              }}>
                <div style={{
                  width: '3rem', height: '3rem', borderRadius: 'var(--radius)',
                  background: `${sub.color}14`, color: sub.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {iconMap[sub.icon] || <BookOpen size={28} />}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{sub.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub.tutors} tutors available</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
