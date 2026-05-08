
export default function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-black/5 animate-pulse">
      <div className="h-50 w-full bg-gray-200 sm:h-57.5" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 rounded-full bg-gray-200" />
        <div className="h-3 w-1/2 rounded-full bg-gray-200" />
        <div className="h-6 w-1/3 rounded-full bg-gray-200" />
        <div className="h-3 w-full rounded-full bg-gray-200" />
        <div className="h-3 w-2/3 rounded-full bg-gray-200" />
        <div className="mt-3 grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 rounded-2xl bg-gray-200" />
          ))}
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="h-6 w-16 rounded-full bg-gray-200" />
          <div className="h-9 w-24 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}