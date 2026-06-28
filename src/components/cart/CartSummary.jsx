// import { useState } from 'react'
// import { ChevronUp, Loader as Loader2 } from 'lucide-react'
// import { useNavigate } from 'react-router-dom'

// export default function CartSummary({
//   subtotal,
//   totalSavings,
//   deliveryFee,
//   totalAmount,
//   itemCount,
// }) {
//   const [expanded, setExpanded] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const navigate = useNavigate()

//   const handleCheckout = async () => {
//     setLoading(true)
//     setTimeout(() => {
//       navigate('/checkout')
//     }, 300)
//   }

//   return (
//     <div
//       style={{
//         position: 'fixed',
//         bottom: '5rem',
//         left: 0,
//         right: 0,
//         backgroundColor: 'white',
//         borderTopLeftRadius: '1.5rem',
//         borderTopRightRadius: '1.5rem',
//         boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)',
//         borderTop: '1px solid #B2E8D6',
//         padding: '1rem',
//         paddingTop: '1rem',
//         maxWidth: '430px',
//         marginLeft: 'auto',
//         marginRight: 'auto',
//         zIndex: 30,
//       }}
//     >
//       {/* Collapsed View */}
//       {!expanded && (
//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             paddingBottom: '0.5rem',
//           }}
//         >
//           <button
//             onClick={() => setExpanded(true)}
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '0.5rem',
//               backgroundColor: 'transparent',
//               border: 'none',
//               cursor: 'pointer',
//               padding: 0,
//             }}
//           >
//             <ChevronUp size={20} style={{ color: '#0D9E7E' }} />
//           </button>

//           <div style={{ textAlign: 'center', flex: 1 }}>
//             <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>Total</p>
//             <p
//               style={{
//                 fontSize: '1.25rem',
//                 fontWeight: '700',
//                 color: '#033428',
//                 margin: '0.25rem 0 0 0',
//               }}
//             >
//               ₹{totalAmount}
//             </p>
//           </div>

//           <button
//             onClick={handleCheckout}
//             disabled={itemCount === 0 || loading}
//             style={{
//               backgroundColor: itemCount === 0 ? '#D1D5DB' : '#0D9E7E',
//               color: itemCount === 0 ? '#6B7280' : 'white',
//               border: 'none',
//               borderRadius: '1rem',
//               padding: '0.75rem 1.5rem',
//               fontSize: '0.875rem',
//               fontWeight: '600',
//               cursor: itemCount === 0 ? 'not-allowed' : 'pointer',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '0.5rem',
//               transition: 'all 200ms',
//             }}
//           >
//             {loading && <Loader2 size={16} className="animate-spin" />}
//             Checkout
//           </button>
//         </div>
//       )}

//       {/* Expanded View */}
//       {expanded && (
//         <div>
//           <button
//             onClick={() => setExpanded(false)}
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '0.5rem',
//               backgroundColor: 'transparent',
//               border: 'none',
//               cursor: 'pointer',
//               padding: 0,
//               marginBottom: '1rem',
//             }}
//           >
//             <ChevronUp size={20} style={{ color: '#0D9E7E', transform: 'rotate(180deg)' }} />
//           </button>

//           {/* Price Breakdown */}
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//               <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>Subtotal</span>
//               <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#033428' }}>
//                 ₹{subtotal}
//               </span>
//             </div>

//             {totalSavings > 0 && (
//               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>Savings</span>
//                 <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0D9E7E' }}>
//                   - ₹{totalSavings}
//                 </span>
//               </div>
//             )}

//             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//               <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>Delivery</span>
//               <span
//                 style={{
//                   fontSize: '0.875rem',
//                   fontWeight: '600',
//                   color: deliveryFee === 0 ? '#0D9E7E' : '#033428',
//                 }}
//               >
//                 {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
//               </span>
//             </div>

//             <div
//               style={{
//                 borderTop: '1px solid #E5E7EB',
//                 paddingTop: '0.75rem',
//                 display: 'flex',
//                 justifyContent: 'space-between',
//               }}
//             >
//               <span style={{ fontSize: '1rem', fontWeight: '700', color: '#033428' }}>Total</span>
//               <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#033428' }}>
//                 ₹{totalAmount}
//               </span>
//             </div>
//           </div>

//           {/* Checkout Button */}
//           <button
//             onClick={handleCheckout}
//             disabled={itemCount === 0 || loading}
//             style={{
//               width: '100%',
//               backgroundColor: itemCount === 0 ? '#D1D5DB' : '#0D9E7E',
//               color: itemCount === 0 ? '#6B7280' : 'white',
//               border: 'none',
//               borderRadius: '1rem',
//               padding: '1rem',
//               fontSize: '0.875rem',
//               fontWeight: '600',
//               cursor: itemCount === 0 ? 'not-allowed' : 'pointer',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               gap: '0.5rem',
//               transition: 'all 200ms',
//             }}
//           >
//             {loading && <Loader2 size={18} className="animate-spin" />}
//             Proceed to Checkout • ₹{totalAmount}
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }
