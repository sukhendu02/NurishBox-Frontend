
import { useProductStore } from "../../store/productStore";     
import { useState, useEffect } from "react";
import FoodBadge from "./FoodBadge";
import NutritionPill from "./NutritionPill";
import { Plus, Minus, WeightTilde } from "lucide-react";
export default function ProductCard({
  product,
  qty,
  onAdd,
  onMinus,
  onPlus,
 
}) {

    const [expanded, setExpanded] = useState(false)
  const hasDiscount = product.sellingPrice < product.price
  const showMore = product.description.length > 100

  return (
    <article className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md">

      {/* ── Outer wrapper: always column (image on top, content below) ── */}
      <div className="flex flex-col">

        {/* ── IMAGE ──────────────────────────────────────────────────────
            Mobile  : full width, 200px tall
            Desktop : full width, 230px tall
        ────────────────────────────────────────────────────────────── */}
        <div className="relative h-[200px] w-full flex-shrink-0 overflow-hidden sm:h-[230px]">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="absolute left-3 top-3">
            <FoodBadge type={product.type} />
          </div>
        </div>

        {/* ── CONTENT ────────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">

          {/* 1. NAME */}
          <h3 className="text-[17px] font-semibold leading-snug text-[#111827] sm:text-lg">
            {product.name}
          </h3>

          {/* 2. CATEGORY & GOAL */}
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">
            {product.category} • {product.goal}
          </p>

          {/* 3. PRICE */}
          <div className="mt-2">
            {hasDiscount ? (
              <div className="flex items-center gap-2">
                <p className="text-xl font-bold text-brand-dark sm:text-2xl">
                  ₹{product.sellingPrice.toFixed(2)}
                </p>
                <div className="flex flex-col">
                 
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.price.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xl font-bold text-brand-dark sm:text-2xl">
                ₹{product.price.toFixed(2)}
              </p>
            )}
          </div>

          {/* 4. DESCRIPTION */}
          <div className="mt-2">
            <p
              className="text-xs leading-5 text-gray-600"
              style={
                expanded
                  ? {}
                  : {
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }
              }
            >
              {product.description}
            </p>

            {/* {showMore && (
              <button
                onClick={toggleExpanded}
                className="mt-1 text-xs font-semibold text-[var(--color-brand-dark)]"
              >
                {expanded ? 'Less' : 'More'}
              </button>
            )}
          </div> */}

           <div className="h-4">
              {showMore && (
                <button
                  onClick={() => setExpanded(prev => !prev)}
                  className="text-xs cursor-pointer font-semibold text-[var(--color-brand-dark)]"
                >
                  {expanded ? 'Less' : 'More'}
                </button>
              )}
            </div>
          </div>
          

          {/* 5. NUTRITION PILLS */}
          <div className="mt-2 grid grid-cols-4 text-xs gap-1.5 text-center sm:gap-2">
            <NutritionPill label="Cals" value={product.calories} />
            <NutritionPill label="Prot" value={`${product.protein}g`} />
            <NutritionPill label="Carb" value={`${product.carbs}g`} />
            <NutritionPill label="Fat"  value={`${product.fat}g`} />
          </div>

          {/* 6. FOOTER — weight badge + cart control */}
          <div className="mt-2 flex items-center justify-between gap-3">
          
          {product.weight ? (
            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
             <WeightTilde  className='inline size-5' /> {product.weight}
            </span>
          ) : (
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-600"> 
             {/* <WeightTilde  className='inline size-5' /> N/A */}
            </span>
          )}

            {qty === 0 ? (
              <button
                onClick={onAdd}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--color-brand-dark)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-deeper)]"
              >
                <Plus size={16} />
                Add
              </button>
            ) : (
              <div className="inline-flex items-center rounded-full bg-[var(--color-brand-dark)] p-1 text-white shadow">
                <button
                  onClick={onMinus}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-white/10"
                >
                  <Minus size={16} />
                </button>
                <span className="min-w-[34px] text-center text-sm font-bold">
                  {qty}
                </span>
                <button
                  onClick={onPlus}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-white/10"
                >
                  <Plus size={16} />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

    </article>

    
  )
}