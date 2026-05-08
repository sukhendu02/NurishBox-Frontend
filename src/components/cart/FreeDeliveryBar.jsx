import { Truck } from 'lucide-react'

export default function FreeDeliveryBar({ freeDeliveryIn, totalSavings }) {
  if (freeDeliveryIn <= 0) {
    return (
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          border: '1px solid #B2E8D6',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <Truck size={24} style={{ color: '#0D9E7E' }} />
        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0D9E7E' }}>
          🎉 You got free delivery!
        </span>
      </div>
    )
  }

  const progress = ((399 - freeDeliveryIn) / 399) * 100

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '0.75rem 1rem',
        marginBottom: '1rem',
        border: '1px solid #B2E8D6',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <Truck size={20} style={{ color: '#0D9E7E' }} />
        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#033428' }}>
          Add ₹{freeDeliveryIn} more for free delivery
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#E8F8F3',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: '#0D9E7E',
            borderRadius: '999px',
            transition: 'width 300ms ease-in-out',
          }}
        />
      </div>
    </div>
  )
}
