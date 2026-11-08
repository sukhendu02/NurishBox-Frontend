import { useRef } from "react";
import { Activity,
  
  AlertTriangle,
  CheckCircle2,
  Flame,
  Leaf,
  List,
  Scale,
  Star,
  Timer,
  UtensilsCrossed,
  Plus,
  Minus,
  } from "lucide-react";
import Popup from "../ui/Popup";
// import CartControl from "../../temp/product-detail/CartControl";
// import FoodBadge from "./FoodBadge";
import { formatPrice, getDiscount, isInStock } from "../../utils/productUtils";

/**
 * Product detail popup. Open it by passing a product; close it with onClose.
 * Cart props are the same ones ProductCard takes, so the cart behaves the same.
 *
 * Uses the card's fields: name, image, type, category, goal, price, sellingPrice,
 * description, calories, protein, carbs, fat, weight, inventory.
 * Optional fields — each section only renders when its field is present:
 *   sku, tags[], rating, ratingCount, sourcing, cookTime, spiceLevel,
 *   fiber, micronutrients[{ label, value }], ingredients[], allergens
 */
export default function ProductDetailPopup({ product, onClose, qty, canOrder, message, onAdd, onMinus, onPlus }) {
  // Keep the last product so the content stays visible during the close animation
  const lastProduct = useRef(product);
  if (product) lastProduct.current = product;
  const p = product || lastProduct.current;

  return (
    <Popup
      open={Boolean(product)}
      onClose={onClose}
      labelledBy="product-detail-title"
      footer={
        p && (
          <PopupFooter product={p} qty={qty} canOrder={canOrder} message={message} onAdd={onAdd} onMinus={onMinus} onPlus={onPlus} />
        )
      }
    >
      {p && <ProductDetail product={p} />}
    </Popup>
  );
}

/* ---------------- Content ---------------- */

function ProductDetail({ product: p }) {
  const discount = getDiscount(p);
  const inStock = isInStock(p);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* LEFT / TOP: image + kitchen details */}
      <div className="flex w-full shrink-0 flex-col bg-stone-100 lg:w-[48%]">
        <div className="relative h-[260px] w-full overflow-hidden bg-stone-200 sm:h-[320px] lg:h-[360px]">
          <img src={p.image} alt={p.name} className={`h-full w-full object-cover ${inStock ? "" : "grayscale"}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
            {/* <FoodBadge type={p.type} /> */}
            {p.goal && (
              <span className="flex items-center gap-1 rounded-full bg-[var(--color-brand-dark)]/95 px-3 py-1 text-xs font-bold text-white shadow-sm">
                <Flame size={14} /> {p.goal}
              </span>
            )}
          </div>

          {!inStock && (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold text-gray-700 shadow">
              Out of Stock
            </span>
          )}

          <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-white">
            {p.weight && (
              <OverlayPill>
                <Scale size={14} className="text-emerald-400" /> Net Weight: {p.weight}
              </OverlayPill>
            )}
            {p.rating && (
              <OverlayPill>
                <Star size={14} className="fill-amber-400 text-amber-400" /> {p.rating}
                {p.ratingCount ? ` (${p.ratingCount} ratings)` : ""}
              </OverlayPill>
            )}
          </div>
        </div>

        {(p.sourcing || p.cookTime || p.spiceLevel) && (
          <div className="flex flex-1 flex-col gap-4 border-t border-stone-200/70 bg-white p-5 sm:p-6 lg:bg-stone-50/70">
            {p.sourcing && (
              <div>
                <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[var(--color-brand-dark)]">
                  <Leaf size={14} /> Sourcing
                </p>
                <p className="mt-1 text-xs leading-relaxed text-stone-600">{p.sourcing}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              {p.cookTime && <InfoTile icon={Timer} label="Cook Time" value={p.cookTime} />}
              {p.spiceLevel && <InfoTile icon={Flame} label="Spiciness" value={p.spiceLevel} valueClass="text-amber-700" />}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT / BOTTOM: details */}
      <div className="w-full space-y-5 bg-white p-5 sm:p-7 lg:w-[52%]">
        <div>
          <div className="flex items-center justify-between gap-2 pr-10 lg:pr-12">
            {p.category && (
              <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-[var(--color-brand-dark)]">
                {p.category}
              </span>
            )}
            {p.sku && <span className="text-xs font-bold text-stone-400">SKU #{p.sku}</span>}
          </div>

          <h2 id="product-detail-title" className="mt-2 text-2xl font-extrabold tracking-tight text-stone-900 sm:text-3xl">
            {p.name}
          </h2>
          {p.tags?.length > 0 && (
            <p className="mt-0.5 text-xs font-bold uppercase tracking-wider text-stone-400">{p.tags.join(" • ")}</p>
          )}

          <div className="mt-3 flex flex-wrap items-baseline gap-3 border-b border-stone-100 pb-4">
            <span className="text-3xl font-extrabold tracking-tight text-[var(--color-brand-dark)]">{formatPrice(p.sellingPrice)}</span>
            {discount && (
              <>
                <span className="text-base font-semibold text-stone-400 line-through">{formatPrice(p.price)}</span>
                <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  Save {formatPrice(discount.save)} ({discount.percent}% off)
                </span>
              </>
            )}
          </div>
        </div>

        {p.description && (
          <Block icon={UtensilsCrossed} title="Dish Description">
            <p className="text-xs leading-relaxed text-stone-600">{p.description}</p>
          </Block>
        )}

        {/* Nutrition */}
        <div className="rounded-2xl border border-stone-200/70 bg-stone-50 p-4">
          <h4 className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-800">
            <Activity size={14} className="text-[var(--color-brand-dark)]" />
            Nutrition{p.weight ? ` (per ${p.weight} serving)` : ""}
          </h4>
          <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
            <MacroTile label="Calories" value={p.calories} unit="kcal" />
            <MacroTile label="Protein" value={`${p.protein}g`} highlight />
            <MacroTile label="Carbs" value={`${p.carbs}g`} unit={p.fiber ? `${p.fiber}g fibre` : undefined} />
            <MacroTile label="Fats" value={`${p.fat}g`} />
          </div>
          {p.micronutrients?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 border-t border-stone-200/60 pt-2.5 text-[11px] text-stone-600">
              {p.micronutrients.map((m) => (
                <span key={m.label} className="inline-flex items-center gap-1 rounded-md border border-stone-200/50 bg-white px-2 py-0.5">
                  <CheckCircle2 size={12} className="text-emerald-600" /> {m.label}: {m.value}
                </span>
              ))}
            </div>
          )}
        </div>

        {p.ingredients?.length > 0 && (
          <Block icon={List} title="Ingredients">
            <div className="flex flex-wrap gap-1.5">
              {p.ingredients.map((item) => (
                <span key={item} className="rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700">
                  {item}
                </span>
              ))}
            </div>
          </Block>
        )}

        {p.allergens && (
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-200/70 bg-amber-50/80 p-3">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-700" />
            <div>
              <p className="text-xs font-bold text-amber-900">Allergen Notice</p>
              <p className="text-[11px] leading-normal text-amber-800">{p.allergens}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PopupFooter({
  product,
  qty = 0,
  canOrder,
  message,
  onAdd,
  onMinus,
  onPlus,
}) {
  const inStock = isInStock(product);
  const unavailable = !canOrder || !inStock;

  return (
    <div className="flex items-center justify-between gap-3">
      {/* Price */}
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
          {qty > 0 ? `${qty} in cart` : "Price"}
        </p>

        <p className="text-lg font-extrabold text-stone-900">
          {formatPrice(product.sellingPrice * Math.max(qty, 1))}
        </p>
      </div>

      {/* Cart actions */}
      <div className="flex shrink-0 items-center">
        {unavailable ? (
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-400"
          >
            {!canOrder ? message || "Currently unavailable" : "Out of Stock"}
          </button>
        ) : qty === 0 ? (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-brand-dark)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--color-brand-deeper)] active:scale-95"
          >
            <Plus size={18} />
            Add to Cart
          </button>
        ) : (
          <div className="inline-flex items-center gap-1 rounded-full bg-[var(--color-brand-dark)] p-1.5 text-white shadow-sm">
            <button
              type="button"
              onClick={onMinus}
              aria-label="Decrease quantity"
              className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15 active:scale-90"
            >
              <Minus size={18} />
            </button>

            <span className="min-w-9 text-center text-sm font-bold tabular-nums">
              {qty}
            </span>

            <button
              type="button"
              onClick={onPlus}
              aria-label="Increase quantity"
              className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15 active:scale-90"
            >
              <Plus size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Small pieces ---------------- */

function OverlayPill({ children }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 backdrop-blur-md">{children}</span>
  );
}

function InfoTile({ icon: Icon, label, value, valueClass = "text-stone-800" }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-stone-200/80 bg-white p-2.5 text-xs">
      <Icon size={16} className="shrink-0 text-[var(--color-brand-dark)]" />
      <div>
        <span className="block text-[10px] font-bold uppercase text-stone-400">{label}</span>
        <span className={`font-bold ${valueClass}`}>{value}</span>
      </div>
    </div>
  );
}

function MacroTile({ label, value, unit, highlight = false }) {
  return (
    <div className={`rounded-xl border p-2.5 ${highlight ? "border-emerald-200 bg-emerald-50/60" : "border-stone-200/50 bg-white"}`}>
      <span className={`block text-[10px] font-bold uppercase ${highlight ? "text-[var(--color-brand-dark)]" : "text-stone-400"}`}>{label}</span>
      <span className={`text-base font-extrabold ${highlight ? "text-[var(--color-brand-dark)]" : "text-stone-900"}`}>{value}</span>
      {unit && <span className="block text-[9px] text-stone-400">{unit}</span>}
    </div>
  );
}

function Block({ icon: Icon, title, children }) {
  return (
    <div>
      <h4 className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-stone-900">
        <Icon size={16} className="text-[var(--color-brand-dark)]" /> {title}
      </h4>
      {children}
    </div>
  );
}
