import React, { useEffect, useState } from 'react';
import Popup from '../../components/ui/popup';
import { Loader2 } from 'lucide-react';

const RATING_LABELS = ['Poor', 'Fair', 'Good', 'Great', 'Loved it'];

const initials = (name) => name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
const toggle = (list, item) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);

/* ---------- Small building blocks ---------- */

function Stars({ value, onChange, label, size = 'h-6 w-6' }) {
  return (
    <div className="flex gap-1.5" role="radiogroup" aria-label={label}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onClick={() => onChange(n)}
          className="rounded transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <svg viewBox="0 0 24 24" className={`${size} ${n <= value ? 'fill-amber-400 stroke-amber-400' : 'fill-none stroke-stone-300'}`} strokeWidth="1.5" aria-hidden="true">
            <path strokeLinejoin="round" d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function TagChips({ tags, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const active = selected.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(tag)}
            className={`rounded-full px-3 py-1 text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
              active ? 'bg-brand-dark text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}

function Section({ title, subtitle, aside, children }) {
  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-gray-700 ">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400 ">{subtitle}</p>}
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

const card = 'rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100';

/* ---------- Popup ---------- */

export default function RateOrderPopup({ open = true, order , onClose = () => {}, onSubmit = () => {}, maxReviewLength = 300 }) {
  const [dishRatings, setDishRatings] = useState({}); // { [dishId]: { stars, tags } }
  const [delivery, setDelivery] = useState({ stars: 0, tags: [] });
  const [review, setReview] = useState('');
  const [photos, setPhotos] = useState([]);

 
  const [isSubmitting, setIsSubmitting] = useState(false);
const [submitError, setSubmitError] = useState("");

const handleSubmit = async () => {
  await onSubmit({
    orderId: order.id,
    dishes: dishes.map((d) => ({
      dishId: d.id,
      ...dishState(d.id),
    })),
    delivery,
    review: review.trim(),

  
  })
}
  if (!open) return null;

  const dishes = (order?.items || []).map((item) => ({
    id: item.id,
    name: item.productName,
    description: `Quantity: ${item.quantity}`,
    image: item.productImage || item.image || null,
    tags: [],
  }));
  
  const points = order?.points || {
    base: 30,
    photoBonus: 10,
  };
  
  const courier = order?.courier || null;
  const dishState = (id) => dishRatings[id] || { stars: 0, tags: [] };
  const updateDish = (id, patch) => setDishRatings((prev) => ({ ...prev, [id]: { ...dishState(id), ...patch } }));

  // const totalPoints = points.base + (photos.length ? points.photoBonus : 0);
  const hasRating = delivery.stars > 0 || Object.values(dishRatings).some((d) => d.stars > 0);

  // const handleSubmit = () =>
  //   onSubmit({
  //     orderId: order.id,
  //     dishes: dishes.map((d) => ({ dishId: d.id, ...dishState(d.id) })),
  //     delivery,
  //     review: review.trim(),
  //     photos,
  //     // points: totalPoints,
  //   });

  return (
    <>
  

  <Popup
    open={open}
    onClose={onClose}
    labelledBy="rate-title"
    footer={
      <div className="space-y-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!hasRating || isSubmitting}
          className="w-full rounded-full 
      
          bg-brand-dark
           cursor-pointer
          py-3.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isSubmitting ? <>
          <Loader2/>
          </> :   "Submit Rating" }
       
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-1 text-xs text-stone-600 cursor-pointer"
        >
          Skip for now
        </button>
      </div>
    }
  >
      

        <div className="space-y-8 overflow-y-auto px-4 pb-4 pt-6 sm:px-6">
          {/* Dishes */}
          <Section
            title={<span id="rate-title">Rate Your Dishes</span>}
            subtitle="Help our culinary artisans refine each organic recipe"
            aside={<span className="mr-8 whitespace-nowrap text-xs font-semibold text-stone-700">{dishes?.length} Items</span>}
          >
            {dishes.map((dish) => {
              const state = dishState(dish.id);
              return (
                <div key={dish.id} className={`${card} space-y-3`}>
                  <div className="flex items-center gap-3">
                    {dish.image ? (
                      <img src={dish.image} alt={dish.name} className="h-12 w-12 shrink-0 rounded-xl object-cover" loading="lazy" />
                    ) : (
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-green-50 text-sm font-bold text-brand-dark">{initials(dish.name)}</div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-stone-900">{dish.name}</p>
                      <p className="truncate text-xs text-stone-500">{dish.description}</p>
                      <p className="text-[11px] font-semibold text-brand-dark">{state.stars ? RATING_LABELS[state.stars - 1] : 'Tap to rate'}</p>
                    </div>
                  </div>
                  <Stars value={state.stars} onChange={(stars) => updateDish(dish.id, { stars })} label={`Rate ${dish.name}`} />
                  <TagChips tags={dish.tags} selected={state.tags} onToggle={(tag) => updateDish(dish.id, { tags: toggle(state.tags, tag) })} />
                </div>
              );
            })}
          </Section>

          {/* Delivery */}
          {/* <Section title="Rate Delivery Experience" subtitle="Celebrate your local zero-emission courier partner">
            <div className={`${card} space-y-4`}>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-green-100 text-sm font-bold text-brand-dark">{initials(courier.name)}</div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-stone-900">{courier.name}</p>
                    {courier.badge && <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-brand-dark">{courier.badge}</span>}
                  </div>
                  <p className="text-xs text-stone-500">Arrived on {courier.vehicle} · {courier.minutes} mins</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 rounded-xl bg-stone-100 p-4">
                <p className="text-xs text-stone-600">{delivery.stars ? RATING_LABELS[delivery.stars - 1] : 'Tap stars to evaluate delivery'}</p>
                <Stars value={delivery.stars} onChange={(stars) => setDelivery((d) => ({ ...d, stars }))} label="Rate delivery" size="h-7 w-7" />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-stone-800">What made {courier.name.split(' ')[0]}'s delivery stand out?</p>
                <TagChips tags={courier.tags} selected={delivery.tags} onToggle={(tag) => setDelivery((d) => ({ ...d, tags: toggle(d.tags, tag) }))} />
              </div>
            </div>
          </Section> */}

          {/* Review */}
          <Section title="Write a Review (Optional)" subtitle="Share your notes with the botanical chefs">
            <div className={`${card} space-y-3`}>
              <label htmlFor="review" className="sr-only">Your review</label>
              <textarea
                id="review"
                rows={4}
                maxLength={maxReviewLength}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Tell us what you loved or how we can make your next healthy feast even better..."
                className="w-full resize-none rounded-xl bg-stone-100 p-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              <div className="flex items-center justify-between gap-3">
                {/* <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-200 focus-within:ring-2 focus-within:ring-brand-primary">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-brand-dark" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2" /><path d="M21 16l-5-5-8 8" /></svg>
                  {photos.length ? `${photos.length} photo${photos.length > 1 ? 's' : ''} added` : 'Add dish photos'}
                  <span className="font-semibold text-brand-dark">+{points.photoBonus} pts</span>
                  <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => setPhotos(Array.from(e.target.files || []))} />
                </label> */}
                <span className="text-xs text-stone-500">{review.length} / {maxReviewLength}</span>
              </div>
            </div>
          </Section>
        </div>

        </Popup>
      </>
  );
}
