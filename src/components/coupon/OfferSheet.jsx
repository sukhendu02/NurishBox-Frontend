import { useState, useEffect, useRef } from "react";
import { ChevronRight, X, Copy, Check, Tag, ChevronDown } from "lucide-react";
import { getAvailableCoupons } from "../../api/cart.api";
import React from 'react'
import { formatDateTime } from "../../helpers/formatDateTime";

// const "text-brand-primary" = "#0D9E7E";
const OFFERS = [
  {
    code: "WELCOME50",
    title: "50% off on your first order",
    desc: "Get flat 50% off, up to $15, on your first order. Valid for new users only.",
    min: "Min. order $20",
    expires: "Expires 31 Aug",
  },
  {
    code: "FLAT200",
    title: "Free shipping, no minimum",
    desc: "Enjoy free standard shipping on this order, no minimum spend required.",
    min: "No minimum order",
    expires: "Expires 15 Sep",
  },
  {
    code: "SAVE20",
    title: "$20 off orders over $100",
    desc: "Save $20 instantly when your cart total is $100 or more, before tax.",
    min: "Min. order $100",
    expires: "Expires 10 Sep",
  },
  {
    code: "WEEKEND10",
    title: "Extra 10% off, weekends only",
    desc: "Stack an extra 10% off on top of existing discounts, Saturday & Sunday only.",
    min: "Min. order $30",
    expires: "Expires 30 Sep",
  },
];

export default function OffersSheet({ openOffer, onClose,appliedCoupon,applyCoupon,removeCoupon,isApplyingCoupon, promoError,
  onCouponApplied,applyingCouponCode }) {

  const [visible, setVisible] = useState(false);
  const panelRef = useRef(null);
  const [couponModelError, setCouponModelError] = useState(null);
  
  const handleApplyCoupon = async (code) => {
    
    setCouponModelError(null)
  const result = await applyCoupon(code);
  console.log(
    'result',result
  )
  if (result?.success) {
    onCouponApplied();
  }
    setCouponModelError(result.error || "Coupon could not be applied")
};
 


const [userCoupons, setUserCoupons] = useState([])
const [availableCoupons, setAvailableCoupons] = useState([])
const [isLoadingOffers, setIsLoadingOffers] = useState(false)
const [offersError, setOffersError] = useState(null)



  // mount -> next tick -> animate in (so the transition actually plays)
  useEffect(() => {
    if (openOffer) {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
    }
  }, [openOffer]);
 
  // lock body scroll while openOffer
  useEffect(() => {
    if (openOffer) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [openOffer]);
 
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    if (openOffer) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openOffer, onClose]);
 

  
  
  useEffect(() => {
  if (!openOffer) return

  const fetchCoupons = async () => {
    setIsLoadingOffers(true)
    setOffersError(null)

    try {
      const data = await getAvailableCoupons()

      console.log("Available coupons:", data)

      setUserCoupons(data.data?.userCoupon || [])
      setAvailableCoupons(data.data?.availableCoupon || [])

    } catch (err) {
      console.error(err)

      setOffersError(
        err.response?.data?.message ||
        "Failed to load offers"
      )
    } finally {
      setIsLoadingOffers(false)
    }
  }

  fetchCoupons()
}, [openOffer])


  if (!openOffer) return null;
  
  const applyOffer = (code) => {
    setAppliedCode(code);
    setCouponInput(code);
  };
  return (
    // <div className="fixed inset-0 z-100 flex items-end sm:items-center sm:justify-center">
    //   {/* backdrop */}
    //   <div
    //     onClick={onClose}
    //     className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
    //       visible ? "opacity-100" : "opacity-0"
    //     }`}
    //   />
 

    //   <div
    //     ref={panelRef}
    //     role="dialog"
    //     aria-modal="true"
    //     aria-label="Available offers"
    //     className={`
    //       relative z-10 w-full bg-white
    //     rounded-none sm:rounded-lg
    //       sm:w-full sm:max-w-md sm:mx-4
    //       h-full sm:h-auto sm:max-h-[80vh]
    //       flex flex-col
    //       shadow-2xl
    //       transition-transform duration-300 ease-out
    //       ${visible ? "translate-y-0" : "translate-y-full sm:translate-y-6 sm:opacity-0"}
    //     `}
    //   >
    //     {/* drag handle — mobile only */}
    //     <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
    //       <span className="h-1 w-9 rounded-full bg-gray-300" />
    //     </div>
 
    //     {/* header */}
    //     <div className="flex items-center justify-between px-4 pt-2 pb-3 sm:pt-4">
    //       <div>
    //         <h2 className="text-[15px] font-bold text-gray-900">Available offers</h2>
    //         <p className="text-[12px] text-gray-400 mt-0.5">
    //           {OFFERS.length} offers you can use right now
    //         </p>
    //       </div>
    //       <button
    //         onClick={onClose}
    //         aria-label="Close"
    //         className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
    //       >
    //         <X size={16} className="text-gray-600" />
    //       </button>
    //     </div>
 
      
     
    //     {/* divider */}
    //     <div className="h-px bg-gray-100" />
 
    //     {/* offers list */}
    //     <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
    //       {OFFERS.map((offer) => (
    //         <OfferCard
    //           key={offer.code}
    //           offer={offer}
    //           onApply={applyCoupon}
    //           isApplyingCoupon={isApplyingCoupon}
    //           // isApplied={appliedCode === offer.code}
    //         />
    //       ))}
    //     </div>
 
    //     {/* safe-area padding for mobile home indicator */}
    //     <div className="pb-[max(env(safe-area-inset-bottom),0px)] sm:pb-4" />
    //   </div>
    // </div>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center sm:justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Available offers"
        className={`relative z-10 w-full bg-white
          rounded-none sm:rounded-lg
          sm:w-full sm:max-w-md sm:mx-4
          h-full sm:h-auto sm:max-h-[80vh]
          flex flex-col shadow-2xl
          transition-transform duration-300 ease-out
          ${
            visible
              ? "translate-y-0"
              : "translate-y-full sm:translate-y-6 sm:opacity-0"
          }
        `}
      >
        <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
          <span className="h-1 w-9 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-2 pb-3 sm:pt-4">
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">
              Available offers
            </h2>

            <p className="text-[12px] text-gray-400 mt-0.5">
             {userCoupons.length + availableCoupons.length} offers you can use right now
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>

        <div className="h-px bg-gray-100" />

        {/* ERROR INSIDE MODAL */}
        {couponModelError && (
          <div className="mx-4 mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2">
            <p className="text-[12px] font-medium text-red-500">
              {couponModelError}
            </p>
          </div>
        )}

        {/* Offers */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
      
      {isLoadingOffers &&(
        <div className="flex items-center justify-center py-6">

          <span className="h-2 w-2 animate-bounce rounded-full bg-brand-primary [animation-delay:-0.2s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-brand-primary [animation-delay:-0.1s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-brand-primary" />
        </div>
      )}

      {!isLoadingOffers && offersError && (
         <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2">
      <p className="text-[12px] text-red-500">
        {offersError}
      </p>
    </div>

      )}

      {!isLoadingOffers && userCoupons.length > 0 &&(
        <>
           <div className="mb-2">
        <h3 className="text-[10px] uppercase  text-gray-500 tracking-wide">
          Only for you
        </h3>
      </div>
      {userCoupons.map((offer) => (
            <OfferCard
              key={offer.code}
              offer={offer}
              onApply={handleApplyCoupon}
              isApplyingCoupon={
                isApplyingCoupon && applyingCouponCode === offer.code
              }
                isApplied={appliedCoupon?.code?.toUpperCase() ===offer.code.toUpperCase()
  }
            />
          ))}

        </>
      )}
      {!isLoadingOffers && availableCoupons.length > 0 &&(
        <>
           <div className="mb-2">
        <h3 className="text-[10px] uppercase  text-gray-500 tracking-wide">
          Available Coupons
        </h3>
      </div>
      {availableCoupons.map((offer) => (
            <OfferCard
              key={offer.code}
              offer={offer}
              onApply={handleApplyCoupon}
              isApplyingCoupon={
                isApplyingCoupon && applyingCouponCode === offer.code
              }
                isApplied={appliedCoupon?.code?.toUpperCase() ===offer.code.toUpperCase()
  }
            />
          ))}

        </>
      )}

          {/* {OFFERS.map((offer) => (
            <OfferCard
              key={offer.code}
              offer={offer}
              onApply={handleApplyCoupon}
              isApplyingCoupon={
                isApplyingCoupon &&
    applyingCouponCode === offer.code
              }
                isApplied={
    appliedCoupon?.code?.toUpperCase() ===
    offer.code.toUpperCase()
  }
            />
          ))} */}
        </div>

        <div className="pb-[max(env(safe-area-inset-bottom),0px)] sm:pb-4" />
      </div>
    </div>
  );
}


function OfferCard({ offer, onApply, isApplied,isApplyingCoupon }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
 
  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(offer.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
 
  return (
    <div className="rounded-xl border ring-1 ring-black/5 border-gray-200 bg-white overflow-hidden">
      <div className="flex items-start gap-3 p-3.5">
        <div
          className="mt-0.5 flex h-8 w-8 bg-brand-primary shrink-0 items-center justify-center rounded-lg"
         
        >
          <Tag size={15} className="text-white" />
        </div>
 
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-semibold text-gray-900 leading-snug">
            {offer.title} test
          </p>
 
          <div className="mt-2 flex items-center gap-2">
            <span
              className="rounded-md border border-dashed border-brand-primary text-brand-primary px-2 py-1 text-[11.5px] font-bold tracking-wide"
      
            >
              {offer.code}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11.5px] font-semibold text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-brand-primary" />
                  <span className="text-brand-primary" >Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  Copy
                </>
              )}
            </button>
          </div>
 
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-2 flex items-center gap-0.5 text-[11.5px] text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            Details
            <ChevronDown
              size={12}
              className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            />
          </button>
 
          <div
            className={`grid transition-all duration-300 ease-out ${
              expanded ? "grid-rows-[1fr] opacity-100 mt-1.5" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <p className="text-[12px] text-gray-500 leading-relaxed">{offer.description}</p>
              <div className="mt-1.5 flex flex-col text-[11px] text-gray-400">
                <span>{Number(offer.minOrderValue) === 0 ? "No minimum order value":"Min order value: ₹" + Number(offer.minOrderValue).toFixed(0)}</span>
                <span className="h-0.5 w-0.5 rounded-full bg-gray-300" />
                <span>Expires at {formatDateTime(offer.endAt)}</span>
              </div>
             
            </div>
          </div>
        </div>
 
    
        <button
  onClick={() => onApply(offer.code)}
  disabled={isApplyingCoupon || isApplied}
  className={`shrink-0 self-center rounded-lg px-3 py-1.5 text-[12px]
    font-semibold tracking-wide uppercase transition-transform
    ${
      isApplied
        ? "text-brand-primary cursor-default"
        : "text-brand-dark cursor-pointer active:scale-95"
    }
  `}
>
  {isApplyingCoupon ? (
    <div className="flex items-center gap-1">
      <span className="h-2 w-2 animate-bounce rounded-full bg-brand-primary [animation-delay:-0.2s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-brand-primary [animation-delay:-0.1s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-brand-primary" />
    </div>
  ) : isApplied ? (
    "Applied"
  ) : (
    "Apply"
  )}
</button>
      </div>
    </div>
  );
}