import { useProductStore } from "../../store/productStore";


export default function SidebarCard({ title, children }) {
  return (
    <div className="rounded-[28px] bg-[#FBFAF7] p-5 shadow-sm ring-1 ring-black/5">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
        {title}
      </h3>
      {children}
    </div>
  )
}