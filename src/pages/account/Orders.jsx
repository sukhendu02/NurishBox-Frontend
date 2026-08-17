import { useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useUserStore from '../../store/userStore'


// ─── Status config ────────────────────────────────────────────────

const STATUS_CONFIG = {
  PLACED:            { label: 'Placed',           style: 'bg-[#E8F8F3] text-[#065443] font-semibold' },
  CONFIRMED:         { label: 'Confirmed',         style: 'bg-[#E8F8F3] text-[#065443] font-semibold' },
  PREPARING:         { label: 'Preparing',         style: 'bg-amber-50 text-amber-800 font-semibold' },
  OUT_FOR_DELIVERY:  { label: 'Out for Delivery',  style: 'bg-blue-50 text-blue-800 font-semibold' },
  DELIVERED:         { label: 'Delivered',         style: 'bg-green-50 text-green-800 font-semibold' },
  CANCELLED:         { label: 'Cancelled',         style: 'bg-red-50 text-red-700 font-semibold' },
  FAILED:            { label: 'Failed',            style: 'bg-red-50 text-red-700 font-semibold' },
  REFUNDED:          { label: 'Refunded',          style: 'bg-gray-100 text-gray-600 font-semibold' },
}

const TERMINAL_STATUSES = new Set(['DELIVERED', 'CANCELLED', 'FAILED', 'REFUNDED'])

function canTrack(status) {
  return !TERMINAL_STATUSES.has(status)
}

function canRate(status) {
  return status === 'DELIVERED'
}

// ─── Helpers ──────────────────────────────────────────────────────

function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

// ─── Sub-components ───────────────────────────────────────────────

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? { label: status, style: 'bg-gray-100 text-gray-600' }
  return (
    <span className={`text-xs font-medium  px-2.5 py-1 rounded-full whitespace-nowrap ${config.style}`}>
      {config.label}
    </span>
  )
}

function OrderItemRow({ item }) {
  return (
    <div className="flex justify-between items-start py-2">
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-brand-dark text-xs  font-medium truncate">{item.productName}</p>
        <p className="text-xs text-gray-400 mt-0.5">Qty {item.quantity}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm  text-text-brand">{formatCurrency(item.totalPrice)}</p>
      </div>
    </div>
  )
}

function OrderCard({ order, onTrack, onRate }) {
  const itemCount = order.items?.length ?? 0

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm p-4">

      {/* Card Header */}
      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-sm tracking-wide">
           Order #{order.orderNumber}
          </p>
          <p className="text-xs  text-gray-400 mt-0.5">Placed on {formatDateTime(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mx-4" />

      {/* Items */}
      <div className="px-4 py-1 divide-y  border-b border-gray-100  p-2 divide-gray-50">
        {order.items?.map((item) => (
          <OrderItemRow key={item.id} item={item} />
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mx-4" />

      {/* Card Footer */}
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-gray-400">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
            {order.payment?.method && (
              <span className="ml-2 capitalize">· {order.payment.method}</span>
            )}
          </p>
          <p className="text-base font-semibold text-text-brand mt-0.5"> 
            {formatCurrency(order.totalAmt)}
          </p>
        </div>

        <div className="flex gap-2">
          {canRate(order.status) && (
            <>
           
            <button
              onClick={() => onRate(order)}
              className="text-xs px-4 py-2.5 rounded-full font-medium bg-gray-400 cursor-pointer text-white hover:bg-gray-500 transition-colors"
            >
              View Order
            </button>
            <button
              onClick={() => onRate(order)}
              className="text-xs  px-4 py-2.5 rounded-full font-medium bg-amber-500  cursor-pointer  shadow-amber-100 text-white hover:shadow-md transition-colors"
            >
              Rate Order
            </button>
           </>
          )}
          {canTrack(order.status) && (
            <button
              onClick={() => onTrack(order)}
              className="text-xs  px-4 py-2.5 rounded-full font-medium bg-brand-dark shadow-sm shadow-brand-dark cursor-pointer text-white hover:bg-brand-deeper transition-colors"
            >
              Track Order
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="px-4 pt-4 pb-3 flex items-start justify-between">
        <div>
          <div className="h-3.5 w-28 bg-gray-100 rounded" />
          <div className="h-3 w-20 bg-gray-100 rounded mt-2" />
        </div>
        <div className="h-6 w-20 bg-gray-100 rounded-full" />
      </div>
      <div className="h-px bg-gray-50 mx-4" />
      <div className="px-4 py-3 space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="flex justify-between">
            <div className="h-3 w-40 bg-gray-100 rounded" />
            <div className="h-3 w-16 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
      <div className="h-px bg-gray-50 mx-4" />
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="h-4 w-16 bg-gray-100 rounded" />
        <div className="h-8 w-24 bg-gray-100 rounded-xl" />
      </div>
    </div>
  )
}

function EmptyState({ onShop }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-surface flex items-center justify-center mb-4">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0D9E7E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      </div>
      <p className="text-base  text-text-brand">No orders yet</p>
      <p className="text-sm text-gray-400 mt-1">Your placed orders will appear here</p>
      <button
        onClick={onShop}
        className="mt-6 bg-brand-primary text-white text-sm  px-6 py-3 rounded-xl hover:bg-brand-dark transition-colors"
      >
        Start Shopping
      </button>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────

export default function Orders() {
  const navigate    = useNavigate()
  const loaderRef   = useRef(null)
  const observerRef = useRef(null)

  const orders           = useUserStore((s) => s.orders)
  const ordersPage       = useUserStore((s) => s.ordersPage)
  const ordersHasNext    = useUserStore((s) => s.ordersHasNext)
  const isFetchingOrders = useUserStore((s) => s.isFetchingOrders)
  const fetchMyOrders    = useUserStore((s) => s.fetchMyOrders)

  // Initial fetch
  useEffect(() => {
    fetchMyOrders(1)
  }, [])

  // Infinite scroll
  const loadMore = useCallback(() => {
    if (isFetchingOrders || !ordersHasNext) return
    fetchMyOrders(ordersPage + 1)
  }, [isFetchingOrders, ordersHasNext, ordersPage, fetchMyOrders])

  useEffect(() => {
    const el = loaderRef.current
    if (!el) return
    observerRef.current = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore() },
      { threshold: 0.1 }
    )
    observerRef.current.observe(el)
    return () => observerRef.current?.disconnect()
  }, [loadMore])

  const handleTrack = (order) => navigate(`/account/orders/track/${order.id}`)
  const handleRate  = (order) => navigate(`/account/orders/${order.id}?rate=true`)
  const handleviewOrder = (order)=> navigate(`/account/orders/${order.id}`)
  // Initial loading skeleton
  if (isFetchingOrders && orders.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-4">
        {/* <p className="text-lg  text-[#033428] mb-4">My Orders</p> */}
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    )
  }

  if (!isFetchingOrders && orders.length === 0) {
    return <EmptyState onShop={() => navigate('/explore')} />
  }

  return (
    <div className="mx-auto p-4">
      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onTrack={handleTrack}
            onRate={handleRate}
          />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={loaderRef} className="flex items-center justify-center h-12 mt-2">
        {isFetchingOrders && (
          <div
            className="w-6 h-6 rounded-full border-2 border-brand-surface border-t-brand-primary"
            style={{ animation: 'spin 1s linear infinite' }}
          />
        )}
      </div>
    </div>
  )
}