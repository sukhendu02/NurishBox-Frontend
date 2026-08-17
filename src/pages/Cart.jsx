import { useState, useEffect, useRef } from "react";
import useCartStore from "../store/cartStore";
import { Link } from "react-router-dom";
import {ShoppingCart, Tag,Star, Flame,ChevronRight, CreditCard,Plus, Banknote,X , BanknoteArrowDownIcon, ArrowBigDownDash, ChevronUp,CheckCircle, AlertCircle, icons, ArrowRightLeft, ArrowBigRight, Cross} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../utils/token";
import Checkout from "./Checkout";
import useUserStore from "../store/userStore";
import useOrderStore from "../store/orderStore";
import SelectedAddressCard from "../components/cart/SelcectedAddress";
import useAddressStore from "../store/addressStrore.js";
import { useProductStore } from "../store/productStore.js";
import {CartStatusBanner} from "../components/cart/CartStatusBanner.jsx"
import MobileFixedCTA from "../components/cart/MobileFixedCTA.jsx";
import { DELIVERY_CONFIG } from "../constant/deliveryConstant.js";
import OffersSheet from '../components/coupon/OfferSheet.jsx'
// ─── SUGGESTIONS (static catalogue – swap with API if needed) ─────────────────
const SUGGESTIONS = [
  { id: "s1", name: "Avocado Side",    price: 3.5,  img: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300" },
  { id: "s2", name: "Kombucha",        price: 5.5,  img: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=300" },
  { id: "s3", name: "Chia Pudding",    price: 4.5,  img: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=300" },
  { id: "s4", name: "Wild Berry Shake",price: 5.0,  img: "https://images.unsplash.com/photo-1553530979-7ee2de5a1781?w=300" },
  { id: "s5", name: "Green Detox",     price: 6.0,  img: "https://images.unsplash.com/photo-1622597467836-f3e80a56a74e?w=300" },
];

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const I = {
  back:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  trash:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  plus:    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="7" y1="1" x2="7" y2="13"/><line x1="1" y1="7" x2="13" y2="7"/></svg>,
  minus:   <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="1" y1="7" x2="13" y2="7"/></svg>,
  shield:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  lock:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  cc:      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  arrow:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  chevR:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  question:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg>,
  leaf:    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 2s5 0 12 7c5 5 6 13 6 13s-8-1-13-6C0 9 2 2 2 2z"/></svg>,
  truck:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 4v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  tag:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  empty:   <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.95-1.56l1.65-7.44H6"/></svg>,
  cc:<CreditCard/>,
  cash:<Banknote/>
};

// ─── SKELETON ─────────────────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-gradient-to-r from-[#e8f0e8] via-[#f3f8f3] to-[#e8f0e8] bg-[length:200%_100%] rounded-lg ${className}`} style={{ backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />;
}

function CartItemSkeleton() {
  return (
    <div className="flex gap-4 py-5 border-b border-[#eef2ee] last:border-0">
      <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex justify-between items-center mt-3">
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

function SummarySkeleton() {
  return (
    <div className="space-y-3 p-6">
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-10 w-full rounded-xl" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-1 w-full mt-2" />
      <Skeleton className="h-6 w-full mt-2" />
      <Skeleton className="h-12 w-full rounded-xl mt-4" />
    </div>
  );
}

// ─── FREE DELIVERY BAR ────────────────────────────────────────────────────────
function FreeDeliveryBar({ freeDeliveryIn, subtotal, threshold = 299 }) {
  const pct = Math.min(100, Math.max(4, ((threshold - freeDeliveryIn) / threshold) * 100));
  const unlocked = freeDeliveryIn <= 0;

  return (
    <div className="bg-white border-b  ring-1 ring-gray-200/5 rounded-lg  border-[#eef2ee] px-4 py-3 my-2 md:px-6">
      <div className="max-w-[1150px] mx-auto">
        {unlocked ? (
          <div className="flex items-center gap-2 text-[#0D9E7E] font-semibold text-sm">
            <span>{I.truck}</span>
            <span> You've unlocked <strong>free delivery!</strong></span>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-[#1a2e1a]">
                {I.truck}
                <span>Add <span className="text-[#0D9E7E]">₹{freeDeliveryIn.toFixed(0)}</span> more for free delivery</span>
              </div>
              <span className="text-[11px] text-[#aaa] font-medium">₹{(threshold - freeDeliveryIn).toFixed(0)} / ₹{threshold}</span>
            </div>
            <div className="h-1.5 bg-[#eef2ee] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${pct}%`, background: "linear-gradient(90deg, #0D9E7E, #5ecba8)" }}
              />
            </div>
            <p className="text-[11px] text-[#bbb] italic mt-1">
              {pct < 50 ? "Keep going — free delivery is within reach!" : "Almost there! One more item to unlock free shipping."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CART ITEM CARD ───────────────────────────────────────────────────────────
function CartItemCard({ item, updateQuantity, removeItem,isUnavailable}) {
  const img = item.product?.photoUrl || item.product?.imageUrl;
  const name = item.product?.name ?? "Item";
  const desc = item.product?.description ?? "";
  // console.log(isUnavailable)

  const handleMinus = () => {
    if (item.quantity === 1) removeItem(item.id);
    else updateQuantity(item.id, item.quantity - 1);
  };

  return (<>
  
 
    <div className={`flex gap-4  md:gap-5 py-5 border-b border-[#eef2ee] last:border-0 items-start group ${isUnavailable? "grayscale opacity-85":""}`}>
      {/* Image */}
      <div className="w-[76px] h-[76px] md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#E8F8F3]">
        {img && <img src={img} alt={name} className="w-full h-full object-cover" />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <p className="font-semibold text-[15px] md:text-[17px] text-[#1a2e1a] pr-2 leading-tight">{name}</p>
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-[15px] md:text-[17px] text-[#0D9E7E]">₹{item.itemTotal?.toFixed(2)}</p>
            {item.hasDiscount && item.itemSavings > 0 && (
              <p className="text-[11px] text-slate-400 font-semibold">Save ₹{item.itemSavings.toFixed(2)}</p>
            )}
          </div>
        </div>

        {desc && <p className="text-[13px] text-[#999] mt-1 leading-snug line-clamp-2">{desc}</p>}

        {item.product?.weight && (
          <span className="inline-block mt-1 text-[11px] font-semibold text-[#aaa] bg-[#f5f8f5] px-2 py-0.5 rounded-full">{item.product.weight}</span>
        )}

        <div className="flex items-center justify-between mt-3">

 {isUnavailable ? (
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
              Not available currently
            </span>
          ) :(<>
         

         
         
          {/* Qty control */}
          <div className="inline-flex items-center border-[1.5px] border-[#dde8dd] rounded-lg bg-[#f8faf8]">
            <button
              onClick={handleMinus}
              className="w-8 h-8 flex cursor-pointer bg-brand-surface text-brand-dark items-center justify-center text-[#555] hover:text-[#0D9E7E] hover:bg-[#f0f9f5] rounded-l-lg transition-colors"
            >
              {I.minus}
            </button>
            <span className="w-7 text-center text-[14px] font-bold text-[#1a2e1a] select-none">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= 20}
              className="w-8 h-8 flex cursor-pointer bg-brand-surface text-brand-dark items-center justify-center text-[#555] hover:text-[#0D9E7E] hover:bg-[#f0f9f5] rounded-r-lg transition-colors disabled:opacity-30"
            >
              {I.plus}
            </button>
          </div>

           </>)}

          {/* Remove */}
          <button
            onClick={() => removeItem(item.id)}
            className={`flex items-center cursor-pointer gap-1.5 text-[13px] text-[#ccc] hover:text-red-400 transition-colors ${isUnavailable?"text-brand-dark! font-bold rounded-3xl ":""}`}
          >
            {I.trash} <span >Remove</span>
          </button>
        </div>
      </div>
    </div>
     </>
  );
}

// ─── SUGGESTION CARD (list row) ───────────────────────────────────────────────
function SuggestRow({ item, onAdd }) {
  const [added, setAdded] = useState(false);
  const handle = () => { onAdd(item); setAdded(true); setTimeout(() => setAdded(false), 1500); };

  return (
    <div className="flex items-center gap-3 py-3 border-b border-[#f0f5f0] last:border-0">
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#E8F8F3]">
        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[14px] text-[#1a2e1a] truncate">{item.name}</p>
        <p className="font-bold text-[13px] text-[#0D9E7E] mt-0.5">₹{item.price.toFixed(2)}</p>
      </div>
      <button
        onClick={handle}
        className={`w-8 h-8 rounded-full flex items-center justify-center border-[1.5px] transition-all duration-300 text-base font-bold flex-shrink-0 ${
          added
            ? "bg-[#0D9E7E] border-[#0D9E7E] text-white"
            : "bg-[#f0f7f0] border-[#c2ddc2] text-[#0D9E7E] hover:bg-[#ddf0e8]"
        }`}
      >
        {added ? "✓" : I.plus}
      </button>
    </div>
  );
}

// ─── SUGGESTION CARD (horizontal tile for mobile) ─────────────────────────────
function SuggestTile({ item, onAdd }) {
  const [added, setAdded] = useState(false);
  const handle = () => { onAdd(item); setAdded(true); setTimeout(() => setAdded(false), 1500); };

  return (
    <div className="flex-shrink-0 w-36 rounded-2xl overflow-hidden border border-[#eef2ee] bg-white snap-start">
      <div className="h-24 overflow-hidden">
        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-2.5 flex items-end justify-between">
        <div>
          <p className="text-[12px] font-bold text-[#1a2e1a] leading-tight">{item.name}</p>
          <p className="text-[12px] font-bold text-[#0D9E7E] mt-0.5">₹{item.price.toFixed(2)}</p>
        </div>
        <button
          onClick={handle}
          className={`w-7 h-7 rounded-full flex items-center justify-center border-[1.5px] transition-all duration-300 text-sm font-bold flex-shrink-0 ${
            added
              ? "bg-[#0D9E7E] border-[#0D9E7E] text-white"
              : "bg-[#0D9E7E] border-[#0D9E7E] text-white hover:bg-[#0b8a6e]"
          }`}
        >
          {added ? "✓" : "+"}
        </button>
      </div>
    </div>
  );
}

// ─── VITALITY IMPACT ──────────────────────────────────────────────────────────
// function VitalityImpact({ items }) {
//   const protein = items.reduce((s, i) => s + 14 * i.quantity, 0);
//   const pct = Math.min(100, (protein / 60) * 100);
//   return (
//     <div className="border border-[#eef2ee] rounded-2xl p-5 bg-white mt-1">
//       <div className="flex items-start gap-3">
//         <div className="w-9 h-9 rounded-full bg-[#f0f7f0] flex items-center justify-center text-[#0D9E7E] flex-shrink-0">
//           {I.leaf}
//         </div>
//         <div className="flex-1">
//           <p className="font-bold text-[15px] text-[#1a2e1a] mb-1">Your Vitality Impact</p>
//           <p className="text-[13px] text-[#666] leading-relaxed">
//             This meal provides {protein}g of plant-based protein and 100% of your daily Vitamin K.
//             You're supporting 2 local regenerative farms with this order.
//           </p>
//           <div className="mt-3 h-1.5 bg-[#eef2ee] rounded-full overflow-hidden">
//             <div
//               className="h-full rounded-full transition-all duration-700"
//               style={{ width: `${pct}%`, background: "linear-gradient(90deg,#0D9E7E,#5ecba8)" }}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// ─── OFFERS SECTION ───────────────────────────────────────────────────────────
function OffersSection({ promoCode, setPromoCode, applyPromo, promoApplied, promoError, discount,   
  applyCoupon,removeCoupon, handleCouponRemove,appliedCoupon ,couponDiscount,isApplyingCoupon, applyingCouponCode }) {
 const [openOffer, setOpenOffer]= useState(false);
 
  return (
    <div className="border border-[#eef2ee] rounded-2xl p-4 bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
       <Tag size={16} className="text-brand-primary"/>
        <span className="text-[13px] font-bold text-[#1a2e1a]">Offers & Coupons</span>
      </div>


      {/* Input row */}
      {!appliedCoupon &&(

      <div className="flex gap-2 mb-2 flex items-center gap-2 rounded-xl border-[1.4px] border-brand-primary bg-gray-50 p-1 focus-within:brand-primary transition-colors">
        <input
          value={promoCode.toUpperCase()}
          onChange={e => setPromoCode(e.target.value)}
          placeholder="Enter promo code"
              className="min-w-0 flex-1 bg-transparent px-2.5 py-1.5 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none"
          // className="flex-1 h-10 rounded-xl border-[1.5px] border-[#e0ebe0] px-3 text-[13px]  text-gray-700 font-medium outline-none bg-[#fafcfa] focus:border-[#0D9E7E] transition-colors placeholder:text-[#ccc] placeholder:font-normal font-[inherit]"
        />

      <button
          onClick={applyPromo}
          className="h-10 px-3  cursor-pointer rounded-xl bg-brand-primary text-white uppercase tracking-wide border-[1.5px] font-bold text-[13px] hover:bg-brand-dark active:scale-95 transition-all"
          >
 {isApplyingCoupon ? <> 
 <div className="flex items-center gap-1">
  <span className="h-2 w-2 animate-bounce text-white rounded-full bg-current [animation-delay:-0.2s]" />
  <span className="h-2 w-2 animate-bounce text-white rounded-full bg-current [animation-delay:-0.1s]" />
  <span className="h-2 w-2 animate-bounce text-white rounded-full bg-current" />
</div>
</> : 'Apply'}
        </button> 
        
      </div>
      )}
     




      {appliedCoupon && discount > 0 && (
  <div className="flex items-start gap-2.5  border border-[#b6e8d4] rounded-xl px-3 py-2.5 mb-2">
    <span className="text-[#0D9E7E] mt-0.5 flex-shrink-0">
    <Tag/>
    </span>
    <div className="flex-1 items-center min-w-0">
      <p className="text-[12px] font-bold text-brand-primary tracking-wide"> <span className="text-brand-dark">
         {appliedCoupon.code}
        </span> applied!</p>
      <p className="text-[11px] text-gray-600 opacity-80 mt-0.5">You save ₹{discount.toFixed(2)} with this code</p>
    </div>
    <button
      onClick={handleCouponRemove}
      className="text-[11px] cursor-pointer  font-semibold text-gray-700 underline opacity-60 hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5"
    >
      Remove
    </button>
  </div>
)}

{/* Error */}
{promoError && (
  <p className="text-[12px] text-red-400 font-medium mb-2">{promoError}</p>
)}

      {/* View all offers */}
      <button onClick={() => setOpenOffer(true)} className="flex items-center gap-1 cursor-pointer text-[12px] text-[#0D9E7E] font-semibold hover:underline mt-1">
        
        View all offers 
        <ChevronRight size={14}/>
      </button>


       <OffersSheet 
       openOffer={openOffer} 
       onClose={() => setOpenOffer(false)}
       appliedCoupon={appliedCoupon}
       applyCoupon={applyCoupon}
       removeCoupon={removeCoupon}
       isApplyingCoupon={isApplyingCoupon}

     
         promoError={promoError}
  onCouponApplied={() => setOpenOffer(false)}
applyingCouponCode={applyingCouponCode}
        />
    </div>
  );
}

// ─── BILL DETAILS ─────────────────────────────────────────────────────────────
function BillDetails({ subtotal, deliveryFee, discount, finalTotal, promoApplied, desktop,paymentMethod,paymentmSelect,paymentOptions,setpaymentmSelect,setPaymentMethod,selected,handlePlaceOrder,
  unavailableIds,items,canOrder,status,selectedAddress,appliedCoupon,couponDiscount
 }) {
  const rows = [
    {
      label: "Item total",
      value: `₹${subtotal.toFixed(2)}`,
      valueClass: "text-[#1a2e1a] font-semibold",
      info: null,
    },
    {
      label: "Delivery fee",
      value: deliveryFee === 0 ? "FREE" : `₹${deliveryFee.toFixed(2)}`,
      valueClass: deliveryFee === 0 ? "text-[#0D9E7E] font-bold" : "text-[#1a2e1a] font-semibold",
      info: `Free delivery on orders above ₹${DELIVERY_CONFIG.FREE_ORDER_AMOUNT} and upto ${DELIVERY_CONFIG.freeDistance}km`,
    },
    ...(appliedCoupon && couponDiscount > 0
      ? [{
          label:(<div className="text-brand-primary font-medium text-[13px">
          <span>

          Coupon discount  
          </span> <br />
          ({appliedCoupon.code})
          </div>),
          value: `−₹${couponDiscount.toFixed(2)}`,
          valueClass: "text-[#0D9E7E] font-bold",
          info: null,
          isDiscount: true,
        }]
      : []),

  ];


    const noSavedAddress = !selectedAddress || selectedAddress.type === 'current_location'
  const hasUnavailable = unavailableIds?.length > 0
  const canPlaceOrder =
    canOrder &&
    items.length > 0 &&
    !noSavedAddress &&
    !hasUnavailable

   
    
     const disabledReason = !items.length
    ? null // empty cart — no reason needed, button just hidden
    : noSavedAddress
    ? 'Add a delivery address to place your order'
    : !canOrder
    ? status === 'not_accepting'
      ? 'Kitchen is not accepting orders right now'
      : "We don't deliver to your area yet"
    : hasUnavailable
    ? 'Remove unavailable items to place your order'
    : null

  return (
    <div className="border border-[#eef2ee] rounded-2xl p-4 bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0D9E7E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
        </svg>
        <span className="text-[13px] font-bold text-[#1a2e1a]">Bill Details</span>
      </div>

      {/* Line items */}
      <div className="space-y-3">
        {rows.map(({ label, value, valueClass, info, isDiscount }) => (
          <div key={label} className="flex items-center justify-between text-[13px]">
            <div className="flex items-center gap-1.5">
              <span className={isDiscount ? "text-[#3f5a54]" : "text-[#666]"}>{label}</span>
              {info && <InfoTip text={info} />}
            </div>
            <span className={valueClass}>{value}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#eef2ee] my-3.5 border-dashed" style={{ borderTop: "1.5px dashed #eef2ee", background: "none" }} />

      {/* Total row */}
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-extrabold text-[#1a2e1a]">To pay</span>
        <span className="text-[22px] font-black text-[#0D9E7E]">₹{finalTotal.toFixed(2)}</span>
      </div>

      {/* Savings pill */}
      {promoApplied && discount > 0 && (
        <div className="mt-3 flex justify-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0D9E7E] bg-[#f0faf6] border border-[#b6e8d4] rounded-full px-3 py-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Total savings of ₹{discount.toFixed(2)} on this order
          </span>
        </div>
      )}

      {/* Desktop CTA */}
      {desktop && (
        <div className="mt-5">

          
                {paymentmSelect && (
    <div className=" rounded-2xl border border-[#eef2ee] ">
      
      {paymentOptions.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => { setPaymentMethod(id); setpaymentmSelect(false); }}
          className={`w-full flex items-center gap-3 px-4 py-3 text-[14px] transition-colors ${
            paymentMethod === id
              ? "bg-[#f0faf6] text-brand-primary font-medium"
              : "bg-white text-gray-700"
          }`}
        >
          <span>{icon}</span>
          {label}
          {paymentMethod === id && <span className="ml-auto text-brand-primary">{I.check}</span>}
        </button>
      ))}
    </div>
  )}
        <div className="p-2">
       

            <button
      onClick={() => setpaymentmSelect((prev) => !prev)}
      className="flex items-center gap-2 flex-1 min-w-0 py-1"
    >
      <span className="text-brand-primary">{selected.icon}</span>
      <span className="text-[14px] font-medium text-gray-800">{selected.label}</span>
      <span className={`ml-1 transition-transform duration-200 text-gray-400 ${setpaymentmSelect ? "rotate-180" : ""}`}>
        <ChevronUp  className={`transition-transform duration-200 ${
          paymentmSelect ? "rotate-180" : ""
        }`}/>
      </span>
       </button>
          
           </div>

             {disabledReason && (
        <p className=" text-xs my-2 text-red-400 font-medium">{disabledReason}</p>
      )}
       
          <button onClick={canPlaceOrder ? handlePlaceOrder:undefined}
          disabled={!canPlaceOrder} 
          className={`w-full py-4  rounded-2xl  cursor-pointer text-white font-extrabold text-[16px] flex items-center justify-center gap-2.5 shadow-[0_6px_20px_rgba(13,158,126,.3)] hover:scale-[1.01] active:scale-[.98] transition-transform 
          ${!canPlaceOrder? "bg-gray-400":"bg-linear-to-br from-brand-primary to-brand-dark"}`}>
          Place Order
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
          <div className="flex justify-center gap-4 mt-3.5 text-[#ccc]">
            {[
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
            ].map((ic, i) => <span key={i}>{ic}</span>)}
          </div>
          <p className="text-center text-[10px] text-[#bbb] uppercase tracking-widest mt-1.5 font-semibold">
            Secure SSL Encrypted Checkout
          </p>
        </div>
      )}
    </div>
  );
}

// ─── INFO TOOLTIP ─────────────────────────────────────────────────────────────
function InfoTip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="text-[#ccc] hover:text-[#999] transition-colors"
        aria-label={text}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      </button>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-44 text-[11px] bg-[#1a2e1a] text-white rounded-lg px-2.5 py-1.5 leading-snug z-10 pointer-events-none shadow-lg">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a2e1a]" />
        </span>
      )}
    </span>
  );
}

// ─── ORDER SUMMARY (composed) ─────────────────────────────────────────────────
 function OrderSummary({
  subtotal, deliveryFee, discount, finalTotal,
  promoApplied, promoCode, setPromoCode, applyPromo, promoError, paymentMethod,paymentmSelect,paymentOptions,setpaymentmSelect,setPaymentMethod,selected,handlePlaceOrder,
  unavailableIds,items,canOrder,status,selectedAddress,
  applyCoupon,removeCoupon,handleCouponRemove,appliedCoupon,couponDiscount,isApplyingCoupon,applyingCouponCode,
  desktop = false,
},) {
  return (
    <div className={`flex flex-col gap-3 ${desktop ? "" : "pt-1"}`}>
      {desktop && (
        <p className="text-[20px] font-bold text-gray-700 tracking-tight">Order Summary</p>
      )}
      <OffersSection
        promoCode={promoCode}
        setPromoCode={setPromoCode}
        applyPromo={applyPromo}
        promoApplied={promoApplied}
        promoError={promoError}
        discount={discount}
        applyCoupon={applyCoupon}
        removeCoupon   ={removeCoupon}
        appliedCoupon = {appliedCoupon}
        couponDiscount = {couponDiscount}
        isApplyingCoupon={isApplyingCoupon}
        handleCouponRemove={handleCouponRemove}
        applyingCouponCode={applyingCouponCode}
      />
      <BillDetails
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        discount={discount}
        finalTotal={finalTotal}
        promoApplied={promoApplied}
        desktop={desktop}
        paymentMethod={paymentMethod}
        paymentmSelect={paymentmSelect}
        paymentOptions={paymentOptions}
        setPaymentMethod={setPaymentMethod}
        selected={selected}
        setpaymentmSelect={setpaymentmSelect}
        handlePlaceOrder={handlePlaceOrder}
        unavailableIds={unavailableIds}
        items={items}
        canOrder={canOrder}
        status={status}
        selectedAddress={selectedAddress}
        appliedCoupon = {appliedCoupon}
        couponDiscount = {couponDiscount}

      />
    </div>
  );
}

// ─── HELP CARD ────────────────────────────────────────────────────────────────
// function HelpCard() {
//   return (
//     <div className="border border-[#eef2ee] rounded-2xl p-4 bg-white flex items-center gap-3 cursor-pointer mt-4 hover:shadow-md transition-shadow">
//       <span className="text-[#999]">{I.question}</span>
//       <div className="flex-1">
//         <p className="font-bold text-[14px] text-gray-700">Need help with your order?</p>
//         <p className="text-[13px] text-brand-primary font-semibold">Chat with a wellness specialist</p>
//       </div>
//       <span className="text-[#ccc]">{I.chevR}</span>
//     </div>
//   );
// }

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
function EmptyCart() {
  return (
   
     <div className="flex flex-col items-center py-10 pt-20 text-center animate-fade-in">
      <div className="w-22 h-22 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center mb-5 animate-bounce" style={{ animationDuration: "3s" }}>
        <ShoppingCart size={40} className="text-brand-dark" />
      </div>
      <h2 className="text-lg font-bold text-brand-primary dark:text-white mb-1.5">Your cart is empty</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[300px] leading-relaxed mb-6">
        You haven't added anything yet. Start browsing to fill it up.
      </p>
      <div className="button">
        <Link to='/' className="px-8 py-3 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-dark cursor-pointer text-white font-bold text-[15px] shadow-[0_4px_16px_rgba(13,158,126,.25)] hover:scale-105 transition-transform">
          Browse Menu
        </Link>
      </div>
    </div>
  );
}




// ── Helpers ───────────────────────────────────────────────────────
const getToken   = () => localStorage.getItem('accessToken')
const genIdemKey = () => crypto.randomUUID()


// ─── MAIN CART PAGE ───────────────────────────────────────────────────────────
export default function Cart() {
  
  const items          = useCartStore(s => s.items);
  const itemCount      = useCartStore(s => s.itemCount);
  const subtotal       = useCartStore(s => s.subtotal);
  const deliveryFee    = useCartStore(s => s.deliveryFee);
  const totalAmount    = useCartStore(s => s.totalAmount);
  const freeDeliveryIn = useCartStore(s => s.freeDeliveryIn);
  const isLoading      = useCartStore(s => s.isLoading);
  const fetchCart      = useCartStore(s => s.fetchCart);
  const updateQuantity = useCartStore(s => s.updateQuantity);
  const removeItem     = useCartStore(s => s.removeItem);
  const addItem        = useCartStore(s => s.addItem);
  const unavailableIds = useCartStore(s=> s.unavailableIds)
  const eta = useCartStore(s=> s.eta)
  const applyCoupon    = useCartStore(s=>s.applyCoupon);
  const removeCoupon    = useCartStore(s=>s.removeCoupon);
  const appliedCoupon = useCartStore(s=>s.appliedCoupon);
  const couponDiscount = useCartStore(s=>s.couponDiscount);
  const isApplyingCoupon = useCartStore(s=>s.isApplyingCoupon);
  const applyingCouponCode = useCartStore(s=>s.applyingCouponCode);
  
    const { canOrder, status }      = useProductStore()
  // const deliveryAddress = addresses.find((addr) => addr.isDefault)
    const deliveryAddress = useAddressStore((s)=>s.selectedAddress);

  const [promoCode, setPromoCode]     = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError]   = useState("");

  useEffect(() => { fetchCart(); }, [fetchCart]);

const discount   = couponDiscount ?? 0
const finalTotal = totalAmount ?? 0


const applyPromo = async () => {
  const code = promoCode.trim().toUpperCase()
  setPromoError("")

  if (code === "") {
    setPromoError("Enter coupon code")
    return
  }

  const result = await applyCoupon(code)   
  if (result?.error) {
    setPromoError(result.error)
  } else {
    setPromoCode("")   
  }
}

const handleCouponRemove = async () => {
  await removeCoupon()
  setPromoCode("")
  setPromoError("")
}


  const handleAddSuggestion = (s) => {
    // addItem expects (productId, quantity) per the real store signature
    // For suggestions that don't exist in DB yet, we just fire addItem with the suggestion id
    addItem(s.id, 1);
  };

 

const [initialLoad, setInitialLoad] = useState(true);

useEffect(() => {
  if (!isLoading) setInitialLoad(false);

}, [isLoading]);

const showSkeleton = isLoading || initialLoad;



////////////////////  TESTING ///////////////////////////////
 const [paymentMethod, setPaymentMethod] = useState('RAZORPAY')
 const [paymentmSelect, setpaymentmSelect] = useState(false);
 const paymentOptions = [
  { id: "RAZORPAY", label: "Pay online", icon:  I.cc },
  { id: "COD", label: "Cash on delivery", icon: I.cash  },
];

const selected = paymentOptions.find(o => o.id === paymentMethod) ?? paymentOptions[0];


  // const [addressId,     setAddressId]     = useState("9e27bf81-9ecd-4b17-b664-f1f7b44bbde7")
  const [couponCode,    setCouponCode]     = useState('')
  const [loading,       setLoading]        = useState(false)
 
 
// //////// PLACE ORDER /////////////
  // const { addresses } = useUserStore()
 

  const checkoutStatus = useOrderStore(
  state => state.checkoutStatus
)

const currentOrder = useOrderStore(
  state => state.currentOrder
)

const error = useOrderStore(
  state => state.error
)

const resetCheckout = useOrderStore(
  state => state.resetCheckout
)

const placeOrderAction = useOrderStore(
  state => state.placeOrderAction
)

const verifyPaymentAction = useOrderStore(
  state => state.verifyPaymentAction
)

    // const [specialInstr, setSpecialInstr] = useState('')

      useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])


  
const handlePlaceOrder = async () => {

  try {
    
  
    if (!deliveryAddress) {
      alert('Please set a delivery address')
      return
    }

    // console.log(deliveryAddress)
    const idemKey =genIdemKey();
   
    const payload = {
      addressId: deliveryAddress.id,
      paymentMethod: paymentMethod,
      ...(instruction ? { specialInstructions: instruction } : {}),
    }

    console.log('Placing order with payload:', payload, 'and idemKey:', idemKey)

    if (paymentMethod === 'COD') {
      await placeOrderAction(payload, idemKey)
      return
    }

      // Razorpay
    const orderData = await placeOrderAction(payload, idemKey)
    console.log(orderData)
    if (!orderData) return

    const options = {
      key: orderData.keyId,
      amount: Math.round(orderData.amount * 100),
      currency: orderData.currency || 'INR',
      name: 'NurishBox',
      description: `Order ${orderData.order.orderNumber}`,
      order_id: orderData.razorpayOrderId,

      handler: async (response) => {
        useOrderStore.setState({checkoutStatus:"loading"})
        await verifyPaymentAction({
          orderId: orderData.order.id,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        })

      },

      modal: {
        ondismiss: () => {
          useOrderStore.setState({ checkoutStatus: null })
          // User closed Razorpay
        },
      },

      prefill: {
        name: "",
        contact: '',
        email: '',
      },

      
    }
     if (window.Razorpay) {
      const rzp = new window.Razorpay(options)
      rzp.open()
    }
  } catch (error) {
    console.error('Error placing order:', error)

  }
  finally{
    setInstruction("")
  }
    
  }

  

  

   const summaryProps = {
    subtotal, deliveryFee, discount, finalTotal,
    promoApplied, promoCode, setPromoCode, applyPromo, promoError,paymentMethod,setpaymentmSelect,setPaymentMethod,paymentmSelect,paymentOptions,selected,
  handlePlaceOrder,
    // FOR UNAVAILABE OR UNSERVICIPLE PRODUCTS
  unavailableIds,items,canOrder,status,selectedAddress:deliveryAddress,
   applyCoupon,removeCoupon, handleCouponRemove,appliedCoupon,couponDiscount,isApplyingCoupon,applyingCouponCode
  
  };


  const [showInstrInput,setShowInstrInput] = useState(false);
  const [instruction,setInstruction] = useState("");

  const handleInstr =()=>{
    if(showInstrInput){
      setShowInstrInput(false);
      setText("");
    }
    else{
      setShowInstrInput(true)
    }
  }
 
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }
        .shimmer { animation: shimmer 1.6s infinite linear; background-size: 200% 100%; }
        .snap-x-scroll { scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
        ::-webkit-scrollbar { width: 0; height: 0; }
      `}</style>


      <div className="min-h-screen bg-[#FBFAF7]">
{/* ON EMPTY CART SHOW THIS SKELETON THEN SHOW CART EMPTY AND LOAD NO COMPONENT */}     
   {showSkeleton?(
    <>
      <div className="hidden lg:block">
          <div className="max-w-[1150px] mx-auto px-12 py-11 grid grid-cols-[1fr_360px] gap-10 items-start">
         <div>

          <CartItemSkeleton/>
          <CartItemSkeleton/>
          <CartItemSkeleton/>
         </div>

  <div className="sticky top-20">
<SummarySkeleton/>
  </div>
</div>
</div>
    <div className="lg:hidden pb-32">
          <div className="px-4 pt-5">
          <CartItemSkeleton/>
          <CartItemSkeleton/>
          <CartItemSkeleton/>

     </div>
      <div className="mt-6  rounded-2xl border  border-[#eef2ee] px-5 py-5">
<SummarySkeleton/>
      </div>
     </div>  
    
     </>
   ):items.length === 0 ? (
    <EmptyCart />  
  ):(
    <>
    
    

      <CartStatusBanner/>
  
    
        {/* ── DESKTOP GRID ── */}
        <div className="hidden lg:block">
          <div className="max-w-[1150px] mx-auto px-12 py-11 grid grid-cols-[1fr_360px] gap-10 items-start">

            {/* LEFT col */}
            <div>
                 {/* ── Free Delivery Banner ── */}
          {!isLoading && items.length > 0 && (
            
          <>
            <FreeDeliveryBar className="mb-3" freeDeliveryIn={freeDeliveryIn} subtotal={subtotal} threshold={DELIVERY_CONFIG.FREE_ORDER_AMOUNT} />
          </>
              )}


              {/* Header row */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[18px] font-semibold text-brand-dark">Freshly Picked</span>
                <span className="text-[10px] font-bold tracking-widest text-[#0D9E7E] bg-[#f0f9f5] border border-[#c2ddc2] rounded-full px-4 py-1">
                  {itemCount} ITEMS
                </span>
              </div>

              {/* Cart items */}
              <div className="bg-white rounded-2xl border shadow-md ring-1 ring-black/5 border-[#eef2ee] px-6 mb-8">
                {isLoading ? (
                  [1, 2, 3].map(i => <CartItemSkeleton key={i} />)
                ) :  (
                  items.map(item => (
                    <CartItemCard key={item.id} item={item} updateQuantity={updateQuantity} removeItem={removeItem}  
                    isUnavailable={unavailableIds?.includes(item.product?.id) }
                     />
                  ))
                )}
              </div>
                <div className="mt-1 mb-6">
                  <button onClick={handleInstr} className="text-xs  tracking-wide text-gray-500 cursor-pointer" >
                    {!showInstrInput ? <> <Plus className="inline" size={16} /> Add </>
                      : <><X  className="inline" size={16} /> Reomve </> 
                    }
                     Special Instructions
                     </button>
                 {showInstrInput &&(

                  <textarea name="" id=""  
                  placeholder="Add cooking instructions" 
                  value={instruction}
                  maxLength={200}
                  onChange={(e)=>setInstruction(e.target.value)}
                  className="w-full my-2 p-3 bg-white rounded-md outline-none border shadow-md ring-1 ring-black/5 text-xs  tracking-wide text-gray-500 border-[#eef2ee] "></textarea>
                 )}
                </div>

              {/* </input> */}

              {/* Suggestions */}
              {!isLoading && items.length > 0 && (

                <>
                  <h2 className="text-[20px] font-semibold text-gray-700 mb-3 tracking-tight">Complete Your Meal</h2>
                  <div className="bg-white rounded-2xl border shadow-md  ring-1 ring-black/5 border-[#eef2ee] px-6 py-1 mb-8">
                    {SUGGESTIONS.map(s => (
                      <SuggestRow key={s.id} item={s} onAdd={handleAddSuggestion} />
                    ))}
                  </div>
                  {/* {items.length > 0 && <VitalityImpact items={items} />} */}
                </>
              )}

              {/* selected addresses */}
              <SelectedAddressCard eta={eta}/>
            </div>

            {/* RIGHT sticky col */}
            <div className="sticky top-20">
              {isLoading ? (
                <div className="bg-white rounded-2xl border  border-[#eef2ee]"><SummarySkeleton /></div>
              ) :
              items.length === 0 ? (
                ""
              )

              : (
                <>
                  <OrderSummary {...summaryProps} desktop />
                  {/* <HelpCard /> */}
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── MOBILE ── */}
        <div className="lg:hidden pb-32">
          <div className="px-2 pt-5">

            {/* Header */}
          {/* Header row */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[18px] font-semibold text-brand-dark">Freshly Picked</span>
                <span className="text-[10px] font-bold tracking-widest text-[#0D9E7E] bg-[#f0f9f5] border border-[#c2ddc2] rounded-full px-4 py-1">
                  {itemCount} ITEMS
                </span>
              </div>

            {/* Cart items */}
            <div className="bg-white rounded-2xl border border-[#eef2ee] px-4 mb-6">
              {isLoading ? (
                [1, 2].map(i => <CartItemSkeleton key={i} />)
              ) : items.length === 0 ? (
                <EmptyCart />
              ) : (
                items.map(item => (
                  <CartItemCard key={item.id} item={item} updateQuantity={updateQuantity} removeItem={removeItem} 
                    isUnavailable={unavailableIds?.includes(item.product?.id)}
                    />
                ))
              )}
            </div>

            {/* Horizontal suggestions */}
            {!isLoading && items.length > 0 && (
              <div className="mb-6">
                <h2 className="text-[18px] font-extrabold text-gray-700 mb-3 tracking-tight">Complete Your Meal</h2>
                <div className="flex gap-3 overflow-x-auto snap-x-scroll pb-1 snap-x-scroll mx-1 px-1">
                  {SUGGESTIONS.map(s => (
                    <SuggestTile key={s.id} item={s} onAdd={handleAddSuggestion} />
                  ))}
                </div>
              </div>
            )}

            {/* Vitality */}
            {/* {!isLoading && items.length > 0 && <VitalityImpact items={items} />} */}

            {/* SELECTED ADDRESS */}
            <SelectedAddressCard eta={eta} status={status}/>
            {/* Order summary */}
            <div className="mt-6  rounded-2xl py-5">
              <p className="text-[16px] font-extrabold text-[#1a2e1a] mb-4">Order Summary</p>
              {isLoading ? <SummarySkeleton /> : <OrderSummary {...summaryProps} />}
            </div>

            {/* <HelpCard /> */}
          </div>
        </div>

        {/* ── MOBILE FIXED BOTTOM CTA ── */}
       
        <MobileFixedCTA 
         paymentmSelect={paymentmSelect}
  setpaymentmSelect={setpaymentmSelect}
  paymentOptions={paymentOptions}
  paymentMethod={paymentMethod}
  setPaymentMethod={setPaymentMethod}
  selected={selected}
  handlePlaceOrder={handlePlaceOrder}
  I={I}
   unavailableIds= {unavailableIds}
   items= {items}
   canOrder= {canOrder}
   status= {status}
  selectedAddress= {deliveryAddress}
  />
     
   </>
   )}
      </div>
    </>
  );
}