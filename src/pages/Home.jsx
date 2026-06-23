import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Flame,
  Leaf,
  Target,
  SlidersHorizontal,
  ArrowRight,
  Minus,
  Plus,
  X,
  Check,
  Loader,
  WeightTilde,
  Quote,
} from 'lucide-react'

import { useProductStore } from '../store/productStore';
import useCartStore from '../store/cartStore';
import FoodBadge from '../components/menu/FoodBadge';
import ProductSkeleton from '../components/menu/ProductSkeleton';
import NutritionPill from '../components/menu/NutritionPill';
import SidebarCard from '../components/menu/SidebarCard';
import ProductCard from '../components/menu/ProductCard';
import KitchenStatusBanner from "../components/menu/KitchenStatusBanner"
const promoSlides = [
  {
    id: 1,
    kind: 'image',
    tag: 'Seasonal Offer',
    title: 'Summer Glow Power Bowls',
    subtitle:
      'Fresh, high-energy meals crafted for lighter days, cleaner eating, and vibrant nutrition.',
    ctaPrimary: 'Order Now',
    ctaSecondary: 'View Menu',
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1400&auto=format&fit=crop',
    overlay: 'from-black/60 via-black/20 to-emerald-950/30',
  },
  {
    id: 2,
    kind: 'image',
    tag: 'Protein Drop',
    title: 'Lean Performance Meals',
    subtitle:
      'Packed with protein, balanced carbs, and recovery-friendly ingredients for active lifestyles.',
    ctaPrimary: 'Explore Meals',
    ctaSecondary: 'See Plans',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1400&auto=format&fit=crop',
    overlay: 'from-black/65 via-black/20 to-orange-950/20',
  },
  {
    id: 3,
    kind: 'ad',
    tag: 'Fresh Subscription',
    title: 'Save up to 30% with Weekly Plans',
    subtitle:
      'Flexible meal subscriptions, zero cooking stress, better macros, and doorstep delivery.',
    ctaPrimary: 'Join Now',
    ctaSecondary: 'Compare Plans',
    accent: '#E8A020',
    bg: 'linear-gradient(135deg, #065443 0%, #0D9E7E 55%, #5ECBA8 100%)',
  },
  // supported video slide structure:
  // {
  //   id: 4,
  //   kind: 'video',
  //   tag: 'Kitchen Stories',
  //   title: 'Crafted Fresh Every Morning',
  //   subtitle: 'Real prep, real ingredients, real nutrition.',
  //   ctaPrimary: 'Watch',
  //   ctaSecondary: 'Order Today',
  //   video: 'your-cdn-video.mp4',
  //   poster: 'your-poster.jpg',
  //   overlay: 'from-black/60 via-black/30 to-black/40',
  // },
]

const goals = [
  {
    id: 'protein',
    title: 'High Protein',
    subtitle: 'Muscle recovery & strength support.',
    metricLabel: 'Daily Target',
    metricValue: '140g+',
    progress: 78,
    color: '#0A7560',
    icon: Dumbbell,
  },
  {
    id: 'keto',
    title: 'Keto',
    subtitle: 'Low carb, high energy fuel.',
    metricLabel: 'Net Carbs',
    metricValue: '<30g',
    progress: 62,
    color: '#E85D20',
    icon: Flame,
  },
  {
    id: 'plant',
    title: 'Plant-Based',
    subtitle: 'Organic, fiber-rich vegan options.',
    metricLabel: 'Fiber Content',
    metricValue: '45g+',
    progress: 84,
    color: '#0D9E7E',
    icon: Leaf,
  },
  {
    id: 'lowcal',
    title: 'Low Calorie',
    subtitle: 'Weight-friendly, portion-smart meals.',
    metricLabel: 'Max Per Meal',
    metricValue: '450 kcal',
    progress: 54,
    color: '#65A30D',
    icon: Target,
  },
]

const categories = [
  'All Items',
  'Bowls',
  'Salads',
  'Burgers',
  'Wraps',
  'Snacks',
  'Meal Kits',
]

// ── Sort options match your sortMap in service ────────────────────
const sortOptions = [
  { value: "",             label: "Recommended" },
  { value: "price_asc",   label: "Price: Low to High" },
  { value: "price_desc",  label: "Price: High to Low" },
  { value: "calories_asc",label: "Calories: Low to High" },
  { value: "popular",     label: "Most Popular" },
  { value: "newest",      label: "Newest First" },
];


export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [activeCategory, setActiveCategory] = useState('All Items')
  const [cart, setCart] = useState({})

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(8)
  const sentinelRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % promoSlides.length)
    }, 4500)

    return () => clearInterval(timer)
  }, [])

 


  ///////////////////////////////////////////
   const {
      products, total, isLoading, isFetchingMore,
      hasNext, filters, fetchProducts, loadMore,
      setFilter, resetFilters,
       status, canOrder, message,
    } = useProductStore();
  
    const hasActiveFilters = 
  filters.category !== 'All Items' ||
  filters.type !== '' ||
  filters.sortBy !== '' ||
  filters.discounted !== ''
    // ── Initial load ──────────────────────────────────────────────
    useEffect(() => {
      fetchProducts();
    }, []);
  
    // ── Infinite scroll ───────────────────────────────────────────
    useEffect(() => {
      const node = sentinelRef.current;
      if (!node) return;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNext && !isFetchingMore) {
            loadMore();
          }
        },
        { rootMargin: "400px" }
      );
      observer.observe(node);
      return () => observer.disconnect();
    }, [hasNext, isFetchingMore]);
  
    // ── Map API response to ProductCard props ─────────────────────
    const mapProduct = (p) => ({
      id:           p.id,
      name:         p.name,
      category:     p.category,
      type:         p.type === "VEG" ? "veg" : "non-veg",
      image:        p.imageUrl || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600`,
      description:  p.description || "",
      price:        parseFloat(p.basePrice),
      sellingPrice: p.discountPrice ? parseFloat(p.discountPrice) : parseFloat(p.basePrice),
      calories:     p.caloriesKcal  || 0,
      protein:      parseFloat(p.proteinG  || 0),
      carbs:        parseFloat(p.carbsG    || 0),
      fat:          parseFloat(p.fatG      || 0),
      weight:       p.weight        || null,
      goal:         p.goal          || "",
       inventory:   p.inventory || [],
    });
  



    // -------- CART FUNTIONALITY ------------
    const addItem        = useCartStore((state) => state.addItem)
const updateQuantity = useCartStore((state) => state.updateQuantity)
const removeItem     = useCartStore((state) => state.removeItem)
const items          = useCartStore((state) => state.items)       // ← reactive


  return (
    <div className="bg-[#FBFAF7]">
      <main className="mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        {/* Promo */}
        <section className="relative overflow-hidden rounded-[28px] bg-white shadow-sm">
          <div className="relative h-[240px] sm:h-[360px] lg:h-[460px]">
            {promoSlides.map((slide, index) => {
              const isActive = index === activeSlide

              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-700 ${
                    isActive
                      ? 'pointer-events-auto opacity-100'
                      : 'pointer-events-none opacity-0'
                  }`}
                >
                  {slide.kind === 'image' && (
                    <>
                      <img
                        src={slide.image}
                        alt={slide.title}
                        loading="eager"
                        className="h-full w-full object-cover"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`}
                      />
                    </>
                  )}

                  {slide.kind === 'video' && (
                    <>
                      <video
                        className="h-full w-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        poster={slide.poster}
                      >
                        <source src={slide.video} type="video/mp4" />
                      </video>
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`}
                      />
                    </>
                  )}

                  {slide.kind === 'ad' && (
                    <div
                      className="absolute inset-0"
                      style={{ background: slide.bg }}
                    >
                      <div className="absolute -right-8 -top-10 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
                      <div className="absolute bottom-0 right-6 h-48 w-48 rounded-full bg-[#E8A020]/25 blur-3xl" />
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-end sm:items-center">
                    <div className="grid h-full w-full grid-cols-1 gap-6 p-5 sm:p-8 lg:grid-cols-2 lg:p-12">
                      <div className="flex flex-col justify-end lg:justify-center">
                        <span className="mb-4 inline-flex w-fit rounded-full bg-[#D94C1A] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow">
                          {slide.tag}
                        </span>

                        <h1 className="max-w-xl text-3xl font-extrabold leading-[0.95] text-white sm:text-5xl lg:text-6xl">
                          {slide.title}
                        </h1>

                        <p className="mt-4 max-w-lg text-sm leading-6 text-white/85 sm:text-base">
                          {slide.subtitle}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                          <button className="rounded-full bg-[var(--color-brand-dark)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:translate-y-[-1px] hover:bg-[var(--color-brand-deeper)]">
                            {slide.ctaPrimary}
                          </button>
                          <button className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15">
                            {slide.ctaSecondary}
                          </button>
                        </div>
                      </div>

                      <div className="hidden lg:block" />
                    </div>
                  </div>
                </div>
              )
            })}

            {/* controls currosel */}
            {/* <button
              onClick={() =>
                setActiveSlide((prev) =>
                  prev === 0 ? promoSlides.length - 1 : prev - 1
                )
              }
              className="absolute left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg backdrop-blur hover:bg-white md:flex"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() =>
                setActiveSlide((prev) => (prev + 1) % promoSlides.length)
              }
              className="absolute right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg backdrop-blur hover:bg-white md:flex"
            >
              <ChevronRight size={20} />
            </button> */}

            <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {promoSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeSlide ? 'w-10 bg-white' : 'w-2 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Goal */}
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-[#111827]">
                Eat by Goal
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Precision nutrition tailored to your lifestyle.
              </p>
            </div>

            <button className="hidden items-center gap-2 text-sm font-semibold text-[var(--color-brand-dark)] md:flex">
              Browse all goals <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {goals.map((goal) => {
              const Icon = goal.icon
              return (
                <button
                  key={goal.id}
                  className="rounded-[24px] bg-white p-5 text-left shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${goal.color}12` }}
                  >
                    <Icon size={22} style={{ color: goal.color }} />
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-[#111827]">
                    {goal.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    {goal.subtitle}
                  </p>

                  <div className="mt-5 flex items-center justify-between text-[11px] font-medium uppercase tracking-wide text-gray-500">
                    <span>{goal.metricLabel}</span>
                    <span className="text-[#111827]">{goal.metricValue}</span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${goal.progress}%`,
                        backgroundColor: goal.color,
                      }}
                    />
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* subscription */}
        <section className="mt-10">
          <div className="overflow-hidden rounded-[30px] bg-[#EEF0EA] shadow-sm ring-1 ring-black/5">
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="flex items-center p-6 sm:p-8 lg:p-10">
                <div className="max-w-xl">
                  <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-brand-dark)]">
                    Vitality Pass
                  </span>

                  <h3 className="mt-4 text-3xl font-extrabold leading-tight text-[#111827] sm:text-5xl">
                    Fresh Subscription Plans
                  </h3>
                  <p className="mt-4 max-w-lg text-base leading-7 text-gray-600">
                    Save up to 30% on curated weekly meals, expert nutrition-led
                    menus, and flexible delivery that fits your schedule.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="rounded-full bg-[var(--color-brand-dark)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-deeper)]">
                      Explore Plans
                    </button>
                    <button className="rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-white">
                      How it Works
                    </button>
                  </div>
                </div>
              </div>

              <div className="hidden md:block relative min-h-[260px]">
                <img
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop"
                  alt="Fresh subscription vegetables"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* mobile categories + filters */}
        <section className="mt-8 lg:hidden">
          <div className="no-scrollbar flex gap-3 overflow-x-auto  [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap rounded-full px-5 py-3 text-sm font-semibold transition ${
                  activeCategory === cat
                    ? 'bg-[var(--color-brand-dark)] text-white shadow-md'
                    : 'bg-white text-gray-700 ring-1 ring-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <select
              value={filters.sortBy}
              onChange={(e) => setFilter("sortBy", e.target.value)}
              className="h-11 flex-1 rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 outline-none"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Sort: {opt.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-gray-700 ring-1 ring-gray-200"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>
        </section>

        {/* desktop layout */}
        <section className="mt-10 grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-4 space-y-5">
            
             
              <SidebarCard title="Categories">
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilter("category", cat)}
                      className={`rounded-2xl px-4 py-3 m-1 text-left text-xs cursor-pointer font-semibold transition ${
                        filters.category === cat
                          ? 'bg-[var(--color-brand-primary)] text-white ring-1 ring-[var(--color-brand-tint)]'
                          : 'bg-white text-gray-700 hover:bg-gray-50 ring-1 ring-gray-100'
                      }`}
                    >
                      {cat}
                      {/* {filters.category === cat && <Check size={15} />} */}
                    </button>
                  ))}
                </div>
              </SidebarCard>

              <SidebarCard title="Food Type">
                <div className="space-y-2">
                  {[
                    { value: '', label: 'Both' },
                    { value: 'veg', label: 'Veg Only' },
                    { value: 'non-veg', label: 'Non-Veg Only' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setFilter("type", item.value)}
                      className={`items-left rounded-2xl px-3 py-3 m-1 text-xs cursor-pointer font-medium transition ${
                        filters.type === item.value
                          ? 'bg-[var(--color-brand-primary)] text-white ring-1 ring-[var(--color-brand-tint)]'
                          : 'bg-white text-gray-700 hover:bg-gray-50 ring-1 ring-gray-100'
                      }`}
                    >
                      {item.label}
                      {/* {filters.type === item.value && <Check size={15} />} */}
                    </button>
                  ))}
                </div>
              </SidebarCard>

              <SidebarCard title="Sort By">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilter("sortBy", e.target.value)}
                  className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-xs cursor-pointer font-medium text-gray-700 outline-none"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl text-xs  px-4 py-3 ring-1 ring-gray-100">
                  <input
                    type="checkbox"
                    checked={filters.discounted === "true"}
                    onChange={(e) => setFilter("discounted", e.target.checked ? "true" : "")}
                    className="h-4 w-4 accent-[var(--color-brand-dark)]"
                  />
                  <span className="text-sm text-xs text-gray-700">
                    Discounted only
                  </span>
                </label>
              </SidebarCard>

              <div className="overflow-hidden rounded-[28px] bg-[#EAF0E6] p-5 shadow-sm ring-1 ring-black/5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-brand-dark)]">
                  Vitality Pass
                </p>
                <h4 className="mt-3 text-2xl font-bold text-[#111827]">
                  Join our meal subscription
                </h4>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Free delivery, nutrition support, better savings, cleaner
                  eating.
                </p>
                <button className="mt-5 w-full rounded-full bg-[var(--color-brand-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-deeper)]">
                  Join Now
                </button>
              </div>
            </div>
          </aside>

          {/* products */}
          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-[#111827]">
                  Featured Meals
                </h2>
    
                <p className="mt-1 text-sm text-gray-500">
                  {/* {filteredProducts.length} items matched to your selection */}
                        {isLoading
                    ? <Loader size={14} />
                    : `${total} item${total !== 1 ? "s" : ""} matched`}
                </p>
              </div>           
            </div>

                              <KitchenStatusBanner
        status={status}
        message={message}
      />

        
                       {/* Initial skeleton */}
            {isLoading && products.length === 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
  {products.map((product) => {
    // Find this product in cart using subscribed items array
    const cartItem = items.find((i) => i.product?.id === product.id) || null
    const qty      = cartItem?.quantity || 0
      return (
      <ProductCard
        key={product.id}
        product={mapProduct(product)}
        qty={qty}
        canOrder={canOrder}
        status={status}  
        message={message}
        onAdd={() => addItem(product.id, 1)}
        onPlus={() => {
          if (cartItem) updateQuantity(cartItem.id, qty + 1)
        }}
        onMinus={() => {
          if (!cartItem) return
          if (qty === 1) {
            removeItem(cartItem.id)
          } else {
            updateQuantity(cartItem.id, qty - 1)
          }
        }}
      />
    )
  })}
</div>
            <div ref={sentinelRef} className="h-14" />
                {/* End of list */}
                {!hasNext && products.length > 0 && !isLoading && (
                  <p className="text-center text-sm text-gray-400">
                    {/* You are all caught up! No more meals to show. */}
                  </p>
                )}

                {/* Empty state */}
                {!isLoading && products.length === 0 && (   
                  
                    hasActiveFilters ? (      
                  <div className="rounded-[28px] mb-14 bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
                    <h3 className="text-xl font-semibold text-[#111827]">
                      No meals found
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Try changing your filters.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="mt-4 cursor-pointer rounded-full bg-[var(--color-brand-dark)] px-6 py-2.5 text-sm font-semibold text-white"
                    >
                      Reset Filters
                    </button>
                    <div>
         
                    </div>
                  </div>
                    ):(

                       null
        

                     
                    )
                )}
            </>
              )}
          </div>
        </section>
      </main>

      {/* mobile filters sheet */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/35"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 rounded-t-[28px] bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#111827]">More Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>


            <div className="space-y-5">
              <div>
                <p className="mb-3 text-sm font-semibold text-gray-900">
                  Food Type
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: '', label: 'Both' },
                    { value: 'veg', label: 'Veg' },
                    { value: 'non-veg', label: 'Non-Veg' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setFilter("type", item.value)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        filters.type === item.value
                          ? 'bg-[var(--color-brand-dark)] text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-gray-900">
                  Category
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilter("category", cat)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        filters.category === cat
                          ? 'bg-[var(--color-brand-dark)] text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3">
                <input
                  type="checkbox"
                  checked={filters.discounted === "true"}
                  onChange={(e) => setFilter("discounted", e.target.checked ? "true" : "")}
                  className="h-4 w-4 accent-[var(--color-brand-dark)]"
                />
                <span className="text-sm font-medium text-gray-700">
                  Show discounted items only
                </span>
              </label>
            </div>

            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 mb-25 w-full rounded-full bg-[var(--color-brand-dark)] py-3 text-sm font-semibold text-white"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}


      <div className='mb-6'>
        {/* <p className='italic text-sm text-center text-slate-400'>Thats all for now! Healthy lifestyle! </p> */}
        {/* Give a very healty quote for healty lifestyle */}
      </div>
    </div>
  )
}













