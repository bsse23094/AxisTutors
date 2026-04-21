import type { Metadata } from 'next'
import StatCard from '@/components/portal/StatCard'
import { DollarSign, TrendingUp, ArrowDownRight, CreditCard } from 'lucide-react'

export const metadata: Metadata = { title: 'Financials' }

export default function FinancialsPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Financials</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Platform revenue and financial overview</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="Total Revenue" value="PKR 2.4M" icon={<DollarSign size={20} />} color="#22C55E" change="+18% this quarter" changeType="positive" />
        <StatCard label="Platform Fees" value="PKR 361K" icon={<TrendingUp size={20} />} color="#1F8F62" change="15% commission" changeType="neutral" />
        <StatCard label="Tutor Payouts" value="PKR 2.04M" icon={<ArrowDownRight size={20} />} color="#3B82F6" />
        <StatCard label="Pending Refunds" value="PKR 8,400" icon={<CreditCard size={20} />} color="#F59E0B" />
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Transactions</h3>
        <div className="card" style={{ padding: 0, overflow: 'hidden', border: 'none', boxShadow: 'none' }}>
          <table className="data-table">
            <thead><tr><th>Date</th><th>Parent</th><th>Tutor</th><th>Amount</th><th>Fee</th><th>Status</th></tr></thead>
            <tbody>
              {[
                { date: 'Apr 20', parent: 'Amna Raza', tutor: 'Ahmed Khan', amount: 2000, fee: 300, status: 'captured' },
                { date: 'Apr 19', parent: 'Kamran Ali', tutor: 'Fatima Noor', amount: 1800, fee: 270, status: 'captured' },
                { date: 'Apr 19', parent: 'Amna Raza', tutor: 'Ahmed Khan', amount: 2000, fee: 300, status: 'authorized' },
                { date: 'Apr 18', parent: 'Sadia Malik', tutor: 'Hassan Ali', amount: 2500, fee: 375, status: 'refunded' },
              ].map((t, i) => (
                <tr key={i}>
                  <td>{t.date}</td>
                  <td>{t.parent}</td>
                  <td>{t.tutor}</td>
                  <td style={{ fontWeight: 600 }}>PKR {t.amount.toLocaleString()}</td>
                  <td style={{ color: 'var(--success)' }}>PKR {t.fee}</td>
                  <td><span className={`badge ${t.status === 'captured' ? 'badge-success' : t.status === 'authorized' ? 'badge-info' : 'badge-warning'}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
