import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return { title: `Blog ${slug}` }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, content, tags, published_at, created_at, is_published')
    .eq('slug', slug)
    .maybeSingle()

  if (!post || !post.is_published) {
    notFound()
  }

  const safePost = post as {
    title: string
    excerpt?: string | null
    content?: string | null
    tags?: string[] | null
    published_at?: string | null
    created_at: string
  }

  const publishDate = new Date(safePost.published_at ?? safePost.created_at).toLocaleDateString('en-PK', {
    dateStyle: 'medium',
  })

  return (
    <div className="container section" style={{ maxWidth: '860px' }}>
      <article className="card" style={{ padding: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{safePost.title}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '1rem' }}>{publishDate}</p>

        {!!safePost.tags?.length && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {safePost.tags.map((tag: string) => (
              <span key={tag} className="badge badge-primary">{tag}</span>
            ))}
          </div>
        )}

        {safePost.excerpt && (
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{safePost.excerpt}</p>
        )}

        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
          {safePost.content ?? 'Content coming soon.'}
        </div>
      </article>
    </div>
  )
}
