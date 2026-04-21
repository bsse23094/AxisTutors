import Link from 'next/link'

type PortalPlaceholderProps = {
  title: string
  description: string
  ctaHref?: string
  ctaLabel?: string
}

export default function PortalPlaceholder({
  title,
  description,
  ctaHref,
  ctaLabel,
}: PortalPlaceholderProps) {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{description}</p>
      </div>

      <div className="card" style={{ padding: '1.25rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: ctaHref && ctaLabel ? '0.875rem' : 0 }}>
          This module is now routed and ready for feature expansion.
        </p>
        {ctaHref && ctaLabel && (
          <Link href={ctaHref} className="btn btn-primary btn-sm">
            {ctaLabel}
          </Link>
        )}
      </div>
    </div>
  )
}
