import { ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function EmptyCart() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <ShoppingCart size={80} style={{ color: '#B2E8D6', marginBottom: '1.5rem' }} />

      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#033428', margin: '0 0 0.5rem 0' }}>
        Your cart is empty
      </h2>

      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', margin: '0 0 2rem 0' }}>
        Add healthy meals to get started
      </p>

      <button
        onClick={() => navigate('/explore')}
        style={{
          backgroundColor: '#0D9E7E',
          color: 'white',
          border: 'none',
          borderRadius: '1rem',
          padding: '0.75rem 2rem',
          fontSize: '0.875rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 200ms',
        }}
      >
        Explore Menu
      </button>
    </div>
  )
}
