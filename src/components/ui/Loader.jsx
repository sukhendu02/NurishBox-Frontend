import { Loader as Loader2 } from 'lucide-react'

export default function Loader({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={40} className="animate-spin text-brand-primary" />
          <p className="text-brand-primary font-semibold text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return <Loader2 size={24} className="animate-spin text-brand-primary" />
}
