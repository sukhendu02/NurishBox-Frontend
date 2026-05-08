import { useProductStore } from "../../store/productStore"
export default function NutritionPill({ label, value }) {
  return (
    <div className="rounded-2xl bg-[#FAFAF8] px-2 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-xs font-semibold text-gray-700">{value}</p>
    </div>
  )
}