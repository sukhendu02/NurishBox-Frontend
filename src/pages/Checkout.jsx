import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ChevronDown, CreditCard, Banknote, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Clock } from 'lucide-react'
import useCartStore from '../store/cartStore'
import useUserStore from '../store/userStore'
import useOrderStore from '../store/orderStore'

export default function Checkout({ onClose }) {
  const navigate = useNavigate()
  const { items, itemCount, subtotal, totalSavings, deliveryFee, totalAmount, fetchCart } = useCartStore()
  const { addresses } = useUserStore()
  const {
    placeOrderAction,
    verifyPaymentAction,
    currentOrder,
    checkoutStatus,
    resetCheckout,
    error,
  } = useOrderStore()

  const [selectedMethod, setSelectedMethod] = useState('COD')
  const [specialInstr, setSpecialInstr] = useState('')
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    if (checkoutStatus === 'success') {
      setTimeout(() => {
        fetchCart()
        navigate(`/orders/${currentOrder.id}`)
        onClose()
      }, 1500)
    }
  }, [checkoutStatus])

  const defaultAddress = addresses.find((addr) => addr.isDefault)

  const handlePlaceOrder = async () => {
    if (!defaultAddress) {
      alert('Please set a delivery address')
      return
    }

    const idemKey = crypto.randomUUID()
    const payload = {
      addressId: defaultAddress.id,
      paymentMethod: selectedMethod,
      ...(specialInstr ? { specialInstructions: specialInstr } : {}),
    }

    if (selectedMethod === 'COD') {
      await placeOrderAction(payload, idemKey)
      return
    }

    // Razorpay
    const orderData = await placeOrderAction(payload, idemKey)
    if (!orderData) return

    const options = {
      key: orderData.keyId,
      amount: Math.round(orderData.amount * 100),
      currency: orderData.currency || 'INR',
      name: 'NurishBox',
      description: `Order ${orderData.order.orderNumber}`,
      order_id: orderData.razorpayOrderId,

      handler: async (response) => {
        await verifyPaymentAction({
          orderId: orderData.order.id,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        })
      },

      modal: {
        ondismiss: () => {
          // User closed Razorpay
        },
      },

      prefill: {
        name: defaultAddress.line1,
        contact: '',
        email: '',
      },

      theme: { color: '#0D9E7E' },
    }

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options)
      rzp.open()
    }
  }

  // ──────────────────────────────────────────────────────
  // OVERLAY STATES
  // ──────────────────────────────────────────────────────
  if (checkoutStatus && checkoutStatus !== 'idle') {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: '2rem',
          paddingRight: '2rem',
          textAlign: 'center',
          zIndex: 100,
        }}
      >
        <style>{`
          @keyframes scaleIn {
            0%   { transform: scale(0);   opacity: 0 }
            70%  { transform: scale(1.1); opacity: 1 }
            100% { transform: scale(1);   opacity: 1 }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-scale-in { animation: scaleIn 0.35s ease-out forwards }
          .animate-spin { animation: spin 1s linear infinite }
        `}</style>

        {checkoutStatus === 'loading' && (
          <>
            <div
              style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                borderWidth: '4px',
                borderStyle: 'solid',
                borderColor: '#E8F8F3',
                borderTopColor: '#0D9E7E',
                animation: 'spin 1s linear infinite',
              }}
            />
            <p style={{ fontSize: '1.125rem', fontWeight: '900', color: '#033428', marginTop: '1.5rem', margin: 0 }}>
              Processing your order...
            </p>
            <p style={{ fontSize: '0.875rem', color: '#9CA3AF', fontWeight: '500', marginTop: '0.5rem' }}>
              Hang tight! Do not refresh or press back button
            </p>
          </>
        )}

        {checkoutStatus === 'success' && (
          <>
            <div
              style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                backgroundColor: '#E8F8F3',
                borderWidth: '4px',
                borderStyle: 'solid',
                borderColor: '#0D9E7E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'scaleIn 0.35s ease-out forwards',
              }}
            >
              <CheckCircle size={48} style={{ color: '#0D9E7E' }} />
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: '900', color: '#033428', marginTop: '1.5rem', margin: 0 }}>
              Order Placed! 🎉
            </p>
            <p style={{ fontSize: '0.875rem', color: '#9CA3AF', fontWeight: '500', marginTop: '0.5rem' }}>
              Your order has been confirmed
            </p>
          </>
        )}

        {checkoutStatus === 'failed' && (
          <>
            <div
              style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                backgroundColor: '#fee2e2',
                borderWidth: '4px',
                borderStyle: 'solid',
                borderColor: '#f87171',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'scaleIn 0.35s ease-out forwards',
              }}
            >
              <AlertCircle size={48} style={{ color: '#ef4444' }} />
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: '900', color: '#033428', marginTop: '1.5rem', margin: 0 }}>
              Payment Failed
            </p>
            <p style={{ fontSize: '0.875rem', color: '#ef4444', fontWeight: '500', marginTop: '0.5rem' }}>
              {error}
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', width: '100%' }}>
              <button
                onClick={() => {
                  resetCheckout()
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#0D9E7E',
                  color: 'white',
                  border: 'none',
                  borderRadius: '1rem',
                  paddingTop: '0.875rem',
                  paddingBottom: '0.875rem',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  resetCheckout()
                  onClose()
                }}
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Go Back
              </button>
            </div>
          </>
        )}

        {checkoutStatus === 'pending' && (
          <>
            <div
              style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                backgroundColor: '#fef3c7',
                borderWidth: '4px',
                borderStyle: 'solid',
                borderColor: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'scaleIn 0.35s ease-out forwards',
              }}
            >
              <Clock size={48} style={{ color: '#f59e0b' }} />
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: '900', color: '#033428', marginTop: '1.5rem', margin: 0 }}>
              Payment Pending
            </p>
            <p style={{ fontSize: '0.875rem', color: '#9CA3AF', fontWeight: '500', marginTop: '0.5rem' }}>
              Your order is awaiting payment confirmation
            </p>

            <button
              onClick={() => {
                fetchCart()
                navigate(`/orders/${currentOrder.id}`)
                onClose()
              }}
              style={{
                marginTop: '2rem',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '1rem',
                paddingLeft: '2rem',
                paddingRight: '2rem',
                paddingTop: '0.875rem',
                paddingBottom: '0.875rem',
                fontSize: '0.875rem',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              View Order
            </button>
          </>
        )}
      </div>
    )
  }

  // ──────────────────────────────────────────────────────
  // CHECKOUT SHEET
  // ──────────────────────────────────────────────────────
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 40,
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderTopLeftRadius: '1.5rem',
          borderTopRightRadius: '1.5rem',
          boxShadow: '0 -20px 60px rgba(0, 0, 0, 0.3)',
          zIndex: 50,
          maxWidth: '430px',
          marginLeft: 'auto',
          marginRight: 'auto',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Drag Handle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '0.75rem', paddingBottom: '0.5rem' }}>
          <div
            style={{
              width: '40px',
              height: '4px',
              backgroundColor: '#D1D5DB',
              borderRadius: '999px',
            }}
          />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem 1rem 1rem' }}>
          <h1 style={{ fontSize: '1.125rem', fontWeight: '900', color: '#033428', margin: 0 }}>
            Confirm Order
          </h1>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
            }}
          >
            <X size={24} style={{ color: '#9CA3AF' }} />
          </button>
        </div>

        {/* Order Summary */}
        <div style={{ margin: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '1rem', border: '1px solid #E8F8F3', cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#033428' }}>
              {itemCount} items · ₹{totalAmount}
            </span>
            <ChevronDown size={18} style={{ color: '#9CA3AF', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms' }} />
          </div>

          {expanded && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #E8F8F3', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '500' }}>
                  <span>{item.product.name}</span>
                  <span>
                    {item.quantity} × ₹{item.unitPrice} = ₹{item.itemTotal}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delivery Address */}
        {defaultAddress ? (
          <div style={{ margin: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '1rem', border: '1px solid #E8F8F3' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span>📍</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '900', backgroundColor: '#E8F8F3', color: '#0D9E7E', padding: '0.25rem 0.5rem', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {defaultAddress.label}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#033428', margin: '0 0 0.25rem 0' }}>
              {defaultAddress.line1}
              {defaultAddress.line2 && `, ${defaultAddress.line2}`}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#9CA3AF', margin: 0 }}>
              {defaultAddress.city}, {defaultAddress.state} {defaultAddress.pincode}
            </p>
          </div>
        ) : (
          <div style={{ margin: '1rem', padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '1rem', border: '1px solid #fecaca' }}>
            <p style={{ fontSize: '0.875rem', color: '#991b1b', fontWeight: '600', margin: 0 }}>
              No delivery address found
            </p>
            <button
              onClick={() => navigate('/account/addresses')}
              style={{
                marginTop: '0.75rem',
                width: '100%',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Add Address
            </button>
          </div>
        )}

        {/* Payment Method */}
        <div style={{ margin: '1rem 1rem 0 1rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: '900', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', margin: 0 }}>
            Payment Method
          </p>

          {/* Pay Online */}
          <div
            onClick={() => setSelectedMethod('RAZORPAY')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              borderRadius: '1rem',
              border: selectedMethod === 'RAZORPAY' ? '2px solid #0D9E7E' : '2px solid #E8F8F3',
              backgroundColor: selectedMethod === 'RAZORPAY' ? '#E8F8F3' : 'white',
              cursor: 'pointer',
              marginBottom: '0.75rem',
              transition: 'all 200ms',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '0.75rem',
                backgroundColor: '#E8F8F3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CreditCard size={20} style={{ color: '#0D9E7E' }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '700', color: '#033428', margin: 0 }}>
                Pay Online
              </p>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '500', margin: 0 }}>
                UPI · Cards · Netbanking
              </p>
            </div>
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '2px solid #0D9E7E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: selectedMethod === 'RAZORPAY' ? '#0D9E7E' : 'white',
              }}
            >
              {selectedMethod === 'RAZORPAY' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }} />}
            </div>
          </div>

          {/* COD */}
          <div
            onClick={() => setSelectedMethod('COD')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              borderRadius: '1rem',
              border: selectedMethod === 'COD' ? '2px solid #0D9E7E' : '2px solid #E8F8F3',
              backgroundColor: selectedMethod === 'COD' ? '#E8F8F3' : 'white',
              cursor: 'pointer',
              marginBottom: '1rem',
              transition: 'all 200ms',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '0.75rem',
                backgroundColor: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Banknote size={20} style={{ color: '#f59e0b' }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '700', color: '#033428', margin: 0 }}>
                Cash on Delivery
              </p>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '500', margin: 0 }}>
                Pay when delivered
              </p>
            </div>
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '2px solid #0D9E7E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: selectedMethod === 'COD' ? '#0D9E7E' : 'white',
              }}
            >
              {selectedMethod === 'COD' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }} />}
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div style={{ margin: '0 1rem', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#9CA3AF' }}>
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          {totalSavings > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#0D9E7E', fontWeight: '600' }}>
              <span>Savings</span>
              <span>- ₹{totalSavings}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#9CA3AF' }}>
            <span>Delivery</span>
            <span style={{ color: deliveryFee === 0 ? '#0D9E7E' : '#033428', fontWeight: deliveryFee === 0 ? '600' : '400' }}>
              {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
            </span>
          </div>
          <div
            style={{
              borderTop: '1px solid #E8F8F3',
              paddingTop: '0.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.875rem',
              fontWeight: '700',
              color: '#033428',
            }}
          >
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>

        {/* Special Instructions */}
        <div style={{ margin: '1rem' }}>
          <textarea
            value={specialInstr}
            onChange={(e) => setSpecialInstr(e.target.value)}
            placeholder="Any special instructions? (optional)"
            style={{
              width: '100%',
              height: '72px',
              borderRadius: '1rem',
              border: '1px solid #E8F8F3',
              padding: '0.75rem',
              fontSize: '0.875rem',
              fontFamily: 'inherit',
              color: '#033428',
              outline: 'none',
              resize: 'none',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#0D9E7E'
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(13, 158, 126, 0.1)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#E8F8F3'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
        </div>

        {/* Place Order Button */}
        <div style={{ margin: '1rem', paddingBottom: '1rem' }}>
          <button
            onClick={handlePlaceOrder}
            disabled={!defaultAddress}
            style={{
              width: '100%',
              paddingTop: '1rem',
              paddingBottom: '1rem',
              borderRadius: '1rem',
              background: !defaultAddress ? '#D1D5DB' : 'linear-gradient(135deg, #0D9E7E 0%, #0A7560 100%)',
              color: 'white',
              border: 'none',
              fontWeight: '900',
              fontSize: '0.875rem',
              cursor: !defaultAddress ? 'not-allowed' : 'pointer',
              boxShadow: !defaultAddress ? 'none' : '0 4px 20px rgba(13, 158, 126, 0.25)',
              transition: 'all 200ms',
            }}
            onMouseDown={(e) => {
              if (defaultAddress) e.currentTarget.style.transform = 'scale(0.95)'
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            {selectedMethod === 'COD'
              ? `Place Order · ₹${totalAmount}`
              : `Proceed to Pay · ₹${totalAmount}`}
          </button>
        </div>
      </div>
    </>
  )
}
