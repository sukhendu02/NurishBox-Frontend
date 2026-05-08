import { CalendarDays } from 'lucide-react'

export default function Plans() {
  return (
    <div className="min-h-screen bg-brand-surface flex flex-col items-center justify-center px-6 py-12">
      <CalendarDays size={100} className="text-brand-light mb-6" strokeWidth={1} />
      <h1 className="text-2xl font-bold text-text-brand mb-2">Meal Plans</h1>
      <p className="text-gray-400 text-center mb-4">Subscribe to weekly meal plans</p>
      <div className="inline-flex items-center gap-2 bg-accent-energy text-white rounded-full px-3 py-1 text-sm font-semibold">
        Coming soon
      </div>
    </div>
  )
}
