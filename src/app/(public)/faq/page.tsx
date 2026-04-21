import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

export const metadata: Metadata = { title: 'FAQ' }

const faqSections = [
  {
    title: 'For Parents',
    items: [
      { q: 'How do I monitor my child\'s sessions?', a: 'As a parent, you have full visibility into your child\'s tutoring schedule through the calendar view. You can also read all chat messages between your child and their tutor (read-only access).' },
      { q: 'How does payment work?', a: 'When your child books a session, you will receive a notification to approve the booking and authorize payment. No session proceeds without your explicit approval.' },
      { q: 'Can I see the chat between my child and the tutor?', a: 'Yes! Parents have read-only access to all student-tutor conversations. You can view messages but cannot send any. You can also flag any message for admin review.' },
      { q: 'How are tutors verified?', a: 'Every tutor must submit their CNIC and educational certificates. Our team manually reviews each application within 24-48 hours before approval.' },
      { q: 'What if I\'m not satisfied with a session?', a: 'You can cancel upcoming sessions for a full refund (24+ hours before). If a session has completed and you\'re unsatisfied, contact support to file a dispute.' },
    ]
  },
  {
    title: 'For Students',
    items: [
      { q: 'How do I book a session?', a: 'Browse tutors using our search filters, pick one you like, select a subject and time slot, and confirm. Your parent will then approve and handle payment.' },
      { q: 'Can I message tutors before booking?', a: 'Chat rooms are created when you book your first session with a tutor. This prevents unsolicited contact and maintains a safe environment.' },
      { q: 'What subjects are available?', a: 'We offer 50+ subjects including Matric, FSc, O-Level, A-Level, and university curricula. Check our Subjects page for the full list.' },
      { q: 'Can I save my favorite tutors?', a: 'Yes! Use the bookmark icon on any tutor card to save them to your Saved Tutors list for easy access later.' },
      { q: 'How does Google Calendar sync work?', a: 'Connect your Google Calendar from the calendar page. Once connected, all confirmed sessions are automatically added to your Google Calendar with reminders.' },
    ]
  },
  {
    title: 'For Tutors',
    items: [
      { q: 'How do I get paid?', a: 'After a session is completed, the payment (minus our platform fee) is automatically released to your account. We support multiple payment methods.' },
      { q: 'Can I set my own rates?', a: 'Absolutely! You set your own hourly rate (minimum PKR 500). Any rate changes require admin approval to maintain pricing integrity.' },
      { q: 'How long does verification take?', a: 'Our team reviews applications within 24-48 hours. Make sure to upload clear copies of your degree/certificates and CNIC.' },
      { q: 'What is the platform commission?', a: 'We charge a 15% platform fee on each session. This covers payment processing, platform maintenance, and marketing to bring you students.' },
      { q: 'Can I cancel a session?', a: 'Yes, but tutor cancellations result in automatic full refunds for students and may affect your profile standing. Please use cancellations sparingly.' },
    ]
  },
  {
    title: 'Payments',
    items: [
      { q: 'What payment methods are accepted?', a: 'We are finalizing our payment integrations. The platform is designed to support JazzCash, EasyPaisa, and bank transfers.' },
      { q: 'When does payment happen?', a: 'Payment is authorized when a parent approves a booking. The funds are captured after the session is completed.' },
      { q: 'What is the refund policy?', a: 'Student cancels 24+ hours before: 100% refund. Student cancels <24 hours: no refund. Tutor cancels: 100% refund + tutor is flagged.' },
      { q: 'Are there any hidden charges?', a: 'No hidden charges. The tutor\'s listed hourly rate includes our platform fee. What you see is what you pay.' },
      { q: 'How do I get a receipt?', a: 'All transaction details are available in your parent dashboard under the Payments section. You can view and download receipts.' },
    ]
  },
  {
    title: 'Technical',
    items: [
      { q: 'What devices can I use?', a: 'Axis Tutors works on any modern web browser — desktop, tablet, or mobile. No app download required.' },
      { q: 'Is my data secure?', a: 'We use industry-standard encryption and secure authentication via Supabase. All sensitive data is encrypted at rest and in transit.' },
      { q: 'How do I reset my password?', a: 'Click "Forgot password?" on the login page. We\'ll send a password reset link to your registered email.' },
      { q: 'Can I delete my account?', a: 'Yes, contact support to request account deletion. All your personal data will be permanently removed within 30 days.' },
      { q: 'What if I face a technical issue?', a: 'Reach out to us via the Contact page or email support@axistutors.pk. We typically respond within 4 hours.' },
    ]
  },
]

export default function FAQPage() {
  return (
    <div className="container section">
      <div style={{ textAlign: 'center', marginBottom: '3.5rem', marginTop: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--primary-dark)', letterSpacing: '-0.02em' }}>Axis Tutors FAQ</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', fontWeight: 500 }}>Everything you need to know about navigating the platform</p>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        {faqSections.map(section => (
          <div key={section.title} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary)' }}>{section.title}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {section.items.map((item, i) => (
                <details key={i} className="card" style={{ padding: 0, cursor: 'pointer' }}>
                  <summary style={{
                    padding: '1rem 1.25rem', fontWeight: 600, fontSize: '0.9375rem',
                    color: 'var(--text-primary)', listStyle: 'none', display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    {item.q}
                    <ChevronDown size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  </summary>
                  <div style={{
                    padding: '0 1.25rem 1rem', fontSize: '0.875rem',
                    color: 'var(--text-secondary)', lineHeight: 1.7,
                    borderTop: '1px solid var(--border-light)',
                    paddingTop: '0.75rem',
                  }}>
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Still have questions?</p>
        <Link href="/contact" className="btn btn-primary">Contact Us</Link>
      </div>
    </div>
  )
}
