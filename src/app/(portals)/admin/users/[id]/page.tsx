import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type Props = {
  params: Promise<{ id: string }>
}

export default async function AdminUserDetailPage({ params }: Props) {
  const { id } = await params
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

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, phone, city, province, country, created_at, is_active')
    .eq('id', id)
    .maybeSingle()

  if (!profile) {
    notFound()
  }

  const safeProfile = profile as {
    full_name?: string | null
    email?: string | null
    role?: string | null
    is_active?: boolean | null
    phone?: string | null
    city?: string | null
    province?: string | null
    country?: string | null
    created_at?: string | null
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>User Detail</h1>
      <div className="card" style={{ padding: '1rem' }}>
        <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.875rem' }}>
          <div><strong>Name:</strong> {safeProfile.full_name ?? '-'}</div>
          <div><strong>Email:</strong> {safeProfile.email ?? '-'}</div>
          <div><strong>Role:</strong> {safeProfile.role ?? '-'}</div>
          <div><strong>Status:</strong> {safeProfile.is_active ? 'Active' : 'Disabled'}</div>
          <div><strong>Phone:</strong> {safeProfile.phone ?? '-'}</div>
          <div><strong>Location:</strong> {[safeProfile.city, safeProfile.province, safeProfile.country].filter(Boolean).join(', ') || '-'}</div>
          <div><strong>Joined:</strong> {safeProfile.created_at ? new Date(safeProfile.created_at).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}</div>
        </div>
      </div>
    </div>
  )
}
