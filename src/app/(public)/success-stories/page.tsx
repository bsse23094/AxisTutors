import type { Metadata } from 'next'
import { Star, Quote } from 'lucide-react'

export const metadata: Metadata = { title: 'Success Stories' }

const stories = [
  { student: 'Ali Hassan', grade: 'FSc Year 2', subject: 'Physics', tutor: 'Ahmed Khan', quote: 'My Physics grade went from C to A+ in just 3 months. Ahmed Sir explains complex concepts in a way that finally clicks. I wish I had found Axis Tutors earlier!', avatar: 'AH' },
  { student: 'Fatima Raza', grade: 'O-Level', subject: 'Mathematics', tutor: 'Sara Qureshi', quote: 'Sara Madam helped me overcome my fear of maths. I scored an A* in my CIE exam and my parents are so happy. The booking system is super easy too.', avatar: 'FR' },
  { student: 'Hamza Tariq', grade: 'A-Level', subject: 'Economics', tutor: 'Usman Tariq', quote: 'The flexibility is amazing. I can book sessions around my school schedule. Sir Usman makes economics interesting with real-world examples.', avatar: 'HT' },
  { student: 'Zainab Ahmed', grade: 'Matric Year 2', subject: 'Chemistry', tutor: 'Fatima Noor', quote: 'I went from failing chemistry to getting 90%+ in my board exams. Fatima Ma\'am is patient and always available to help. Highly recommend!', avatar: 'ZA' },
  { student: 'Omar Malik', grade: 'University', subject: 'Computer Science', tutor: 'Hassan Ali', quote: 'Hassan taught me programming from scratch. I built my first web app within 2 months. His teaching style is hands-on and practical.', avatar: 'OM' },
  { student: 'Amna Shah', grade: 'IELTS', subject: 'English', tutor: 'Ayesha Malik', quote: 'Ayesha Ma\'am coached me to a Band 7.5 in IELTS. Her structured approach and speaking practice sessions were exactly what I needed for my Canada visa.', avatar: 'AS' },
  { student: 'Bilal Hussain', grade: 'FSc Year 1', subject: 'Biology', tutor: 'Fatima Noor', quote: 'Biology used to be boring but Fatima Ma\'am makes it fascinating. I actually look forward to my tutoring sessions now. My parents are thrilled with my results.', avatar: 'BH' },
  { student: 'Hira Qureshi', grade: 'Matric Year 1', subject: 'Urdu', tutor: 'Maria Hassan', quote: 'Maria Ma\'am helped me improve my Urdu essay writing dramatically. I scored top marks in my school exams. The read-only chat feature lets my mom stay in the loop!', avatar: 'HQ' },
]

export default function SuccessStoriesPage() {
  return (
    <div className="container section">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Success Stories</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', maxWidth: '480px', margin: '0 auto' }}>
          Real results from real students across Pakistan
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        {stories.map(s => (
          <div key={s.student} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem' }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#FBBF24" color="#FBBF24" />)}
            </div>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem', fontStyle: 'italic' }}>
              &ldquo;{s.quote}&rdquo;
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div className="avatar avatar-md" style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'white' }}>
                  {s.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{s.student}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.grade} · {s.subject}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tutor</div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary)' }}>{s.tutor}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
