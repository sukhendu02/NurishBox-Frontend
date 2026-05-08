import { useEffect, useState } from 'react'
import useCartStore from '../store/cartStore'

// import CartItem from '../components/cart/CartItem.jsx'
import CartSummary from '../components/cart/CartSummary'
import EmptyCart from '../components/cart/EmptyCart'
import FreeDeliveryBar from '../components/cart/FreeDeliveryBar'

function SkeletonCartItem() {
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '0.75rem',
        marginBottom: '0.75rem',
        display: 'flex',
        gap: '0.75rem',
        animation: 'pulse 2s infinite',
        border: '1px solid #E5E7EB',
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '0.75rem',
          backgroundColor: '#F3F4F6',
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ height: '12px', backgroundColor: '#E5E7EB', borderRadius: '0.25rem', width: '70%' }} />
        <div style={{ height: '12px', backgroundColor: '#E5E7EB', borderRadius: '0.25rem', width: '50%' }} />
        <div style={{ height: '32px', backgroundColor: '#E5E7EB', borderRadius: '0.5rem', width: '60%', marginTop: 'auto' }} />
      </div>
    </div>
  )
}

export default function Cart() {
  const { items, itemCount, subtotal, totalSavings, deliveryFee, totalAmount, freeDeliveryIn, isLoading, fetchCart, clearCart } = useCartStore()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  useEffect(() => {
    fetchCart()
  }, [])

  const handleClearCart = async () => {
    await clearCart()
    setShowClearConfirm(false)
  }

  return (
    <div style={{ paddingTop: '4rem', paddingBottom: '10rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Add spin animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{ maxWidth: '430px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#033428', margin: 0 }}>
              My Cart
            </h1>
            {itemCount > 0 && (
              <span
                style={{
                  backgroundColor: '#0D9E7E',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  borderRadius: '999px',
                  padding: '0.25rem 0.75rem',
                  minWidth: '1.5rem',
                  textAlign: 'center',
                }}
              >
                {itemCount}
              </span>
            )}
          </div>

          {itemCount > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              style={{
                backgroundColor: 'transparent',
                color: '#ef4444',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Clear All
            </button>
          )}
        </div>

        {/* Clear Confirmation Dialog */}
        {showClearConfirm && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'flex-end',
              zIndex: 50,
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderTopLeftRadius: '1.5rem',
                borderTopRightRadius: '1.5rem',
                padding: '1.5rem',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <h2 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#033428', margin: 0 }}>
                Are you sure?
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
                This will remove all items from your cart.
              </p>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  style={{
                    flex: 1,
                    backgroundColor: '#E8F8F3',
                    color: '#0D9E7E',
                    border: 'none',
                    borderRadius: '0.75rem',
                    padding: '0.75rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearCart}
                  style={{
                    flex: 1,
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.75rem',
                    padding: '0.75rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && items.length === 0 ? (
          <div style={{ marginBottom: '2rem' }}>
            {[1, 2, 3].map((i) => (
              <SkeletonCartItem key={i} />
            ))}
          </div>
        ) : itemCount === 0 ? (
          /* Empty State */
          <EmptyCart />
        ) : (
          /* Cart Items */
          <div style={{ marginBottom: '2rem' }}>
            {/* Free Delivery Bar */}
            {freeDeliveryIn > 0 && (
              <FreeDeliveryBar freeDeliveryIn={freeDeliveryIn} totalSavings={totalSavings} />
            )}
            {deliveryFee === 0 && freeDeliveryIn <= 0 && (
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  padding: '0.75rem 1rem',
                  marginBottom: '1rem',
                  border: '1px solid #B2E8D6',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0D9E7E' }}>
                  🎉 You got free delivery!
                </span>
              </div>
            )}

            {/* Cart Items */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cart Summary */}
      {itemCount > 0 && (
        <CartSummary
          subtotal={subtotal}
          totalSavings={totalSavings}
          deliveryFee={deliveryFee}
          totalAmount={totalAmount}
          itemCount={itemCount}
        />
      )}
    </div>
  )
}
