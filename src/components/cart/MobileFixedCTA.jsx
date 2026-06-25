import React from 'react'
import { ChevronUp } from 'lucide-react'

export default function MobileFixedCTA({
  paymentmSelect,
  setpaymentmSelect,
  paymentOptions,
  paymentMethod,
  setPaymentMethod,
  selected,
  handlePlaceOrder,
  I,
    unavailableIds,items,canOrder,status,selectedAddress
  
}) 
{

    
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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 rounded-2xl bg-white/95 backdrop-blur-md border-t border-[#eef2ee] px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,.08)]">
      
      {paymentmSelect && (
        <div className="rounded-2xl border border-[#eef2ee] mb-3 overflow-hidden">
          {paymentOptions.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => {
                setPaymentMethod(id)
                setpaymentmSelect(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-[14px] transition-colors ${
                paymentMethod === id
                  ? 'bg-[#f0faf6] text-brand-primary font-medium'
                  : 'bg-white text-gray-700'
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
              {paymentMethod === id && (
                <span className="ml-auto text-brand-primary">{I.check}</span>
              )}
            </button>
          ))}
        </div>
      )}
{disabledReason && (
        <p className=" text-xs my-2 text-red-400 font-medium">{disabledReason}</p>
      )}
      <div className="grid grid-cols-3 items-center gap-3">
        
        <button
          onClick={() => setpaymentmSelect(prev => !prev)}
          className="flex items-center gap-2 min-w-0 py-1"
        >
          <span className="text-brand-primary">{selected.icon}</span>
          <span className="text-[14px] font-medium text-gray-800 truncate">
            {selected.label}
          </span>
          <span className="ml-1 text-gray-400">
            <ChevronUp
              className={`transition-transform duration-200 ${
                paymentmSelect ? 'rotate-180' : ''
              }`}
            />
          </span>
        </button>

     
        <button
          onClick={canPlaceOrder?handlePlaceOrder:undefined}
          disabled={!canPlaceOrder}
          className={`py-4 col-span-2 rounded-2xl  text-white font-extrabold text-[16px] flex items-center justify-center gap-2.5 shadow-[0_6px_20px_rgba(13,158,126,.3)] active:scale-[.98] transition-transform 
            ${!canPlaceOrder ? "bg-gray-400":"bg-linear-to-br from-brand-primary to-brand-dark"} `}
        >
          Place Order {I.arrow}
        </button>
      </div>

      <div className="flex justify-center gap-3 mt-2.5 text-[#ccc]">
        {[I.shield, I.lock, I.cc].map((ic, i) => (
          <span key={i}>{ic}</span>
        ))}
      </div>
    </div>
  )
}