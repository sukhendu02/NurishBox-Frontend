import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, AlertCircle, Clock } from 'lucide-react'
import useCartStore from '../../store/cartStore'
import useOrderStore from '../../store/orderStore'

const TOAST_COLOR = { success: '#0D9E7E', error: '#ef4444', warning: '#f59e0b' }

export default function CheckoutOverlay() {
 const navigate = useNavigate()

  const checkoutStatus = useOrderStore((s) => s.checkoutStatus)
  const error          = useOrderStore((s) => s.error)
  const currentOrder   = useOrderStore((s) => s.currentOrder)
  const resetCheckout  = useOrderStore((s) => s.resetCheckout)

  useEffect(() => {
    if (checkoutStatus !== 'success') return
    const timer = setTimeout(() => {
      useCartStore.getState().fetchCart()
      useOrderStore.getState().resetCheckout()
      navigate('/account/orders')
    }, 2500)
    return () => clearTimeout(timer)
  }, [checkoutStatus])

  if (!checkoutStatus || checkoutStatus === 'idle') return null

  return createPortal(
    <div style={styles.backdrop}>
      <style>{`
        @keyframes scaleIn {
          0%   { transform: scale(0);   opacity: 0 }
          70%  { transform: scale(1.1); opacity: 1 }
          100% { transform: scale(1);   opacity: 1 }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      {checkoutStatus === 'loading' && <LoadingState />}
      {checkoutStatus === 'success' && <SuccessState />}
      {checkoutStatus === 'failed' && (
        <FailedState error={error} resetCheckout={resetCheckout} />
      )}
      {checkoutStatus === 'pending' && (
        <PendingState
          onViewOrder={() => {
            fetchCart()
            navigate(`/account/orders/${currentOrder?.id}`)
            resetCheckout()
          }}
        />
      )}
    </div>,
    document.body
  )
}

// ─── Sub-components ───────────────────────────────────────────────

function LoadingState() {
  return (
    <>
      <div style={styles.spinnerRing} />
      <p style={styles.title}>Processing your order...</p>
      <p style={styles.subtitle}>Hang tight! Do not refresh or press back</p>
    </>
  )
}

function SuccessState() {
  return (
    <>
      <div style={{ ...styles.iconCircle, backgroundColor: '#E8F8F3', borderColor: '#0D9E7E', animation: 'scaleIn 0.35s ease-out forwards' }}>
        <CheckCircle size={48} color="#0D9E7E" />
      </div>
      <p style={styles.title}>Order Placed! 🎉</p>
      <p style={styles.subtitle}>Your order has been confirmed</p>
    </>
  )
}

function FailedState({ error, resetCheckout }) {
  return (
    <>
      <div style={{ ...styles.iconCircle, backgroundColor: '#fee2e2', borderColor: '#f87171', animation: 'scaleIn 0.35s ease-out forwards' }}>
        <AlertCircle size={48} color="#ef4444" />
      </div>
      <p style={styles.title}>Payment Failed</p>
      <p style={{ ...styles.subtitle, color: '#ef4444' }}>{error}</p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', width: '100%' }}>
        <button onClick={resetCheckout} style={styles.primaryBtn('#0D9E7E')}>
          Try Again
        </button>
        <button onClick={resetCheckout} style={styles.ghostBtn}>
          Go Back
        </button>
      </div>
    </>
  )
}

function PendingState({ onViewOrder }) {
  return (
    <>
      <div style={{ ...styles.iconCircle, backgroundColor: '#fef3c7', borderColor: '#fbbf24', animation: 'scaleIn 0.35s ease-out forwards' }}>
        <Clock size={48} color="#f59e0b" />
      </div>
      <p style={styles.title}>Payment Pending</p>
      <p style={styles.subtitle}>Awaiting payment confirmation</p>
      <button onClick={onViewOrder} style={{ ...styles.primaryBtn('#f59e0b'), marginTop: '2rem' }}>
        View Order
      </button>
    </>
  )
}

// ─── Styles ───────────────────────────────────────────────────────

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 2rem',
    textAlign: 'center',
    zIndex: 9999,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: '50%',
    borderWidth: 4,
    borderStyle: 'solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerRing: {
    width: 96,
    height: 96,
    borderRadius: '50%',
    borderWidth: 4,
    borderStyle: 'solid',
    borderColor: '#E8F8F3',
    borderTopColor: '#0D9E7E',
    animation: 'spin 1s linear infinite',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 900,
    color: '#033428',
    marginTop: '1.5rem',
    marginBottom: 0,
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#9CA3AF',
    fontWeight: 500,
    marginTop: '0.5rem',
  },
  primaryBtn: (bg) => ({
    flex: 1,
    backgroundColor: bg,
    color: 'white',
    border: 'none',
    borderRadius: '1rem',
    padding: '0.875rem 2rem',
    fontSize: '0.875rem',
    fontWeight: 700,
    cursor: 'pointer',
  }),
  ghostBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    color: '#9CA3AF',
    border: 'none',
    fontSize: '0.875rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
}