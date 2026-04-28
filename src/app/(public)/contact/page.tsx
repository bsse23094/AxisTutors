import type { Metadata } from 'next'
import { Mail, Clock, Send } from 'lucide-react'

export const metadata: Metadata = { title: 'Contact Us' }

export default function ContactPage() {
  return (
    <div className="container section">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Get in Touch</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>We&apos;re here to help. Reach out with questions, feedback, or support needs.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', maxWidth: '900px', margin: '0 auto' }}>
        {/* Contact Form */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Send a Message</h2>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label">Your Name</label>
              <input className="input" placeholder="Enter your name" />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input className="input" type="email" placeholder="you@example.com" />
            </div>
            <div>
              <label className="label">Inquiry Type</label>
              <select className="select">
                <option value="">Select a category</option>
                <option>General Question</option>
                <option>Technical Support</option>
                <option>Payment Issue</option>
                <option>Tutor Application</option>
                <option>Report a Concern</option>
                <option>Partnership Inquiry</option>
              </select>
            </div>
            <div>
              <label className="label">Message</label>
              <textarea className="input" rows={5} placeholder="How can we help you?" style={{ resize: 'vertical' }} />
            </div>
            <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
              <Send size={16} /> Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div>
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius)', background: 'var(--primary-50)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Email Support</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>support@axistutors.com</div>
              </div>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Best for detailed questions and documentation.</p>
          </div>

          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius)', background: '#DCFCE7', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Response Time</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Within 4 hours</div>
              </div>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Our support team responds quickly during business hours (9 AM - 9 PM EST).</p>
          </div>

          <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, var(--primary-50), #F0FDFB)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Emergency?</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              If you have an urgent concern about student safety or need immediate assistance, 
              WhatsApp us at <strong>+92 320 4307493</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
