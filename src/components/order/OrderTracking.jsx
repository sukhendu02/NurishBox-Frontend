import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useOrderStore from '../../store/orderStore'
import { useOrderTracking } from '../../store/orderTracking'
// ─── Status config ────────────────────────────────────────────────

const STATUS_SEQUENCE = [
  { key: 'PLACED',           label: 'Placed',        icon: '🧾' },
  { key: 'CONFIRMED',        label: 'Confirmed',     icon: '✅' },
  { key: 'PREPARING',        label: 'Preparing',     icon: '🍱' },
  { key: 'OUT_FOR_DELIVERY', label: 'On the Way',    icon: '🚴' },
  { key: 'DELIVERED',        label: 'Delivered',     icon: '🎉' },
]

const TERMINAL_STATUSES = new Set(['DELIVERED', 'CANCELLED', 'FAILED', 'REFUNDED'])

const STATUS_ILLUSTRATION = {
  PLACED: {
    quote: 'Your order is in the queue...',
    scene: (
      <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <rect x="60" y="20" width="80" height="100" rx="8" fill="#E8F8F3" />
        <rect x="72" y="35" width="56" height="6" rx="3" fill="#0D9E7E" />
        <rect x="72" y="48" width="40" height="4" rx="2" fill="#B2E8D6" />
        <rect x="72" y="58" width="48" height="4" rx="2" fill="#B2E8D6" />
        <rect x="72" y="68" width="36" height="4" rx="2" fill="#B2E8D6" />
        <rect x="72" y="90" width="56" height="18" rx="6" fill="#0D9E7E" />
        <rect x="84" y="96" width="32" height="6" rx="3" fill="#E8F8F3" />
        <circle cx="100" cy="20" r="8" fill="#0D9E7E" />
        <rect x="96" y="16" width="8" height="8" rx="1" fill="#E8F8F3" />
        <style>{`
          @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
          .float-doc { animation: float 2.5s ease-in-out infinite }
        `}</style>
        <g className="float-doc">
          <rect x="60" y="20" width="80" height="100" rx="8" fill="#E8F8F3" />
          <rect x="72" y="35" width="56" height="6" rx="3" fill="#0D9E7E" />
          <rect x="72" y="48" width="40" height="4" rx="2" fill="#B2E8D6" />
          <rect x="72" y="58" width="48" height="4" rx="2" fill="#B2E8D6" />
          <rect x="72" y="68" width="36" height="4" rx="2" fill="#B2E8D6" />
          <rect x="72" y="90" width="56" height="18" rx="6" fill="#0D9E7E" />
          <rect x="84" y="96" width="32" height="6" rx="3" fill="#E8F8F3" />
          <circle cx="100" cy="20" r="8" fill="#0D9E7E" />
          <rect x="96" y="16" width="8" height="8" rx="1" fill="#E8F8F3" />
        </g>
      </svg>
    ),
  },
  CONFIRMED: {
    quote: 'Great news! Your order is confirmed.',
    scene: (
      <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <style>{`
          @keyframes pop { 0%{transform:scale(0.8)} 60%{transform:scale(1.1)} 100%{transform:scale(1)} }
          @keyframes ring { 0%,100%{transform:rotate(-10deg)} 50%{transform:rotate(10deg)} }
          .pop-check { animation: pop 0.5s ease-out forwards }
          .ring-bell { animation: ring 0.6s ease-in-out infinite }
        `}</style>
        <circle cx="100" cy="70" r="50" fill="#E8F8F3" />
        <g className="pop-check">
          <circle cx="100" cy="70" r="30" fill="#0D9E7E" />
          <polyline points="86,70 96,80 116,60" stroke="#E8F8F3" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
        <g className="ring-bell" style={{ transformOrigin: '155px 30px' }}>
          <ellipse cx="155" cy="35" rx="12" ry="14" fill="#5ECBA8" />
          <rect x="150" y="47" width="10" height="4" rx="2" fill="#0A7560" />
          <circle cx="155" cy="53" r="3" fill="#0A7560" />
        </g>
      </svg>
    ),
  },
  PREPARING: {
    quote: 'Our chef is preparing your order fresh!',
    scene: (
      <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <style>{`
          @keyframes steam1 { 0%,100%{opacity:0;transform:translateY(0)} 50%{opacity:1;transform:translateY(-12px)} }
          @keyframes steam2 { 0%,100%{opacity:0;transform:translateY(0)} 50%{opacity:1;transform:translateY(-10px)} }
          @keyframes stir { 0%,100%{transform:rotate(-15deg)} 50%{transform:rotate(15deg)} }
          .s1{animation:steam1 1.5s ease-in-out infinite}
          .s2{animation:steam2 1.5s ease-in-out 0.5s infinite}
          .stir{animation:stir 1s ease-in-out infinite;transform-origin:130px 80px}
        `}</style>
        <ellipse cx="90" cy="100" rx="50" ry="12" fill="#E8F8F3" />
        <path d="M50 95 Q90 75 130 95" stroke="#0D9E7E" strokeWidth="3" fill="#E8F8F3" />
        <ellipse cx="90" cy="95" rx="40" ry="10" fill="#B2E8D6" />
        <circle cx="80" cy="90" r="5" fill="#5ECBA8" />
        <circle cx="95" cy="88" r="4" fill="#0D9E7E" />
        <circle cx="108" cy="91" r="5" fill="#5ECBA8" />
        <line x1="75" y1="88" x2="72" y2="70" stroke="#0D9E7E" strokeWidth="2" className="s1" />
        <line x1="90" y1="86" x2="90" y2="68" stroke="#0D9E7E" strokeWidth="2" className="s2" />
        <line x1="105" y1="88" x2="108" y2="70" stroke="#0D9E7E" strokeWidth="2" className="s1" />
        <g className="stir">
          <rect x="126" y="60" width="4" height="40" rx="2" fill="#065443" />
          <ellipse cx="128" cy="60" rx="8" ry="4" fill="#0A7560" />
        </g>
      </svg>
    ),
  },
  OUT_FOR_DELIVERY: {
    quote: 'Your order is on its way to you!',
    scene: (
      <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <style>{`
          @keyframes ride { 0%,100%{transform:translateX(0)} 50%{transform:translateX(8px)} }
          @keyframes wheel { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          .rider{animation:ride 0.8s ease-in-out infinite}
          .w1{animation:wheel 0.6s linear infinite;transform-origin:65px 108px}
          .w2{animation:wheel 0.6s linear infinite;transform-origin:115px 108px}
        `}</style>
        <rect x="10" y="115" width="180" height="3" rx="1" fill="#E8F8F3" />
        <g className="rider">
          <g className="w1">
            <circle cx="65" cy="108" r="14" stroke="#0D9E7E" strokeWidth="3" fill="none" />
            <line x1="65" y1="94" x2="65" y2="122" stroke="#0D9E7E" strokeWidth="2" />
            <line x1="51" y1="108" x2="79" y2="108" stroke="#0D9E7E" strokeWidth="2" />
          </g>
          <g className="w2">
            <circle cx="115" cy="108" r="14" stroke="#0D9E7E" strokeWidth="3" fill="none" />
            <line x1="115" y1="94" x2="115" y2="122" stroke="#0D9E7E" strokeWidth="2" />
            <line x1="101" y1="108" x2="129" y2="108" stroke="#0D9E7E" strokeWidth="2" />
          </g>
          <line x1="65" y1="108" x2="90" y2="85" stroke="#065443" strokeWidth="3" />
          <line x1="90" y1="85" x2="115" y2="95" stroke="#065443" strokeWidth="3" />
          <line x1="90" y1="85" x2="90" y2="108" stroke="#065443" strokeWidth="3" />
          <circle cx="90" cy="72" r="10" fill="#5ECBA8" />
          <rect x="78" y="72" width="18" height="12" rx="2" fill="#0D9E7E" />
          <rect x="98" y="78" width="22" height="18" rx="4" fill="#E8F8F3" stroke="#0D9E7E" strokeWidth="2" />
          <rect x="102" y="82" width="14" height="10" rx="2" fill="#B2E8D6" />
        </g>
      </svg>
    ),
  },
  DELIVERED: {
    quote: 'Enjoy your meal! Bon appétit!',
    scene: (
      <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <style>{`
          @keyframes bounce { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-10px)} }
          @keyframes sparkle { 0%,100%{opacity:0;transform:scale(0)} 50%{opacity:1;transform:scale(1)} }
          .bag{animation:bounce 1.2s ease-in-out infinite}
          .sp1{animation:sparkle 1.2s ease-in-out 0s infinite}
          .sp2{animation:sparkle 1.2s ease-in-out 0.3s infinite}
          .sp3{animation:sparkle 1.2s ease-in-out 0.6s infinite}
        `}</style>
        <g className="bag">
          <rect x="65" y="55" width="70" height="65" rx="10" fill="#E8F8F3" stroke="#0D9E7E" strokeWidth="2" />
          <path d="M80 55 Q80 40 100 40 Q120 40 120 55" stroke="#0D9E7E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="100" cy="88" r="18" fill="#0D9E7E" />
          <polyline points="90,88 98,96 112,80" stroke="#E8F8F3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
        <g className="sp1" style={{ transformOrigin: '50px 45px' }}>
          <line x1="50" y1="38" x2="50" y2="52" stroke="#E8A020" strokeWidth="2" strokeLinecap="round" />
          <line x1="43" y1="45" x2="57" y2="45" stroke="#E8A020" strokeWidth="2" strokeLinecap="round" />
        </g>
        <g className="sp2" style={{ transformOrigin: '155px 60px' }}>
          <line x1="155" y1="53" x2="155" y2="67" stroke="#5ECBA8" strokeWidth="2" strokeLinecap="round" />
          <line x1="148" y1="60" x2="162" y2="60" stroke="#5ECBA8" strokeWidth="2" strokeLinecap="round" />
        </g>
        <g className="sp3" style={{ transformOrigin: '45px 95px' }}>
          <line x1="45" y1="88" x2="45" y2="102" stroke="#0D9E7E" strokeWidth="2" strokeLinecap="round" />
          <line x1="38" y1="95" x2="52" y2="95" stroke="#0D9E7E" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    ),
  },
  CANCELLED: {
    quote: 'This order was cancelled.',
    scene: null,
  },
  FAILED: {
    quote: 'Something went wrong with this order.',
    scene: null,
  },
  REFUNDED: {
    quote: 'Your refund has been processed.',
    scene: null,
  },
}

// ─── Helpers ──────────────────────────────────────────────────────

function getActiveIndex(status) {
  return STATUS_SEQUENCE.findIndex((s) => s.key === status)
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

// ─── Sub-components ───────────────────────────────────────────────

function StatusIllustration({ status }) {
  const config = STATUS_ILLUSTRATION[status] ?? STATUS_ILLUSTRATION['PLACED']
  const isCancelled = ['CANCELLED', 'FAILED', 'REFUNDED'].includes(status)

  return (
    <div
      className="rounded-2xl overflow-hidden relative"
      style={{ backgroundColor: isCancelled ? '#fee2e2' : '#E8F8F3', minHeight: 160 }}
    >
      {/* Quote floated top-left */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <p
          className="text-base font-bold leading-snug"
          style={{ color: isCancelled ? '#991b1b' : '#033428', maxWidth: '55%' }}
        >
          {config.quote}
        </p>
      </div>

      {/* Illustration floated right */}
      {config.scene && (
        <div
          className="absolute right-0 bottom-0"
          style={{ width: 160, height: 130 }}
        >
          {config.scene}
        </div>
      )}

      {/* Cancelled/Failed placeholder */}
      {!config.scene && (
        <div className="flex items-center justify-center" style={{ height: 130 }}>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#fecaca' }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
        </div>
      )}

      {/* Bottom padding so quote doesn't overlap illustration */}
      <div style={{ paddingTop: 140 }} />
    </div>
  )
}

function Timeline({ activeStatus }) {
  const activeIndex = getActiveIndex(activeStatus)
  const isCancelled = ['CANCELLED', 'FAILED', 'REFUNDED'].includes(activeStatus)

  if (isCancelled) return null

  return (
    <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#f3f4f6' }}>
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div
          className="absolute top-4 left-0 right-0 h-0.5"
          style={{ backgroundColor: '#f3f4f6', zIndex: 0 }}
        />
        {/* Active progress line */}
        <div
          className="absolute top-4 left-0 h-0.5 transition-all duration-700"
          style={{
            backgroundColor: '#0D9E7E',
            zIndex: 1,
            width: activeIndex <= 0
              ? '0%'
              : `${(activeIndex / (STATUS_SEQUENCE.length - 1)) * 100}%`,
          }}
        />

        {STATUS_SEQUENCE.map((step, index) => {
          const isCompleted = index < activeIndex
          const isActive    = index === activeIndex
          const isUpcoming  = index > activeIndex

          return (
            <div key={step.key} className="flex flex-col items-center gap-2 relative z-10">
              {/* Circle */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-500"
                style={{
                  backgroundColor: isActive
                    ? '#0D9E7E'
                    : isCompleted
                    ? '#E8F8F3'
                    : '#f9fafb',
                  border: isActive
                    ? '3px solid #B2E8D6'
                    : isCompleted
                    ? '2px solid #0D9E7E'
                    : '2px solid #e5e7eb',
                  boxShadow: isActive ? '0 0 0 4px #B2E8D6' : 'none',
                }}
              >
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0D9E7E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span style={{ fontSize: 14, opacity: isUpcoming ? 0.3 : 1 }}>
                    {step.icon}
                  </span>
                )}
              </div>

              {/* Label */}
              <p
                className="text-center"
                style={{
                  fontSize: 11,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive
                    ? '#0D9E7E'
                    : isCompleted
                    ? '#033428'
                    : '#d1d5db',
                  maxWidth: 56,
                  lineHeight: 1.3,
                }}
              >
                {step.label}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function OrderSummaryCard({ order }) {
  return (
    <div className="bg-white rounded-2xl border p-4" style={{ borderColor: '#f3f4f6' }}>
      <p className="font-bold text-sm mb-3" style={{ color: '#033428' }}>Order summary</p>
      <div className="space-y-2">
        {order.items?.map((item) => (
          <div key={item.id} className="flex justify-between items-start">
            <div className="flex-1 min-w-0 pr-3">
              <p className="text-sm" style={{ color: '#033428' }}>{item.productName}</p>
              {item.productCategory && (
                <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{item.productCategory}</p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold" style={{ color: '#033428' }}>
                {formatCurrency(item.totalPrice)}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>×{item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="h-px my-3" style={{ backgroundColor: '#f3f4f6' }} />
      <div className="flex justify-between items-center">
        <p className="text-sm font-bold" style={{ color: '#033428' }}>Total</p>
        <p className="text-base font-bold" style={{ color: '#0D9E7E' }}>
          {formatCurrency(order.totalAmount)}
        </p>
      </div>
    </div>
  )
}

function DeliveryAddressCard({ address }) {
  if (!address) return null
  const parts = [address.line1, address.line2, address.landmark, address.city, address.pincode]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="bg-white rounded-2xl border p-4" style={{ borderColor: '#f3f4f6' }}>
      <p className="font-bold text-sm mb-2" style={{ color: '#033428' }}>Delivery to</p>
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: '#E8F8F3' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0D9E7E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div>
          {address.label && (
            <p className="text-sm font-semibold" style={{ color: '#033428' }}>{address.label}</p>
          )}
          <p className="text-xs mt-0.5" style={{ color: '#9CA3AF', lineHeight: 1.5 }}>{parts}</p>
        </div>
      </div>
    </div>
  )
}

function SkeletonLoader() {
  return (
    <div className="max-w-xl mx-auto px-4 py-4 space-y-4 animate-pulse">
      <div className="h-5 w-40 bg-gray-100 rounded" />
      <div className="rounded-2xl bg-gray-100" style={{ height: 160 }} />
      <div className="rounded-2xl bg-gray-100" style={{ height: 80 }} />
      <div className="rounded-2xl bg-gray-100" style={{ height: 140 }} />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────

export default function OrderTracking() {
  const { orderId } = useParams()
  const navigate    = useNavigate()

  const currentOrder     = useOrderStore((s) => s.currentOrder)
  const trackedStatus    = useOrderStore((s) => s.trackedStatus)
  const isTracking       = useOrderStore((s) => s.isTracking)
  const fetchOrderDetail = useOrderStore((s) => s.fetchOrderDetail)

  useOrderTracking(orderId)

  useEffect(() => {
    fetchOrderDetail(orderId)
  }, [orderId])

  if (!currentOrder) return <SkeletonLoader />

  const displayStatus = trackedStatus ?? currentOrder.status

  return (
    <div className="max-w-xl mx-auto px-4 py-4 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/account/orders')}
            className="flex items-center gap-1 text-sm mb-1"
            style={{ color: '#9CA3AF' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            My orders
          </button>
          <p className="font-bold" style={{ color: '#033428', fontSize: 17 }}>
            Order #{currentOrder.orderNumber}
          </p>
        </div>

        {/* Live indicator */}
        {isTracking && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ backgroundColor: '#E8F8F3' }}>
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: '#0D9E7E', animation: 'pulse 1.5s ease-in-out infinite' }}
            />
            <span className="text-xs font-semibold" style={{ color: '#065443' }}>Live</span>
          </div>
        )}
      </div>

      {/* Illustration + quote */}
      <StatusIllustration status={displayStatus} />

      {/* Timeline */}
      <Timeline activeStatus={displayStatus} />

      {/* Order summary */}
      <OrderSummaryCard order={currentOrder} />

      {/* Delivery address */}
      <DeliveryAddressCard address={currentOrder.address} />

    </div>
  )
}