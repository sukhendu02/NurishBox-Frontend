import { Loader as Loader2 } from 'lucide-react'

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const base =
    'w-full rounded-xl px-4 py-3 font-semibold text-base flex items-center justify-center gap-2 transition-all duration-200 active:scale-95'

  const variants = {
    primary: 'bg-brand-primary text-white hover:bg-brand-dark disabled:opacity-60',
    secondary:
      'bg-brand-surface text-brand-primary border border-brand-tint hover:bg-brand-tint disabled:opacity-60',
    danger: 'bg-white border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-60',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  )
}
