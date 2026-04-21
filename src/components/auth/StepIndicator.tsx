'use client'

import { Check } from 'lucide-react'

interface StepIndicatorProps {
  steps: string[]
  currentStep: number
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div className="step-indicator" style={{ justifyContent: 'center' }}>
        {steps.map((step, index) => (
          <div key={step} style={{ display: 'contents' }}>
            {index > 0 && (
              <div
                className={`step-line ${index <= currentStep ? 'completed' : ''}`}
                style={{ maxWidth: '6rem' }}
              />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
              <div className={`step-dot ${index === currentStep ? 'active' : index < currentStep ? 'completed' : ''}`}>
                {index < currentStep ? <Check size={14} /> : index + 1}
              </div>
              <span style={{
                fontSize: '0.6875rem',
                fontWeight: index === currentStep ? 600 : 400,
                color: index <= currentStep ? 'var(--primary)' : 'var(--text-muted)',
                whiteSpace: 'nowrap',
              }}>
                {step}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
