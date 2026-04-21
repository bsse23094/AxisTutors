import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Blog' }

const fallbackPosts = [
  { title: '10 Tips to Help Your Child Excel in Board Exams', slug: 'tips-board-exams', excerpt: 'Board exam season can be stressful. Here are proven strategies to help your child prepare effectively and score top marks.', tags: ['Study Tips', 'Board Exams'], date: 'Apr 15, 2026', cover: '📚' },
  { title: 'Why Online Tutoring is the Future of Education in Pakistan', slug: 'online-tutoring-future', excerpt: 'The landscape of education is changing rapidly. Discover why online tutoring is proving more effective than traditional methods.', tags: ['Online Learning', 'Pakistan'], date: 'Apr 10, 2026', cover: '💻' },
  { title: 'A Parent\'s Guide to Choosing the Right Tutor', slug: 'parents-guide-choosing-tutor', excerpt: 'Not all tutors are created equal. Learn what to look for when selecting a tutor for your child\'s specific needs.', tags: ['Parents', 'Guide'], date: 'Apr 5, 2026', cover: '👨‍👧' },
  { title: 'How to Prepare for O-Level Mathematics', slug: 'prepare-o-level-maths', excerpt: 'O-Level Mathematics requires a structured approach. Here\'s a comprehensive guide to acing your CIE exam.', tags: ['O-Level', 'Mathematics'], date: 'Mar 28, 2026', cover: '📐' },
  { title: 'The Benefits of One-on-One Tutoring vs Group Classes', slug: 'one-on-one-vs-group', excerpt: 'Research shows individual tutoring can be 2x more effective. We break down when each option makes sense.', tags: ['Research', 'Learning'], date: 'Mar 20, 2026', cover: '🎯' },
  { title: 'Building Study Habits That Last', slug: 'study-habits', excerpt: 'Good study habits are the foundation of academic success. Learn how to build routines that stick.', tags: ['Study Tips', 'Habits'], date: 'Mar 15, 2026', cover: '⏰' },
]

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: dbPosts } = await supabase
    .from('blog_posts')
    .select('title, slug, excerpt, tags, published_at, created_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(20)

  const typedDbPosts = (dbPosts ?? []) as Array<{
    title: string
    slug: string
    excerpt: string | null
    tags: string[] | null
    published_at: string | null
    created_at: string
  }>

  const posts =
    typedDbPosts.length > 0
      ? typedDbPosts.map((post) => ({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? 'Read the full story on Axis Tutors Blog.',
          tags: post.tags ?? [],
          date: new Date(post.published_at ?? post.created_at).toLocaleDateString('en-PK', {
            dateStyle: 'medium',
          }),
          cover: '📝',
        }))
      : fallbackPosts

  return (
    <div className="container section">
      <div style={{ textAlign: 'center', marginBottom: '3.5rem', marginTop: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--primary-dark)', letterSpacing: '-0.02em' }}>Axis Tutors Blog</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', fontWeight: 500 }}>Premium insights, guides, and updates for students and parents</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        {posts.map(post => (
          <article key={post.slug} className="card card-hover" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{
              height: '180px', background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem',
            }}>
              {post.cover}
            </div>
            <div style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.75rem' }}>
                {post.tags.map(tag => (
                  <span key={tag} className="badge badge-primary">{tag}</span>
                ))}
              </div>
              <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                <Link href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {post.title}
                </Link>
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                {post.excerpt}
              </p>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{post.date}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
