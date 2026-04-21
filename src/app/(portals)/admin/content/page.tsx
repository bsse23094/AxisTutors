import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminContentPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: actor } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  const actorRole = (actor as { role?: string } | null)?.role
  if (actorRole !== 'admin') {
    redirect('/login')
  }

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, is_published, published_at, created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  const safePosts = (posts ?? []) as Array<{
    id: string
    title: string
    slug: string
    is_published?: boolean | null
    published_at?: string | null
  }>

  const publishedCount = safePosts.filter((post) => post.is_published).length
  const draftCount = safePosts.length - publishedCount

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Content</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Blog and knowledge content overview.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <div className="card" style={{ padding: '1rem' }}><strong>Total Posts:</strong> {safePosts.length}</div>
        <div className="card" style={{ padding: '1rem' }}><strong>Published:</strong> {publishedCount}</div>
        <div className="card" style={{ padding: '1rem' }}><strong>Drafts:</strong> {draftCount}</div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            {safePosts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.slug}</td>
                <td><span className={`badge ${post.is_published ? 'badge-success' : 'badge-warning'}`}>{post.is_published ? 'published' : 'draft'}</span></td>
                <td>{post.published_at ? new Date(post.published_at).toLocaleDateString('en-PK', { dateStyle: 'medium' }) : '-'}</td>
              </tr>
            ))}
            {!safePosts.length && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No posts yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
