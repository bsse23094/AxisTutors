import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Calendar,
  Search,
  Shield,
  Star,
  Users,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Clock,
  BookOpen
} from 'lucide-react'
import TutorCard from '@/components/public/TutorCard'
import SubjectCard from '@/components/public/SubjectCard'

const featureCards = [
  {
    title: 'Verified Tutors',
    description: 'Every tutor profile undergoes rigorous screening and verification.',
    icon: <Shield size={24} />,
  },
  {
    title: 'Parent Visibility',
    description: 'Parents approve sessions, review chats, and track direct progress.',
    icon: <Users size={24} />,
  },
  {
    title: 'Smart Scheduling',
    description: 'Book by real-time availability and sync to Google Calendar.',
    icon: <Calendar size={24} />,
  },
]

const steps = [
  {
    title: '1. Search for Excellence',
    description: 'Filter by exact subject, budget, or grade to find your perfect match instantly.',
  },
  {
    title: '2. Book and Confirm',
    description: 'Parents securely approve requests; sessions lock directly into your calendar.',
  },
  {
    title: '3. Learn and Improve',
    description: 'Attend sessions, track outcomes, and maintain incredible momentum.',
  },
]

const highlights = [
  { value: '500+', label: 'Verified Instructors' },
  { value: '10,000+', label: 'Successful Sessions' },
  { value: '50+', label: 'Curriculum Subjects' },
  { value: '4.9★', label: 'Platform Average' },
]

const dummySubjects = [
  { name: 'Mathematics', slug: 'mathematics', tutorsCount: 142 },
  { name: 'Physics', slug: 'physics', tutorsCount: 89 },
  { name: 'English', slug: 'english', tutorsCount: 115 },
  { name: 'Chemistry', slug: 'chemistry', tutorsCount: 76 },
  { name: 'Biology', slug: 'biology', tutorsCount: 65 },
  { name: 'Computer Science', slug: 'computer-science', tutorsCount: 94 },
]

const dummyTutors = [
  { id: '1', name: 'Ayesha Malik', username: 'ayesha-m', city: 'Lahore', rating: 4.9, hourlyRate: 1500 },
  { id: '2', name: 'Hassan Ali', username: 'hassan-a', city: 'Karachi', rating: 5.0, hourlyRate: 2500 },
  { id: '3', name: 'Fatima Noor', username: 'fatima-n', city: 'Islamabad', rating: 4.9, hourlyRate: 1800 },
  { id: '4', name: 'Zainab Ahmed', username: 'zainab-a', city: 'Lahore', rating: 4.8, hourlyRate: 1200 },
]

const testimonials = [
  { text: "My daughter's analytical grades improved profoundly since we discovered Axis Tutors.", author: "Ayesha, Mother of O-Level Student" },
  { text: "The platform's verification gives us absolute peace of mind. Highly recommended!", author: "Ali, A-Level Student" },
  { text: "As a premier tutor, the automated calendar and payments completely revolutionized my workflow.", author: "Hassan, Mathematics Educator" }
]

export default function HomePage() {
  return (
    <>
      {/* 1. ULTRA PREMIUM HERO SECTION */}
      <section style={{ paddingTop: '6rem', paddingBottom: '6rem', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ display: 'grid', gap: '4rem', alignItems: 'center', gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)' }}>
          {/* LEFT: Copy & Search */}
          <div style={{ zIndex: 10 }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 1rem', 
              background: 'var(--primary-50)', 
              color: 'var(--primary-dark)', 
              borderRadius: '99px',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
              border: '1px solid var(--primary-100)'
            }}>
              <CheckCircle2 size={14} />
              Pakistan's #1 Tutoring Platform
            </div>
            
            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', 
              lineHeight: 1.05, 
              marginBottom: '1.25rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em'
            }}>
              Find the Expert Tutor Your Child <span style={{ color: 'var(--primary)' }}>Deserves.</span>
            </h1>
            
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '1.15rem', 
              maxWidth: '600px', 
              marginBottom: '2.5rem',
              lineHeight: 1.7,
              fontWeight: 400
            }}>
              Verified tutors for Matric, FSc, O-Level, A-Level & university. Book optimal sessions in minutes — parents stay in absolute control.
            </p>

            <form action="/find-tutor" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              background: 'var(--surface)',
              borderRadius: 'var(--radius-xl)',
              padding: '0.5rem',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-light)',
              maxWidth: '650px',
              marginBottom: '3rem'
            }}>
              <div style={{ padding: '0 1rem', borderRight: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
                <select style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>
                  <option>All Subjects</option>
                  <option>O-Level Maths</option>
                  <option>A-Level Physics</option>
                </select>
              </div>
              <div style={{ flex: 1, padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Search size={18} style={{ color: 'var(--text-muted)' }} />
                <input name="q" placeholder="Name, subject or curriculum level" style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem', background: 'transparent' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', borderRadius: 'var(--radius-lg)', fontSize: '1rem' }}>
                Find Tutor
              </button>
            </form>

            <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
              {highlights.slice(0, 3).map((item) => (
                <div key={item.label}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.value}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Floating UI Cards */}
          <div style={{ position: 'relative', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* Background Blob */}
            <div style={{
              position: 'absolute',
              width: '400px',
              height: '400px',
              background: 'var(--secondary)',
              filter: 'blur(80px)',
              opacity: 0.2,
              borderRadius: '50%',
              zIndex: 0
            }} />

            {/* Main Center Card (Upcoming Session) */}
            <div className="card" style={{
              position: 'absolute',
              width: '380px',
              padding: '1.5rem',
              zIndex: 2,
              boxShadow: 'var(--shadow-xl)',
              borderRadius: '1.5rem',
              border: '1px solid rgba(255,255,255,0.8)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              top: '50%',
              left: '45%',
              transform: 'translate(-50%, -50%)',
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>UPCOMING SESSION</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="avatar avatar-lg" style={{ background: 'var(--primary)', color: 'white' }}>AK</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Ahmed Khan</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Mathematics · O-Level</div>
                </div>
              </div>
              <div style={{ background: 'var(--background)', borderRadius: '0.75rem', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={14} /> Today · 4:00 PM
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>60 min · PKR 2,000</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary" style={{ flex: 1, padding: '0.6rem' }}>Reschedule</button>
                <button className="btn btn-primary" style={{ flex: 1, padding: '0.6rem' }}>Join Link</button>
              </div>
            </div>

            {/* Top Right Floating Card (Stats) */}
            <div className="card animate-fade-in" style={{
              position: 'absolute',
              top: '15%',
              right: '-5%',
              padding: '1.25rem',
              zIndex: 3,
              boxShadow: 'var(--shadow-lg)',
              borderRadius: '1.25rem',
              animationDelay: '0.2s'
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>SESSIONS THIS MONTH</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>12</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <TrendingUp size={14} /> +4 from last month
              </div>
            </div>

            {/* Bottom Left Floating Card (Match) */}
            <div className="animate-slide-up" style={{
              position: 'absolute',
              bottom: '10%',
              left: '-5%',
              zIndex: 3,
              background: 'var(--primary)',
              color: 'white',
              padding: '1rem 1.25rem',
              borderRadius: '1.25rem',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              animationDelay: '0.4s'
            }}>
              <div className="avatar" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>SQ</div>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '0.1rem' }}>New Match Found</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Sara Qureshi</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Star size={12} fill="currentColor" /> 4.8 · O-Level Maths
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Platform Value */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', fontWeight: 800 }}>Built for Academic Supremacy</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>A safer, smarter tutoring flow designed for definitive results.</p>
          </div>
          <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {featureCards.map((item) => (
              <div key={item.title} className="card card-hover" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '4rem', height: '4rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-50)', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', fontWeight: 700 }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Subjects */}
      <section className="section" style={{ background: 'var(--background)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', fontWeight: 800 }}>Explore Subjects</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Elite educators spanning all major curriculums.</p>
            </div>
            <Link href="/subjects" className="btn btn-secondary" style={{ borderRadius: '99px' }}>
              View All Directory <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {dummySubjects.map((subject) => (
              <SubjectCard key={subject.slug} {...subject} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Top Rated Tutors (Fixed Layout) */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', fontWeight: 800 }}>Premium Educators</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Learn directly from the highest-rated talent.</p>
            </div>
            <Link href="/find-tutor" className="btn btn-secondary" style={{ borderRadius: '99px' }}>
              Find More Tutors <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ 
            display: 'grid', 
            gap: '2rem', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
          }}>
            {dummyTutors.map((tutor) => (
              <TutorCard key={tutor.id} {...tutor} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA Banner */}
      <section style={{ padding: '4rem 0', background: 'var(--background)' }}>
        <div className="container">
          <div className="card" style={{
            background: 'var(--primary)',
            color: 'var(--text-inverse)',
            textAlign: 'center',
            padding: '4rem 2rem',
            borderRadius: '2rem',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.25rem', color: 'inherit', fontWeight: 800 }}>Elevate their academic trajectory</h2>
            <p style={{ opacity: 0.9, maxWidth: '650px', margin: '0 auto 2.5rem', fontSize: '1.15rem', lineHeight: 1.6 }}>
              Join hundreds of successful families utilizing Axis Tutors to instill profound conceptual clarity and guaranteed outcomes.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/register/student" className="btn btn-accent btn-lg" style={{ borderRadius: '99px', fontSize: '1rem', fontWeight: 700 }}>
                Register as Student
              </Link>
              <Link href="/register/tutor" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: '99px', fontSize: '1rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                Apply as a Tutor
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 980px) {
          .container > div[style*='grid-template-columns: minmax'] {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </>
  )
}
