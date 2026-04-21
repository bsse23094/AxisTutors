import Link from 'next/link'

export default function RoleSelector() {
  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <Link href="/register/student" className="btn btn-primary">Register as Student</Link>
      <Link href="/register/tutor" className="btn btn-secondary">Register as Tutor</Link>
      <Link href="/register/parent" className="btn btn-secondary">Register as Parent</Link>
    </div>
  )
}
