import { Trash2, Plus, Minus, UtensilsCrossed } from 'lucide-react'
import useCartStore from '../../store/cartStore'

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCartStore()
  const { product, quantity, itemSavings, hasDiscount, unitPrice } = item

  const handleMinus = () => {
    if (quantity === 1) {
      removeItem(item.id)
    } else {
      updateQuantity(item.id, quantity - 1)
    }
  }

  const handlePlus = () => {
    if (quantity < 20) {
      updateQuantity(item.id, quantity + 1)
    }
  }

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '0.75rem',
        marginBottom: '0.75rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #B2E8D6',
        display: 'flex',
        gap: '0.75rem',
        position: 'relative',
        opacity: product.isAvailable ? 1 : 0.6,
      }}
    >
      {/* Image */}
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          flexShrink: 0,
          backgroundColor: product.imageUrl ? 'transparent' : '#E8F8F3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <UtensilsCrossed size={40} style={{ color: '#B2E8D6' }} />
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {/* Name */}
        <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#033428', margin: 0 }}>
          {product.name}
        </h3>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {hasDiscount ? (
            <>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#9CA3AF',
                  textDecoration: 'line-through',
                }}
              >
                ₹{product.basePrice}
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#0D9E7E' }}>
                ₹{unitPrice}
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  backgroundColor: 'rgba(232, 160, 32, 0.1)',
                  color: '#E8A020',
                  borderRadius: '999px',
                  padding: '0.25rem 0.5rem',
                }}
              >
                Save ₹{itemSavings}
              </span>
            </>
          ) : (
            <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#033428' }}>
              ₹{unitPrice}
            </span>
          )}
        </div>

        {/* Quantity Controls */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            backgroundColor: '#E8F8F3',
            borderRadius: '0.75rem',
            padding: '0.25rem',
            width: 'fit-content',
            marginTop: 'auto',
          }}
        >
          <button
            onClick={handleMinus}
            disabled={!product.isAvailable}
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: product.isAvailable ? 'pointer' : 'not-allowed',
              color: quantity === 1 ? '#ef4444' : '#0D9E7E',
              opacity: product.isAvailable ? 1 : 0.5,
            }}
          >
            {quantity === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
          </button>

          <span
            style={{
              width: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#033428',
              fontSize: '0.875rem',
            }}
          >
            {quantity}
          </span>

          <button
            onClick={handlePlus}
            disabled={!product.isAvailable || quantity >= 20}
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              border: 'none',
              cursor:
                product.isAvailable && quantity < 20 ? 'pointer' : 'not-allowed',
              color:
                product.isAvailable && quantity < 20 ? '#0D9E7E' : '#D1D5DB',
            }}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Unavailable Overlay */}
      {!product.isAvailable && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <span
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              fontWeight: '600',
            }}
          >
            Unavailable
          </span>
          <button
            onClick={() => {}}
            style={{
              backgroundColor: 'transparent',
              color: '#ef4444',
              border: '1px solid #ef4444',
              padding: '0.25rem 0.75rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  )
}
