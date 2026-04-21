import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pricing' }

export default function PricingPage() {
  return (
    <div className="container section">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Simple, Transparent Pricing</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', maxWidth: '540px', margin: '0 auto' }}>
          Pay per session. No subscriptions, no hidden fees.
        </p>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* How billing works */}
        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>How Billing Works</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { step: '1', text: 'Student books a session at the tutor\'s posted hourly rate' },
              { step: '2', text: 'Parent receives a notification and approves the booking' },
              { step: '3', text: 'Payment is authorized (held, not charged yet)' },
              { step: '4', text: 'Session takes place' },
              { step: '5', text: 'Payment is captured and released to the tutor' },
            ].map(item => (
              <div key={item.step} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '1.75rem', height: '1.75rem', borderRadius: 'var(--radius-full)',
                  background: 'var(--primary)', color: 'white', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem',
                  fontWeight: 700, flexShrink: 0,
                }}>
                  {item.step}
                </div>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', paddingTop: '0.125rem' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Platform fee */}
        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem', background: 'var(--primary-50)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Platform Fee</h2>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            We charge a small <strong>15% service fee</strong> to maintain the platform. 
            This is included in the tutor&apos;s listed hourly rate — <strong>no hidden charges</strong> for parents or students.
          </p>
        </div>

        {/* Cancellation Policy */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Cancellation Policy</h2>
          <table className="data-table" style={{ borderRadius: 'var(--radius)' }}>
            <thead>
              <tr>
                <th>Scenario</th>
                <th>Refund</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Student cancels 24+ hours before</td>
                <td><span className="badge badge-success">100% refund</span></td>
              </tr>
              <tr>
                <td>Student cancels &lt;24 hours before</td>
                <td><span className="badge badge-error">No refund</span></td>
              </tr>
              <tr>
                <td>Tutor cancels</td>
                <td><span className="badge badge-success">100% refund + tutor flagged</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
