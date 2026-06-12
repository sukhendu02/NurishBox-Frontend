import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useOrderStore from '../../store/orderStore'
import { useOrderTracking } from '../../store/orderTracking'
const STATUS_SEQUENCE = [
  { key: 'PLACED',           label: 'Order Placed',      icon: '🧾' },
  { key: 'CONFIRMED',        label: 'Order Confirmed',   icon: '✅' },
  { key: 'PREPARING',        label: 'Being Prepared',    icon: '🍱' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery',  icon: '🚴' },
  { key: 'DELIVERED',        label: 'Delivered',         icon: '🎉' },
]

const CANCELLED_STATUSES = new Set(['CANCELLED', 'FAILED', 'REFUNDED'])

function getActiveIndex(status) {
  return STATUS_SEQUENCE.findIndex((s) => s.key === status)
}

export default function OrderTracking() {
  const { orderId }    = useParams()
  const currentOrder   = useOrderStore((s) => s.currentOrder)
  const trackedStatus  = useOrderStore((s) => s.trackedStatus)
  const isTracking     = useOrderStore((s) => s.isTracking)
  const fetchOrderDetail = useOrderStore((s) => s.fetchOrderDetail)

  // Open SSE connection
  useOrderTracking(orderId)

  // Load order detail on mount
  useEffect(() => {
    fetchOrderDetail(orderId)
  }, [orderId])

  const displayStatus = trackedStatus ?? currentOrder?.status
  const isCancelled   = CANCELLED_STATUSES.has(displayStatus)
  const activeIndex   = getActiveIndex(displayStatus)

  if (!currentOrder) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-6 h-6 rounded-full border-2 border-[#E8F8F3] border-t-[#0D9E7E] animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6">

      {/* Header */}
      <div className="mb-6">
        <p className="text-lg font-bold text-[#033428]">
          Order #{currentOrder.orderNumber}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm text-gray-400">{currentOrder.items?.length} items</p>
          {isTracking && (
            <span className="flex items-center gap-1 text-xs text-[#0D9E7E] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0D9E7E] animate-pulse" />
              Live
            </span>
          )}
        </div>
      </div>

      {/* Cancelled / Failed state */}
      {isCancelled ? (
        <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-6 text-center">
          <p className="text-2xl mb-2">
            {displayStatus === 'REFUNDED' ? '💸' : '❌'}
          </p>
          <p className="font-bold text-red-700 text-base">
            Order {displayStatus.charAt(0) + displayStatus.slice(1).toLowerCase()}
          </p>
          <p className="text-sm text-red-400 mt-1">
            {displayStatus === 'REFUNDED'
              ? 'Your refund has been processed'
              : 'This order was not completed'}
          </p>
        </div>
      ) : (
        /* Timeline */
        <div className="bg-white rounded-2xl border border-gray-100 px-5 py-6">
          <div className="relative">
            {STATUS_SEQUENCE.map((step, index) => {
              const isCompleted = index < activeIndex
              const isActive    = index === activeIndex
              const isUpcoming  = index > activeIndex
              const isLast      = index === STATUS_SEQUENCE.length - 1

              return (
                <div key={step.key} className="flex gap-4">
                  {/* Icon + connector line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                        w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0
                        transition-all duration-500
                        ${isCompleted ? 'bg-[#E8F8F3]' : ''}
                        ${isActive    ? 'bg-[#0D9E7E] ring-4 ring-[#B2E8D6]' : ''}
                        ${isUpcoming  ? 'bg-gray-100' : ''}
                      `}
                    >
                      {isActive ? (
                        <span className="text-white text-sm">{step.icon}</span>
                      ) : (
                        <span className={isCompleted ? 'text-sm' : 'text-sm opacity-30'}>
                          {step.icon}
                        </span>
                      )}
                    </div>

                    {/* Connector line */}
                    {!isLast && (
                      <div
                        className={`
                          w-0.5 flex-1 min-h-[2rem] my-1 transition-all duration-500
                          ${isCompleted ? 'bg-[#0D9E7E]' : 'bg-gray-100'}
                        `}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
                    <p
                      className={`
                        text-sm font-semibold leading-9 transition-colors duration-300
                        ${isActive   ? 'text-[#0D9E7E]' : ''}
                        ${isCompleted ? 'text-[#033428]' : ''}
                        ${isUpcoming  ? 'text-gray-300'  : ''}
                      `}
                    >
                      {step.label}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Order summary */}
      <div className="mt-4 bg-white rounded-2xl border border-gray-100 px-5 py-4">
        <p className="text-sm font-bold text-[#033428] mb-3">Order Summary</p>
        <div className="space-y-2">
          {currentOrder.items?.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-500">
                {item.productName}
                <span className="ml-1 text-gray-400">×{item.quantity}</span>
              </span>
              <span className="font-semibold text-[#033428]">
                ₹{item.totalPrice}
              </span>
            </div>
          ))}
        </div>
        <div className="h-px bg-gray-50 my-3" />
        <div className="flex justify-between text-sm font-bold text-[#033428]">
          <span>Total</span>
          <span>₹{currentOrder.totalAmount}</span>
        </div>
      </div>

    </div>
  )
}