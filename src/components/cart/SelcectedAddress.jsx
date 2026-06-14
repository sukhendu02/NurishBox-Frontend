import { MapPin, Phone, User, Plus, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useAddressStore from '../../store/addressStrore'

export default function SelectedAddressCard() {
  const navigate = useNavigate()
  const selectedAddress = useAddressStore((s) => s.selectedAddress)

  if (!selectedAddress) return <SelectedAddressCardSkeleton />

  // ── Current location ───────────────────────────────────────────────────────
  if (selectedAddress.type === 'current_location') {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#E8F8F3] flex items-center justify-center flex-shrink-0">
            <MapPin size={16} className="text-[#0A7560]" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Delivering to</p>
            <p className="text-sm font-semibold text-gray-700">Your current location</p>
            <p className="text-xs text-gray-400 mt-0.5">Save an address for faster checkout</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/account/manage-address')}
          className="flex items-center gap-1 text-xs font-semibold text-[#0A7560] bg-[#E8F8F3] px-3 py-2 rounded-xl whitespace-nowrap hover:bg-[#d4f1e8] transition-colors"
        >
          <Plus size={13} strokeWidth={2.5} />
          Add Address
        </button>
      </div>
    )
  }

  // ── Saved address ──────────────────────────────────────────────────────────
  const { label, receiversName, receiversPhone, line1, line2, city, state, pincode } = selectedAddress

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* Label */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold tracking-widest text-[#0A7560] bg-[#E8F8F3] px-2 py-0.5 rounded-full uppercase">
          {label}
        </span>
        <button
          onClick={() => navigate('/account/manage-address')}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#0A7560] transition-colors"
        >
          Change <ChevronRight size={13} />
        </button>
      </div>

      {/* Receiver info */}
      <div className="flex items-center gap-2 mb-1">
        <User size={13} className="text-gray-400 flex-shrink-0" strokeWidth={2} />
        <span className="text-sm font-semibold text-gray-800">{receiversName}</span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <Phone size={13} className="text-gray-400 flex-shrink-0" strokeWidth={2} />
        <span className="text-sm text-gray-500">{receiversPhone}</span>
      </div>

      {/* Address */}
      <div className="flex items-start gap-2">
        <MapPin size={13} className="text-gray-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
        <p className="text-sm text-gray-600 leading-relaxed">
          {line1}{line2 ? `, ${line2}` : ''}, {city}, {state} – {pincode}
        </p>
      </div>
    </div>
  )
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

function SelectedAddressCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 w-20 bg-gray-100 rounded-full" />
        <div className="h-4 w-14 bg-gray-100 rounded-full" />
      </div>
      <div className="h-4 w-32 bg-gray-100 rounded-md mb-2" />
      <div className="h-4 w-24 bg-gray-100 rounded-md mb-3" />
      <div className="h-4 w-full bg-gray-100 rounded-md" />
    </div>
  )
}