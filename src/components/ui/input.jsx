export default function Input({
  label,
  hint,
  prefix,
  className = '',
  ...props
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-text-brand">{label}</label>
      )}
      <div className="flex items-center border border-brand-tint rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-brand-primary focus-within:border-brand-primary transition-all">
        {prefix && (
          <span className="bg-brand-surface text-brand-primary px-3 py-3 text-sm font-semibold border-r border-brand-tint shrink-0">
            {prefix}
          </span>
        )}
        <input
          className={`flex-1 px-4 py-3 bg-white text-text-brand placeholder-gray-400 outline-none text-base ${className}`}
          {...props}
        />
      </div>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  )
}
