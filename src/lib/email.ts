import { Resend } from 'resend'
import { isGmailConfigured, sendViaGmail } from '@/lib/gmail'

const FROM = 'Axis Tutors <noreply@axistutors.pk>'

type SendEmailArgs = {
  to: string
  subject: string
  html: string
}

async function sendEmail({ to, subject, html }: SendEmailArgs) {
  if (isGmailConfigured()) {
    return sendViaGmail({
      to,
      subject,
      html,
      fromName: process.env.NEXT_PUBLIC_APP_NAME ?? 'Axis Tutors',
    })
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    console.warn('Email skipped: RESEND_API_KEY is not configured')
    return { data: null, error: 'RESEND_API_KEY is not configured' }
  }

  const resend = new Resend(resendKey)

  return resend.emails.send({
    from: FROM,
    to,
    subject,
    html,
  })
}

export const emails = {
  async tutorApproved(to: string, name: string) {
    return sendEmail({
      to,
      subject: 'Your Axis Tutors application has been approved!',
      html: `<p>Hi ${name},</p><p>Congratulations! Your application has been approved. You can now log in and start receiving bookings.</p><p>— The Axis Tutors Team</p>`
    })
  },

  async sessionBookingPendingParent(to: string, parentName: string, studentName: string, tutorName: string, subject: string, date: string, amount: string) {
    return sendEmail({
      to,
      subject: `Action required: Approve ${studentName}'s tutoring session`,
      html: `<p>Hi ${parentName},</p><p>${studentName} has requested a tutoring session:</p>
             <ul><li>Tutor: ${tutorName}</li><li>Subject: ${subject}</li><li>Date: ${date}</li><li>Amount: PKR ${amount}</li></ul>
             <p>Please log in to approve and pay.</p><p>— The Axis Tutors Team</p>`
    })
  },

  async sessionConfirmed(to: string, name: string, subject: string, date: string, link: string) {
    return sendEmail({
      to,
      subject: `Session confirmed: ${subject} on ${date}`,
      html: `<p>Hi ${name},</p><p>Your session has been confirmed.</p>
             <p><strong>Subject:</strong> ${subject}<br><strong>Date:</strong> ${date}</p>
             <p><a href="${link}">View session details</a></p><p>— The Axis Tutors Team</p>`
    })
  },

  async sessionCompleted(to: string, name: string, subject: string, date: string, link: string) {
    return sendEmail({
      to,
      subject: `Session completed: ${subject} on ${date}`,
      html: `<p>Hi ${name},</p><p>Your tutoring session has been marked as completed.</p>
             <p><strong>Subject:</strong> ${subject}<br><strong>Date:</strong> ${date}</p>
             <p><a href="${link}">View session details</a></p><p>— The Axis Tutors Team</p>`
    })
  },

  async sessionCancelledByTutor(to: string, studentName: string, tutorName: string, date: string) {
    return sendEmail({
      to,
      subject: `Session cancellation notice`,
      html: `<p>Hi ${studentName},</p><p>Unfortunately ${tutorName} has cancelled your session on ${date}. You will receive a full refund. We apologise for the inconvenience.</p><p>— The Axis Tutors Team</p>`
    })
  },

  async parentLinkRequest(to: string, studentName: string, parentName: string, approveUrl: string) {
    return sendEmail({
      to,
      subject: `${parentName} wants to link to your account`,
      html: `<p>Hi ${studentName},</p>
             <p>${parentName} has requested to be linked as your parent/guardian on Axis Tutors. This gives them read-only access to your sessions and chat.</p>
             <p><a href="${approveUrl}">Approve this request</a></p><p>— The Axis Tutors Team</p>`
    })
  },

  async newTutorApplication(to: string, tutorName: string, tutorEmail: string) {
    return sendEmail({
      to,
      subject: `New tutor application: ${tutorName}`,
      html: `<p>A new tutor application is waiting for review.</p>
             <p>Name: ${tutorName}<br>Email: ${tutorEmail}</p>
             <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/users/tutors">Review application</a></p>`
    })
  },

  async supportContact(to: string, name: string, email: string, inquiryType: string, message: string) {
    return sendEmail({
      to,
      subject: `New contact inquiry: ${inquiryType}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
             <p><strong>Message:</strong></p>
             <p>${message.replace(/\n/g, '<br/>')}</p>`
    })
  }
}
