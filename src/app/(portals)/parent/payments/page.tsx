import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { DollarSign, Calendar, CreditCard } from 'lucide-react'
import StatCard from '@/components/portal/StatCard'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Payments' }

export default async function ParentPaymentsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('id, session_id, tutor_id, amount, status, created_at')
    .eq('parent_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    return (
      <div className="card" style={{ padding: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Payments</h1>
        <p style={{ color: 'var(--error)', fontSize: '0.875rem' }}>{error.message}</p>
      </div>
    )
  }

  const sessionIds = Array.from(
    new Set((transactions ?? []).map((transaction) => transaction.session_id).filter(Boolean))
  ) as string[]
  const tutorIds = Array.from(new Set((transactions ?? []).map((transaction) => transaction.tutor_id).filter(Boolean))) as string[]

  const [{ data: sessions }, { data: tutors }] = await Promise.all([
    sessionIds.length
      ? supabase.from('sessions').select('id, subject_id').in('id', sessionIds)
      : Promise.resolve({ data: [], error: null }),
    tutorIds.length
      ? supabase.from('profiles').select('id, full_name').in('id', tutorIds)
      : Promise.resolve({ data: [], error: null }),
  ])

  const subjectIds = Array.from(
    new Set((sessions ?? []).map((session) => session.subject_id).filter(Boolean))
  ) as string[]
  const { data: subjects } = subjectIds.length
    ? await supabase.from('subjects').select('id, name').in('id', subjectIds)
    : { data: [] as Array<{ id: string; name: string }> }

  const sessionMap = new Map((sessions ?? []).map((row) => [row.id, row]))
  const tutorMap = new Map((tutors ?? []).map((row) => [row.id, row.full_name]))
  const subjectMap = new Map((subjects ?? []).map((row) => [row.id, row.name]))

  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const thisMonthTotal = (transactions ?? [])
    .filter((transaction) => new Date(transaction.created_at) >= currentMonthStart)
    .reduce((total, transaction) => total + Number(transaction.amount ?? 0), 0)

  const totalSpent = (transactions ?? []).reduce(
    (total, transaction) => total + Number(transaction.amount ?? 0),
    0
  )
  const sessionsPaid = (transactions ?? []).filter(
    (transaction) => transaction.status === 'captured' || transaction.status === 'authorized'
  ).length

  return (
    <div>
      <div style={{ marginBottom: '3rem', marginTop: '1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-dark)', letterSpacing: '-0.02em' }}>Axis Tutors Payments</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500, marginTop: '0.25rem' }}>Manage payments for your child's sessions</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="This Month" value={formatCurrency(thisMonthTotal)} icon={<DollarSign size={20} />} color="var(--accent)" />
        <StatCard label="Total Spent" value={formatCurrency(totalSpent)} icon={<CreditCard size={20} />} color="var(--primary)" />
        <StatCard label="Sessions Paid" value={String(sessionsPaid)} icon={<Calendar size={20} />} color="var(--primary-dark)" />
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Payment History</h3>
        <div className="card" style={{ padding: 0, overflow: 'hidden', border: 'none', boxShadow: 'none' }}>
          <table className="data-table">
            <thead><tr><th>Date</th><th>Tutor</th><th>Subject</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {!transactions?.length ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    No payment records yet.
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => {
                  const session = sessionMap.get(transaction.session_id ?? '')
                  const subjectName = session?.subject_id
                    ? subjectMap.get(session.subject_id) ?? 'General'
                    : 'General'

                  return (
                    <tr key={transaction.id}>
                      <td>{formatDate(transaction.created_at)}</td>
                      <td style={{ fontWeight: 500 }}>{tutorMap.get(transaction.tutor_id ?? '') ?? 'Tutor'}</td>
                      <td>{subjectName}</td>
                      <td style={{ fontWeight: 600 }}>{formatCurrency(Number(transaction.amount ?? 0))}</td>
                      <td>
                        <span
                          className={`badge ${
                            transaction.status === 'captured'
                              ? 'badge-success'
                              : transaction.status === 'refunded'
                                ? 'badge-warning'
                                : transaction.status === 'failed'
                                  ? 'badge-error'
                                  : 'badge-info'
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
