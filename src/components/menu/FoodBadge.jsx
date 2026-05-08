
import { useProductStore } from "../../store/productStore"

export default function FoodBadge({ type }) {
  const isVeg = type === 'veg'

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-700 shadow">

      {isVeg ? (
        /* ── VEG: green square border + green filled circle ── */
        <span className="flex h-3.5 w-3.5 items-center justify-center rounded border border-green-600">
          <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
        </span>
      ) : (
        /* ── NON-VEG: red square border + red filled triangle ── */
        <span className="flex h-3.5 w-3.5 items-center justify-center rounded border border-red-600">
          <svg
            width="8"
            height="7"
            viewBox="0 0 8 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 0.5L7.4641 6.5H0.535898L4 0.5Z"
              fill="#dc2626"
            />
          </svg>
        </span>
      )}

      {isVeg ? 'Veg' : 'Non-Veg'}
    </span>
  )
}