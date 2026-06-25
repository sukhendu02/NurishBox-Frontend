// ─── CartStatusBanner ─────────────────────────────────────────────────────────
// Place this ABOVE the cart items list

import { AlertCircle, MapPin, Clock, Navigation } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
// import useCartStore    from '../store/cartStore'
// import useProductStore from '../store/productStore'
// import useAddressStore from '../store/addressStore'
import useAddressStore from '../../store/addressStrore'
import useCartStore from '../../store/cartStore'
import { useProductStore } from '../../store/productStore'


export function CartStatusBanner() {
  const navigate        = useNavigate()
  const unavailableIds  = useCartStore(s => s.unavailableIds)
  const { status, canOrder, message } = useProductStore()
  const selectedAddress = useAddressStore(s => s.selectedAddress)

  const hasUnavailable  = unavailableIds?.length > 0
  const noSavedAddress  = !selectedAddress || selectedAddress.type === 'current_location'

  // No address
  if (noSavedAddress) {
    return (
      <Banner icon={MapPin} bg="bg-blue-50 border-blue-100" iconBg="bg-blue-100" iconCol="text-blue-500" textCol="text-blue-800" subCol="text-blue-500"
        title="Add a delivery address"
        message="You need a saved address to place an order"
        action={<button onClick={() => navigate('/account/manage-address')} className="text-xs font-bold text-white bg-blue-500 px-3 py-1.5 rounded-full">Add Address</button>}
      />
    )
  }

  // Not serviceable
  if (status === 'not_serviceable') {
    return (
      <Banner icon={MapPin} bg="bg-orange-50 border-orange-100" iconBg="bg-orange-100" iconCol="text-orange-500" textCol="text-orange-800" subCol="text-orange-500"
        title="Not serviceable at this location"
        message="We don't deliver to your area yet. Try a different address."
      />
    )
  }

  // Not accepting orders
  if (status === 'not_accepting') {
    return (
      <Banner icon={Clock} bg="bg-yellow-50 border-yellow-100" iconBg="bg-yellow-100" iconCol="text-yellow-600" textCol="text-yellow-800" subCol="text-yellow-600"
        title="Kitchen not accepting orders"
        message={message || 'The kitchen is currently not accepting orders. Please try again later.'}
      />
    )
  }

  // Some items unavailable
  if (hasUnavailable) {
    return (
      <Banner icon={AlertCircle} bg="bg-red-50 border-red-100" iconBg="bg-red-100" iconCol="text-red-500" textCol="text-red-800" subCol="text-red-500"
        title="Some items are unavailable at this location"
        message={`${unavailableIds.length} item${unavailableIds.length > 1 ? 's are' : ' is'} not available. Remove them to place your order.`}
      />
    )
  }

  return null
}

// ─── Reusable banner UI ───────────────────────────────────────────────────────
function Banner({ icon: Icon, bg, iconBg, iconCol, textCol, subCol, title, message, action }) {
  return (
    <div className={`flex items-start gap-3 rounded-2xl border p-4 mb-4 ${bg}`}>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon size={17} className={iconCol} strokeWidth={2.2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${textCol}`}>{title}</p>
        <p className={`text-xs mt-0.5 ${subCol}`}>{message}</p>
      </div>
      {action}
    </div>
  )
}

