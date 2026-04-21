type HowItWorksStepProps = {
  step: number
  title: string
  description: string
}

export default function HowItWorksStep({ step, title, description }: HowItWorksStepProps) {
  return (
    <div className="card" style={{ padding: '1rem' }}>
      <div className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Step {step}</div>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.375rem' }}>{title}</h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{description}</p>
    </div>
  )
}
