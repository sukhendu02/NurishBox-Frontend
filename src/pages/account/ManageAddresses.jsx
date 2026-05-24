// import { useState, useEffect } from "react";
// import { useOutletContext } from "react-router-dom";
// import {
//   Home,
//   Briefcase,
//   MapPin,
//   Pencil,
//   Trash2,
//   Plus,
//   Check,
//   X,
// } from "lucide-react";
// import useUserStore from "../../store/userStore";

// // ─── ADDRESS TYPE CONFIG ──────────────────────────────────────────────────────
// // API uses uppercase: "HOME" | "WORK" | "OTHER"
// const ADDRESS_TYPES = [
//   { value: "HOME",  label: "Home",  Icon: Home      },
//   { value: "WORK",  label: "Work",  Icon: Briefcase },
//   { value: "OTHER", label: "Other", Icon: MapPin     },
// ];

// function getTypeConfig(label) {
//   return (
//     ADDRESS_TYPES.find(t => t.value === label?.toUpperCase()) ?? ADDRESS_TYPES[2]
//   );
// }

// // ─── SHIMMER ─────────────────────────────────────────────────────────────────
// const SHIMMER_CSS = `
// @keyframes shimmer {
//   0%   { background-position: -600px 0 }
//   100% { background-position:  600px 0 }
// }
// .sk {
//   background: linear-gradient(90deg, #e8f0ec 25%, #f3f8f5 50%, #e8f0ec 75%);
//   background-size: 600px 100%;
//   animation: shimmer 1.4s infinite linear;
//   border-radius: 10px;
// }
// `;

// function Sk({ className = "" }) {
//   return <div className={`sk ${className}`} />;
// }

// // ─── SKELETONS ────────────────────────────────────────────────────────────────
// function AddressCardSkeleton() {
//   return (
//     <div className="bg-white rounded-2xl border border-[#eef5f0] p-5 flex flex-col gap-3">
//       <div className="flex items-start justify-between">
//         <div className="flex items-center gap-2.5">
//           <Sk className="w-9 h-9 rounded-xl shrink-0" />
//           <Sk className="h-4 w-20 rounded-full" />
//         </div>
//         <Sk className="w-7 h-7 rounded-lg" />
//       </div>
//       <div className="space-y-1.5 pt-1">
//         <Sk className="h-3.5 w-28 rounded-full" />
//         <Sk className="h-3 w-24 rounded-full" />
//       </div>
//       <div className="space-y-1 pt-1">
//         <Sk className="h-3 w-full rounded-full" />
//         <Sk className="h-3 w-4/5 rounded-full" />
//         <Sk className="h-3 w-3/5 rounded-full" />
//       </div>
//       <Sk className="h-10 w-full rounded-xl mt-1" />
//     </div>
//   );
// }

// function AddressSkeletonGrid() {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
//       {[1, 2, 3].map(i => <AddressCardSkeleton key={i} />)}
//     </div>
//   );
// }

// // ─── SAVED LOCATIONS BANNER ───────────────────────────────────────────────────
// function SavedLocationsBanner({ count }) {
//   return (
//     <div
//       className="relative rounded-2xl overflow-hidden h-20 flex items-center justify-center"
//       style={{ background: "linear-gradient(135deg, #c2ddd4 0%, #a8c8bc 100%)" }}
//     >
//       <div
//         className="absolute inset-0 opacity-20"
//         style={{
//           backgroundImage:
//             "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
//           backgroundSize: "14px 14px",
//         }}
//       />
//       <div className="relative flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-5 py-2 border border-white/40">
//         <MapPin size={14} className="text-[#065443]" />
//         <span className="text-[13px] font-bold tracking-widest text-[#065443] uppercase">
//           {count} Saved Location{count !== 1 ? "s" : ""}
//         </span>
//       </div>
//     </div>
//   );
// }

// // ─── FORM FIELD ───────────────────────────────────────────────────────────────
// function FormField({ label, placeholder, value, onChange, required, maxLength }) {
//   return (
//     <div className="flex flex-col gap-1">
//       <label className="text-[11px] font-bold uppercase tracking-widest text-[#aaa]">
//         {label}
//         {required && <span className="text-red-400 ml-0.5">*</span>}
//       </label>
//       <input
//         type="text"
//         value={value}
//         onChange={e => onChange(e.target.value)}
//         placeholder={placeholder}
//         required={required}
//         maxLength={maxLength}
//         className="h-10 rounded-xl border-[1.5px] border-[#e0ebe0] px-3 text-[13px] font-medium text-[#1a2e1a] outline-none bg-[#fafcfa] focus:border-brand-primary transition-colors placeholder:text-[#ccc] placeholder:font-normal"
//       />
//     </div>
//   );
// }

// // ─── ADDRESS FORM MODAL ───────────────────────────────────────────────────────
// function AddressFormModal({ open, onClose, onSave, initial, isSaving }) {
//   const isEdit = !!initial;

//   const blank = {
//     label:       "HOME",
//     customLabel: "",
//     name:        "",
//     phone:       "",
//     line1:       "",
//     line2:       "",
//     landmark:    "",
//     city:        "",
//     state:       "",
//     pincode:     "",
//     country:     "India",
//   };

//   const [form, setForm] = useState(blank);

//   useEffect(() => {
//     if (!open) return;
//     if (initial) {
//       setForm({
//         label:       initial.label           ?? "HOME",
//         customLabel: initial.customLabel     ?? "",
//         name:        initial.receiversName   ?? "",
//         phone:       initial.receiversPhone  ?? "",
//         line1:       initial.line1           ?? "",
//         line2:       initial.line2           ?? "",
//         landmark:    initial.landmark        ?? "",
//         city:        initial.city            ?? "",
//         state:       initial.state           ?? "",
//         pincode:     initial.pincode         ?? "",
//         country:     initial.country         ?? "India",
//       });
//     } else {
//       setForm(blank);
//     }
//   }, [open, initial]);

//   if (!open) return null;

//   const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const payload = {
//       label:          form.label.toUpperCase(),
//       customLabel:    form.customLabel    || null,
//       receiversName:  form.name,
//       receiversPhone: form.phone          || null,
//       line1:          form.line1,
//       line2:          form.line2          || null,
//       landmark:       form.landmark       || null,
//       city:           form.city,
//       state:          form.state,
//       pincode:        form.pincode,
//       country:        form.country        ?? "India",
//     };
//     const ok = await onSave({ ...payload, id: initial?.id });
//     if (ok !== false) onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4">
//       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

//       <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">

//         {/* Header */}
//         <div className="flex items-center justify-between px-5 py-4 border-b border-[#eef5f0] shrink-0">
//           <p className="text-[17px] font-extrabold text-text-brand">
//             {isEdit ? "Edit Address" : "Add New Address"}
//           </p>
//           <button
//             type="button"
//             onClick={onClose}
//             className="w-8 h-8 rounded-full bg-[#f0f5f2] flex items-center justify-center text-[#999] hover:text-text-brand transition-colors"
//           >
//             <X size={16} />
//           </button>
//         </div>

//         {/* Scrollable form */}
//         <form onSubmit={handleSubmit} className="overflow-y-auto px-5 py-5 flex flex-col gap-4">

//           {/* Type pills */}
//           <div>
//             <label className="text-[11px] font-bold uppercase tracking-widest text-[#aaa] block mb-2">
//               Address Type
//             </label>
//             <div className="flex gap-2">
//               {ADDRESS_TYPES.map(t => {
//                 const active = form.label === t.value;
//                 return (
//                   <button
//                     type="button"
//                     key={t.value}
//                     onClick={() => set("label", t.value)}
//                     className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-[1.5px] text-[13px] font-semibold transition-all ${
//                       active
//                         ? "bg-brand-surface border-brand-primary text-brand-dark"
//                         : "bg-white border-[#e0ebe0] text-[#888] hover:border-brand-tint"
//                     }`}
//                   >
//                     <t.Icon
//                       size={14}
//                       className={active ? "text-brand-primary" : "text-[#bbb]"}
//                     />
//                     {t.label}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Custom label — only for OTHER */}
//           {form.label === "OTHER" && (
//             <FormField
//               label="Custom Label"
//               placeholder="e.g. Gym, Parents' home"
//               value={form.customLabel}
//               onChange={v => set("customLabel", v)}
//             />
//           )}

//           {/* Contact */}
//           <div className="grid grid-cols-2 gap-3">
//             <FormField
//               label="Receiver's Name"
//               placeholder="Full name"
//               value={form.name}
//               onChange={v => set("name", v)}
//               required
//             />
//             <FormField
//               label="Phone (optional)"
//               placeholder="9876543210"
//               value={form.phone}
//               onChange={v => set("phone", v)}
//             />
//           </div>

//           {/* Address lines */}
//           <FormField
//             label="Address Line 1"
//             placeholder="Flat / Building / Street"
//             value={form.line1}
//             onChange={v => set("line1", v)}
//             required
//           />
//           <FormField
//             label="Address Line 2"
//             placeholder="Locality / Area"
//             value={form.line2}
//             onChange={v => set("line2", v)}
//           />
//           <FormField
//             label="Landmark"
//             placeholder="Near bus stop, mall…"
//             value={form.landmark}
//             onChange={v => set("landmark", v)}
//           />

//           {/* City / State / Pincode */}
//           <div className="grid grid-cols-3 gap-3">
//             <FormField label="City"    placeholder="City"   value={form.city}    onChange={v => set("city",    v)} required />
//             <FormField label="State"   placeholder="State"  value={form.state}   onChange={v => set("state",   v)} required />
//             <FormField label="Pincode" placeholder="000000" value={form.pincode} onChange={v => set("pincode", v)} required maxLength={6} />
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={isSaving}
//             className="w-full mt-1 py-3.5 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-dark text-white font-extrabold text-[15px] flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(13,158,126,.25)] hover:scale-[1.01] active:scale-[.98] transition-transform disabled:opacity-60 disabled:scale-100"
//           >
//             {isSaving
//               ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//               : <Check size={16} />
//             }
//             {isSaving ? "Saving…" : isEdit ? "Update Address" : "Save Address"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// // ─── DELETE CONFIRM DIALOG ────────────────────────────────────────────────────
// function DeleteDialog({ open, onClose, onConfirm, isSaving }) {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
//       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
//         <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
//           <Trash2 size={22} className="text-red-400" />
//         </div>
//         <p className="text-[16px] font-extrabold text-text-brand text-center mb-1">
//           Remove Address?
//         </p>
//         <p className="text-[13px] text-[#999] text-center mb-6">
//           This address will be permanently removed from your account.
//         </p>
//         <div className="flex gap-3">
//           <button
//             onClick={onClose}
//             disabled={isSaving}
//             className="flex-1 py-3 rounded-xl border border-[#e0ebe0] text-[#555] font-semibold text-[14px] hover:bg-[#f5f5f5] transition-colors disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             disabled={isSaving}
//             className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-[14px] hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
//           >
//             {isSaving && (
//               <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//             )}
//             {isSaving ? "Removing…" : "Remove"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── ADDRESS CARD ─────────────────────────────────────────────────────────────
// function AddressCard({ address, onEdit, onDelete, onSetDefault, settingDefault }) {
//   const typeConfig = getTypeConfig(address.label);
//   const { Icon: TypeIcon } = typeConfig;
//   const isDefault = address.isDefault;

//   // customLabel takes priority for "OTHER" type
//   const displayLabel =
//     address.label === "OTHER" && address.customLabel
//       ? address.customLabel
//       : typeConfig.label;

//   const fullAddress = [
//     address.line1,
//     address.line2,
//     address.landmark,
//     address.city,
//     address.state,
//     address.pincode,
//     address.country !== "India" ? address.country : null,
//   ]
//     .filter(Boolean)
//     .join(", ");

//   return (
//     <div
//       className={`bg-white rounded-2xl border transition-all duration-200 p-5 flex flex-col gap-3 relative group ${
//         isDefault
//           ? "border-brand-primary shadow-[0_0_0_1px_rgba(13,158,126,0.12),0_4px_16px_rgba(13,158,126,.1)]"
//           : "border-[#eef5f0] hover:border-brand-tint hover:shadow-md"
//       }`}
//     >
//       {/* Header */}
//       <div className="flex items-start justify-between">
//         <div className="flex items-center gap-2.5 flex-wrap">
//           <div
//             className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
//               isDefault
//                 ? "bg-brand-surface text-brand-primary"
//                 : "bg-[#f0f5f2] text-[#888]"
//             }`}
//           >
//             <TypeIcon size={18} />
//           </div>
//           <span className="font-extrabold text-[15px] text-text-brand">{displayLabel}</span>
//           {isDefault && (
//             <span className="text-[10px] font-black tracking-wider uppercase bg-brand-surface text-brand-dark border border-brand-tint rounded-full px-2 py-0.5">
//               Default
//             </span>
//           )}
//         </div>

//         {/* Edit — appears on hover */}
//         <button
//           onClick={() => onEdit(address)}
//           className="w-7 h-7 rounded-lg flex items-center justify-center text-[#ccc] hover:text-brand-primary hover:bg-brand-surface transition-all shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
//           aria-label="Edit address"
//         >
//           <Pencil size={14} />
//         </button>
//       </div>

//       {/* Receiver info */}
//       <div className="space-y-0.5">
//         <p className="text-[13px] font-bold text-[#1a2e1a]">{address.receiversName}</p>
//         {address.receiversPhone && (
//           <p className="text-[12px] text-[#999]">{address.receiversPhone}</p>
//         )}
//       </div>

//       {/* Address */}
//       <p className="text-[13px] text-[#666] leading-relaxed">{fullAddress}</p>

//       {/* Action buttons */}
//       <div className="flex gap-2 pt-1 mt-auto">
//         {!isDefault && (
//           <button
//             onClick={() => onSetDefault(address.id)}
//             disabled={settingDefault}
//             className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#d0e8dc] text-brand-dark text-[13px] font-semibold hover:bg-brand-surface transition-colors disabled:opacity-50"
//           >
//             {settingDefault ? (
//               <span className="w-3.5 h-3.5 border-2 border-brand-tint border-t-brand-primary rounded-full animate-spin" />
//             ) : (
//               <Check size={14} className="text-brand-primary" />
//             )}
//             Set as Default
//           </button>
//         )}
//         <button
//           onClick={() => onDelete(address)}
//           className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-[#ffe0e0] text-red-400 text-[13px] font-semibold hover:bg-red-50 transition-colors ${
//             isDefault ? "flex-1" : ""
//           }`}
//           aria-label="Delete address"
//         >
//           <Trash2 size={14} />
//           {isDefault ? "Remove" : ""}
//         </button>
//       </div>
//     </div>
//   );
// }

// // ─── EMPTY STATE ──────────────────────────────────────────────────────────────
// function EmptyState({ onAdd }) {
//   return (
//     <div className="flex flex-col items-center justify-center py-16 text-center px-6 bg-white rounded-2xl border border-[#eef5f0]">
//       <div className="w-16 h-16 rounded-2xl bg-brand-surface flex items-center justify-center mb-5">
//         <MapPin size={32} className="text-brand-primary" />
//       </div>
//       <p className="text-[18px] font-extrabold text-text-brand mb-2">No Saved Addresses</p>
//       <p className="text-[13px] text-[#999] max-w-xs mb-7">
//         Add your home, work, or other frequent delivery locations for a faster checkout experience.
//       </p>
//       <button
//         onClick={onAdd}
//         className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-dark text-white font-bold text-[14px] shadow-[0_4px_16px_rgba(13,158,126,.25)] hover:scale-105 active:scale-95 transition-transform"
//       >
//         <Plus size={16} />
//         Add First Address
//       </button>
//     </div>
//   );
// }

// // ─── MAIN ─────────────────────────────────────────────────────────────────────
// export default function ManageAddress() {
//   const { isLoadingProfile } = useOutletContext();

//   const {
//     addresses,
//     isLoadingAddresses,
//     isSaving,
//     addAddress,
//     updateAddress,
//     deleteAddress,
//     setDefaultAddress,
//   } = useUserStore();

//   const [modalOpen,        setModalOpen]       = useState(false);
//   const [editTarget,       setEditTarget]       = useState(null);
//   const [deleteTarget,     setDeleteTarget]     = useState(null);
//   const [settingDefaultId, setSettingDefaultId] = useState(null);

//   // ── Handlers ─────────────────────────────────────────────────────────────
//   const handleOpenAdd = () => { setEditTarget(null); setModalOpen(true); };
//   const handleEdit    = (addr) => { setEditTarget(addr); setModalOpen(true); };

//   // Store already updates state optimistically — no re-fetch needed
//   const handleSave = async (payload) => {
//     let ok;
//     if (payload.id) {
//       ok = await updateAddress(payload.id, payload);
//     } else {
//       ok = await addAddress(payload);
//     }
//     return ok; // AddressFormModal closes only when ok !== false
//   };

//   const handleDeleteConfirm = async () => {
//     if (!deleteTarget) return;
//     const ok = await deleteAddress(deleteTarget.id);
//     if (ok !== false) setDeleteTarget(null);
//   };

//   const handleSetDefault = async (id) => {
//     setSettingDefaultId(id);
//     await setDefaultAddress(id);
//     setSettingDefaultId(null);
//   };

//   // ── Derived ──────────────────────────────────────────────────────────────
//   // AccountShell already calls fetchAddresses on mount — no useEffect here
//   const isLoading = isLoadingAddresses || isLoadingProfile;

//   // addresses from store = response.data.allAddresses (fixed in userStore)
//   const sorted = [...(addresses ?? [])]
//     .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));

//   // ── Render ───────────────────────────────────────────────────────────────
//   return (
//     <>
//       <style>{SHIMMER_CSS}</style>

//       <div className="space-y-5">

//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-[22px] font-extrabold text-text-brand tracking-tight lg:hidden">
//               Delivery Addresses
//             </p>
//             <p className="text-[13px] text-[#999] mt-0.5">
//               {/* Manage your saved delivery locations */}
//             </p>
//           </div>
//           {!isLoading && sorted.length > 0 && (
//             <button
//               onClick={handleOpenAdd}
//               className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-primary text-white font-bold text-[13px] hover:bg-brand-dark transition-colors shadow-[0_2px_10px_rgba(13,158,126,.2)]"
//             >
//               <Plus size={15} />
//               Add Address
//             </button>
//           )}
//         </div>

//         {/* Body */}
//         {isLoading ? (
//           <AddressSkeletonGrid />
//         ) : sorted.length === 0 ? (
//           <EmptyState onAdd={handleOpenAdd} />
//         ) : (
//           <>
//             {/* Grid: 1-col → 2-col md → 3-col xl */}
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
//               {sorted.map(addr => (
//                 <AddressCard
//                   key={addr.id}
//                   address={addr}
//                   onEdit={handleEdit}
//                   onDelete={setDeleteTarget}
//                   onSetDefault={handleSetDefault}
//                   settingDefault={settingDefaultId === addr.id}
//                 />
//               ))}
//             </div>
//             <SavedLocationsBanner count={sorted.length} />
//           </>
//         )}

//         {/* Full-width add button at bottom */}
//         {!isLoading && sorted.length > 0 && (
//           <button
//             onClick={handleOpenAdd}
//             className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-dark text-white font-extrabold text-[15px] shadow-[0_4px_20px_rgba(13,158,126,.25)] hover:scale-[1.01] active:scale-[.98] transition-transform"
//           >
//             <Plus size={18} />
//             Add New Address
//           </button>
//         )}
//       </div>

//       {/* Add / Edit modal */}
//       <AddressFormModal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSave={handleSave}
//         initial={editTarget}
//         isSaving={isSaving}
//       />

//       {/* Delete dialog */}
//       <DeleteDialog
//         open={!!deleteTarget}
//         onClose={() => setDeleteTarget(null)}
//         onConfirm={handleDeleteConfirm}
//         isSaving={isSaving}
//       />
//     </>
//   );
// }


import { useState,useEffect} from "react";
import { useOutletContext } from "react-router-dom";
import {
  Home, Briefcase, MapPin, Pencil,Users,
  Trash2, Plus, Check, X,
} from "lucide-react";
import useUserStore from "../../store/userStore";
import MapPickerModal from "../account/MapPickerModal";

// ─── ADDRESS TYPE CONFIG ──────────────────────────────────────────────────────
const ADDRESS_TYPES = [
  { value: "HOME",  label: "Home",  Icon: Home      },
  { value: "WORK",  label: "Work",  Icon: Briefcase },
  { value: "FRIENDS & FAMILY",  label: "Friends & Family",  Icon: Users },
  { value: "OTHER", label: "Other", Icon: MapPin     },
];

function getTypeConfig(label) {
  return ADDRESS_TYPES.find(t => t.value === label?.toUpperCase()) ?? ADDRESS_TYPES[2];
}

// ─── SHIMMER ─────────────────────────────────────────────────────────────────
const SHIMMER_CSS = `
@keyframes shimmer {
  0%   { background-position: -600px 0 }
  100% { background-position:  600px 0 }
}
.sk {
  background: linear-gradient(90deg, #e8f0ec 25%, #f3f8f5 50%, #e8f0ec 75%);
  background-size: 600px 100%;
  animation: shimmer 1.4s infinite linear;
  border-radius: 10px;
}
`;

function Sk({ className = "" }) {
  return <div className={`sk ${className}`} />;
}

// ─── SKELETONS ────────────────────────────────────────────────────────────────
function AddressCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#eef5f0] p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <Sk className="w-9 h-9 rounded-xl shrink-0" />
          <Sk className="h-4 w-20 rounded-full" />
        </div>
        <Sk className="w-7 h-7 rounded-lg" />
      </div>
      <div className="space-y-1.5 pt-1">
        <Sk className="h-3.5 w-28 rounded-full" />
        <Sk className="h-3 w-24 rounded-full"   />
      </div>
      <div className="space-y-1 pt-1">
        <Sk className="h-3 w-full rounded-full" />
        <Sk className="h-3 w-4/5 rounded-full"  />
        <Sk className="h-3 w-3/5 rounded-full"  />
      </div>
      <Sk className="h-10 w-full rounded-xl mt-1" />
    </div>
  );
}

function AddressSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {[1, 2, 3].map(i => <AddressCardSkeleton key={i} />)}
    </div>
  );
}

// ─── SAVED LOCATIONS BANNER ───────────────────────────────────────────────────
function SavedLocationsBanner({ count }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden h-20 flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #c2ddd4 0%, #a8c8bc 100%)" }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)",
          backgroundSize: "14px 14px",
        }}
      />
      <div className="relative flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-5 py-2 border border-white/40">
        <MapPin size={14} className="text-brand-primary" />
        <span className="text-[13px] font-bold tracking-widest text-brand-primary uppercase">
          {count} Saved Location{count !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

// ─── FORM FIELD ───────────────────────────────────────────────────────────────
function FormField({ label, placeholder, value, onChange, required, maxLength }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-bold uppercase tracking-widest text-[#aaa]">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className="h-10 rounded-xl border-[1.5px] border-[#e0ebe0] px-3 text-[13px] font-medium text-[#1a2e1a] outline-none bg-[#fafcfa] focus:border-brand-primary transition-colors placeholder:text-[#ccc] placeholder:font-normal"
      />
    </div>
  );
}

// ─── VALIDATION ───────────────────────────────────────────────────────────────
function validate(form) {

 
  if (!form.name.trim())
    return "Receiver's name is required";
 
  if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\s/g, "")))
    return "Enter a valid 10-digit number";
 
  if (!form.line1.trim())
    return "Address line 1 is required";
 
  if (!form.city.trim())
    return "City is required";
 
  if (!form.state.trim())
    return "State is required";
 
  if (!form.pincode.trim())
    return "Pincode is required";
  else if (!/^\d{6}$/.test(form.pincode))
    return "Enter a valid 6-digit pincode";
 
  if (form.label === "OTHER" && !form.customLabel?.trim())
    return "Please enter a label for this address";
 
  return null;
}
 


const EMPTY_FORM = {
  label: "HOME", customLabel: "", name: "", phone: "",
  line1: "", line2: "", landmark: "", city: "", state: "",
  pincode: "", country: "India", latitude: "", longitude: "",
};

// ─── ADDRESS FORM MODAL ───────────────────────────────────────────────────────
// Receives `prefill` from MapPickerModal and `initial` from existing address (edit)
function AddressFormModal({ open, onClose, onBack, onSave, prefill, initial, isSaving }) {
 
//    const [serverError, setServerError] = useState("");   // backend message, banner
 
//   const isEdit = !!initial;

//   // Merge: initial (existing DB values) ← prefill (from map, only fills missing fields)
//   const buildForm = () => ({
//     label:       initial?.label           ?? "HOME",
//     customLabel: initial?.customLabel     ?? "",
//     name:        initial?.receiversName   ?? "",
//     phone:       initial?.receiversPhone  ?? "",
//     line1:       prefill?.line1  || initial?.line1  || "",
//     line2:       prefill?.line2  || initial?.line2  || "",
//     landmark:    initial?.landmark        ?? "",
//     city:        prefill?.city   || initial?.city   || "",
//     state:       prefill?.state  || initial?.state  || "",
//     pincode:     prefill?.pincode|| initial?.pincode|| "",
//     country:     prefill?.country|| initial?.country|| "India",
//     // lat/lng always come from the map step
//     latitude:    prefill?.latitude  || initial?.latitude  || "",
//     longitude:   prefill?.longitude || initial?.longitude || "",
//   });

//   const [form, setForm] = useState(buildForm);

//   // Re-build whenever modal opens or prefill changes
//   useState(() => {
//     if (open){
//       setServerError("")
//       setForm(buildForm());

//     } 
//   });

//   if (!open) return null;

//   const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setServerError("");
//     const payload = {
//       label:          form.label.toUpperCase(),
//       customLabel:    form.customLabel    || null,
//       receiversName:  form.name,
//       receiversPhone: form.phone          || null,
//       line1:          form.line1,
//       line2:          form.line2          || null,
//       landmark:       form.landmark       || null,
//       city:           form.city,
//       state:          form.state,
//       pincode:        form.pincode,
//       country:        form.country        || "India",
//       latitude:       form.latitude       || null,
//       longitude:      form.longitude      || null,
//     };
//     // const ok = await onSave({ ...payload, id: initial?.id });
//     const result = await onSave({ ...payload, id: initial?.id });
//     console.log(result)
//     // if ( !== false) onClose();
//    if (result?.ok === false && result?.error) {
//   // ensure it's always a string before putting it in state
//   setServerError(
//     typeof result.error === "string"
//       ? result.error
//       : result.error?.message || "Something went wrong"
//   )
//   return

//   if (result?.ok !== false){
//     setServerError("")
//     onClose() 
//   } 
// }
   

   
   
//   };

const isEdit = !!initial;
 
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [validationError, setValidationError] = useState("");
  const [serverError, setServerError] = useState("");

 useEffect(() => {
    if (!open) return;
 
    // Reset errors
    setValidationError("");
    setServerError("");
 
    const built = {
      label:       initial?.label           ?? "HOME",
      customLabel: initial?.customLabel     ?? "",
      name:        initial?.receiversName   ?? "",
      phone:       initial?.receiversPhone  ?? "",
      // map prefill takes priority; fall back to existing DB value
      line1:       prefill?.line1    || initial?.line1    || "",
      line2:       prefill?.line2    || initial?.line2    || "",
      landmark:    initial?.landmark ?? "",
      city:        prefill?.city     || initial?.city     || "",
      state:       prefill?.state    || initial?.state    || "",
      pincode:     prefill?.pincode  || initial?.pincode  || "",
      country:     prefill?.country  || initial?.country  || "India",
      // lat/lng ALWAYS come from the map step (prefill), fall back to saved DB value
      latitude:    prefill?.latitude  || initial?.latitude  || "",
      longitude:   prefill?.longitude || initial?.longitude || "",
    };
 
    console.log("[AddressFormModal] built form:", built); // ← verify lat/lng are present
    setForm(built);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  // ↑ intentional — prefill/initial are already up-to-date when open flips true
 
  if (!open) return null;
 
  // Update field value + immediately clear its inline error
  // const set = (k, v) => {
  //   setForm(f => ({ ...f, [k]: v }));
  //   if (fieldErrors[k]) setFieldErrors(f => ({ ...f, [k]: undefined }));
  // };
 const set = (k, v) => {
  setForm(f => ({ ...f, [k]: v }));
  if (validationError) setValidationError("");
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setValidationError("");
 
    // 1 ── Client-side validation first — no API call if fields are wrong
     const error = validate(form);
  if (error) {
    setValidationError(error);
    return;
  }
    // setFieldErrors({});
 
    // 2 ── Build payload
    const payload = {
      label:          form.label.toUpperCase(),
      customLabel:    form.customLabel     || null,
      receiversName:  form.name.trim(),
      receiversPhone: form.phone.trim()    || null,
      line1:          form.line1.trim(),
      line2:          form.line2.trim()    || null,
      landmark:       form.landmark.trim() || null,
      city:           form.city.trim(),
      state:          form.state.trim(),
      pincode:        form.pincode.trim(),
      country:        form.country         || "India",
      latitude:       form.latitude        || null,
      longitude:      form.longitude       || null,
    };
 
    console.log("[AddressFormModal] submitting payload:", payload); // ← verify lat/lng in payload
 
    // 3 ── Call store
    const result = await onSave({ ...payload, id: initial?.id });
 
    console.log("[AddressFormModal] save result:", result); // ← verify { ok, error } shape
 
    // 4 ── Handle result
    if (result?.ok === true) {
      // Success — clear errors and close
      setServerError("");
      setValidationError("");
      onClose();
      return;
    }
 
    if (result?.ok === false && result?.error) {
      // Backend validation error — show inside form, keep modal open
      setServerError(
        typeof result.error === "string"
          ? result.error
          : result.error?.message || "Something went wrong"
      );
      return;
    }
  };

 
  return (
    <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center px-0 sm:px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#eef5f0] shrink-0">
          {/* Back to map */}
          <button
            type="button"
            onClick={onBack}
            className="w-8 h-8 rounded-full cursor-pointer bg-[#f0f5f2] flex items-center justify-center text-[#999] hover:text-brand-primary transition-colors shrink-0"
            title="Back to map"
          >
            <MapPin size={15} />
          </button>
          <div className="flex-1">
            <p className="text-[17px] font-extrabold text-text-brand">
              {isEdit ? "Edit Address" : "Confirm Address"}
            </p>
            <p className="text-[11px] text-[#999] mt-0.5">
              Review and fill in the remaining details
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 cursor-pointer rounded-full bg-[#f0f5f2] flex items-center justify-center text-[#999] hover:text-text-brand transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* lat/lng chip — confirms location was captured */}
        {(form.latitude && form.longitude) && (
          <div className="px-5 pt-3 shrink-0">
            <div className="flex items-center gap-1.5 bg-brand-surface rounded-xl px-3 py-2">
              <MapPin size={12} className="text-brand-primary shrink-0" />
              <p className="text-[11px] text-brand-dark font-semibold truncate">
                {parseFloat(form.latitude).toFixed(5)}, {parseFloat(form.longitude).toFixed(5)}
              </p>
              <Check size={12} className="text-brand-primary ml-auto shrink-0" />
            </div>
          </div>
        )}

        {/* Scrollable form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-5 py-4 flex flex-col gap-4">


 {(serverError || validationError) && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
                className="shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="text-[12px] text-red-500 font-medium leading-relaxed">{serverError || validationError}</p>

            </div>
          )}

        


          {/* Type pills */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-widest text-[#aaa] block mb-2">
              Address Type
            </label>
            <div className="flex gap-2">
              {ADDRESS_TYPES.map(t => {
                const active = form.label === t.value;
                return (
                  <button
                    type="button"
                    key={t.value}
                    onClick={() => set("label", t.value)}
                    className={`flex-1 flex items-center justify-center gap-1 py-1 px-1 cursor-pointer rounded-xl border-[1.5px] text-[12px] font-semibold transition-all ${
                      active
                        ? "bg-brand-surface border-brand-primary text-brand-dark"
                        : "bg-white border-[#e0ebe0] text-[#888] hover:border-brand-tint"
                    }`}
                  >
                    <t.Icon size={14} className={active ? "text-brand-primary" : "text-[#bbb]"} />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom label for OTHER */}
          {form.label === "OTHER" && (
            <FormField
              label="Custom Label"
              placeholder="e.g. Gym, Parents' home"
              value={form.customLabel}
              onChange={v => set("customLabel", v)}
            />
          )}

          {/* Contact */}
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Receiver's Name"  placeholder="Full name"   value={form.name}  onChange={v => set("name",  v)} required />
            <FormField label="Phone" placeholder="9876543210"  value={form.phone} onChange={v => set("phone", v.replace(/\D/g, ""))}  maxLength={10} type="tel" inputMode="numeric"  required />
         
          </div>

          {/* Address lines */}
          <FormField label="Address Line 1" placeholder="Flat / Building / Street" value={form.line1}    onChange={v => set("line1",    v)} required />
          <FormField label="Address Line 2" placeholder="Locality / Area"           value={form.line2}    onChange={v => set("line2",    v)} />
          <FormField label="Landmark"       placeholder="Near bus stop, mall…"       value={form.landmark} onChange={v => set("landmark", v)} />

          {/* City / State / Pincode */}
          <div className="grid grid-cols-3 gap-3">
            <FormField label="City"    placeholder="City"   value={form.city}    onChange={v => set("city",    v)} required />
            <FormField label="State"   placeholder="State"  value={form.state}   onChange={v => set("state",   v)} required />
            <FormField label="Pincode" placeholder="000000" value={form.pincode} onChange={v => set("pincode", v)} required maxLength={6}   />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full mt-1 py-3.5 rounded-2xl bg-linear-to-br cursor-pointer from-brand-primary to-brand-dark text-white font-extrabold text-[15px] flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(13,158,126,.25)] hover:scale-[1.01] active:scale-[.98] transition-transform disabled:opacity-60 disabled:scale-100"
          >
            {isSaving
              ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : <Check size={16} />
            }
            {isSaving ? "Saving…" : isEdit ? "Update Address" : "Save Address"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── DELETE CONFIRM DIALOG ────────────────────────────────────────────────────
function DeleteDialog({ open, onClose, onConfirm, isSaving }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={22} className="text-red-400" />
        </div>
        <p className="text-[16px] font-extrabold text-text-brand text-center mb-1">Remove Address?</p>
        <p className="text-[13px] text-[#999] text-center mb-6">
          This address will be permanently removed from your account.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 py-3 rounded-xl cursor-pointer border border-[#e0ebe0] text-[#555] font-semibold text-[14px] hover:bg-[#f5f5f5] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSaving}
            className="flex-1 py-3 rounded-xl cursor-pointer bg-red-500 text-white font-bold text-[14px] hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSaving && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {isSaving ? "Removing…" : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ADDRESS CARD ─────────────────────────────────────────────────────────────
function AddressCard({ address, onEdit, onDelete, onSetDefault, settingDefault }) {
  const typeConfig   = getTypeConfig(address.label);
  const { Icon: TypeIcon } = typeConfig;
  const isDefault    = address.isDefault;
  const displayLabel =
    address.label === "OTHER" && address.customLabel
      ? address.customLabel
      : typeConfig.label;

  const fullAddress = [
    address.line1,
    address.line2,
    address.landmark,
    address.city,
    address.state,
    address.pincode,
    address.country !== "India" ? address.country : null,
  ].filter(Boolean).join(", ");

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 ring-1 ring-black/5 p-5 flex flex-col gap-3 relative group ${
        isDefault
          ? "border-brand-primary shadow-[0_0_0_1px_rgba(13,158,126,0.12),0_4px_16px_rgba(13,158,126,.1)]"
          : "border-[#eef5f0] hover:border-brand-tint hover:shadow-md"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isDefault ? "bg-brand-surface text-brand-primary" : "bg-[#f0f5f2] text-[#888]"
            }`}
          >
            <TypeIcon size={18} />
          </div>
          <span className="font-extrabold text-[15px] text-text-brand">{displayLabel}</span>
          {isDefault && (
            <span className="text-[10px] font-black tracking-wider uppercase bg-brand-surface text-brand-dark border border-brand-tint rounded-full px-2 py-0.5">
              Default
            </span>
          )}
        </div>
        <button
          onClick={() => onEdit(address)}
          className=" cursor-pointer w-7 h-7 rounded-lg flex items-center justify-center text-brand-primary hover:text-brand-primary hover:bg-brand-surface transition-all shrink-0 opacity-70 group-hover:opacity-100 focus:opacity-100"

          aria-label="Edit address"
        >
          <Pencil size={14}  />
        </button>
      </div>

      {/* Receiver */}
      <div className="space-y-0.5">
        <p className="text-[13px] font-bold text-[#1a2e1a]">{address.receiversName}</p>
        {address.receiversPhone && (
          <p className="text-[12px] text-[#999]">{address.receiversPhone}</p>
        )}
      </div>

      {/* Address text */}
      <p className="text-[13px] text-[#666] leading-relaxed">{fullAddress}</p>

      {/* Actions */}
      <div className="flex gap-2 pt-1 mt-auto">
        {!isDefault && (
          <button
            onClick={() => onSetDefault(address.id)}
            disabled={settingDefault}
            className="flex-1 flex items-center cursor-pointer justify-center gap-1.5 py-2.5 rounded-xl border border-[#d0e8dc] text-brand-dark text-[13px] font-semibold hover:bg-brand-surface transition-colors disabled:opacity-50"
          >
            {settingDefault
              ? <span className="w-3.5 h-3.5 border-2 border-brand-tint border-t-brand-primary rounded-full animate-spin" />
              : <Check size={14} className="text-brand-primary" />
            }
            Set as Default
          </button>
        )}
        <button
          onClick={() => onDelete(address)}
          className={`flex items-center justify-center cursor-pointer gap-1.5 py-2.5 px-3 rounded-xl border border-[#ffe0e0] text-red-400 text-[13px] font-semibold hover:bg-red-50 transition-colors ${
            isDefault ? "flex-1" : ""
          }`}
          aria-label="Delete address"
        >
          <Trash2 size={14} />
          {isDefault ? "Remove" : ""}
        </button>
      </div>
    </div>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6 bg-white rounded-2xl border border-[#eef5f0]">
      <div className="w-16 h-16 rounded-2xl bg-brand-surface flex items-center justify-center mb-5">
        <MapPin size={32} className="text-brand-primary" />
      </div>
      <p className="text-[18px] font-extrabold text-text-brand mb-2">No Saved Addresses</p>
      <p className="text-[13px] text-[#999] max-w-xs mb-7">
        Add your home, work, or other frequent delivery locations for a faster checkout experience.
      </p>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-linear-to-br from-brand-primary to-brand-dark text-white font-bold text-[14px] shadow-[0_4px_16px_rgba(13,158,126,.25)] hover:scale-105 active:scale-95 transition-transform"
      >
        <Plus size={16} />
        Add First Address
      </button>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function ManageAddress() {
  const { isLoadingProfile } = useOutletContext();

  const {
    addresses,
    isLoadingAddresses,
    isSaving,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useUserStore();

  // ── Modal state machine ────────────────────────────────────────────────────
  // step: null | "map" | "form"
  const [step,            setStep]            = useState(null);
  const [editTarget,      setEditTarget]      = useState(null); // existing address being edited
  const [mapPrefill,      setMapPrefill]      = useState(null); // data from MapPickerModal
  const [deleteTarget,    setDeleteTarget]    = useState(null);
  const [settingDefaultId, setSettingDefaultId] = useState(null);

  // ── Open flows ────────────────────────────────────────────────────────────
  const handleOpenAdd = () => {
    setEditTarget(null);
    setMapPrefill(null);
    setStep("map");
  };

  const handleEdit = (addr) => {
    setEditTarget(addr);
    setMapPrefill(null);
    setStep("map"); // always show map first even for edits
  };

  // ── Map → Form transition ──────────────────────────────────────────────────
  const handleMapConfirm = (locationData) => {
    // locationData = { latitude, longitude, line1, line2, city, state, pincode, country }
    setMapPrefill(locationData);
    setStep("form");
  };

  const handleBackToMap = () => {
    setStep("map");
  };

  const handleClose = () => {
    setStep(null);
    setEditTarget(null);
    setMapPrefill(null);
  };

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const handleSave = async (payload) => {
    const ok = editTarget?.id
      ? await updateAddress(editTarget.id, payload)
      : await addAddress(payload);
    return ok;
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const ok = await deleteAddress(deleteTarget.id);
    if (ok !== false) setDeleteTarget(null);
  };

  const handleSetDefault = async (id) => {
    setSettingDefaultId(id);
    await setDefaultAddress(id);
    setSettingDefaultId(null);
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const isLoading = isLoadingAddresses || isLoadingProfile;

  // Sort: default address first
  const sorted = [...(addresses ?? [])]
    .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{SHIMMER_CSS}</style>

      <div className="space-y-5">

        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[22px]  font-extrabold text-text-brand  tracking-tight lg:hidden">
              Delivery Addresses
            </p>
            {/* <p className="text-[13px] text-[#999] mt-0.5">
              Manage your saved delivery locations
            </p> */}
          </div>
          {!isLoading && sorted.length > 0 && (
            <button
              onClick={handleOpenAdd}
              className="hidden sm:flex items-center cursor-pointer  gap-1.5 px-4 py-2.5 rounded-xl bg-brand-primary text-white font-bold text-[13px] hover:bg-brand-dark transition-colors shadow-[0_2px_10px_rgba(13,158,126,.2)] ring-1 ring-black/5"
            >
              <Plus size={15} />
              Add Address
            </button>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <AddressSkeletonGrid />
        ) : sorted.length === 0 ? (
          <EmptyState onAdd={handleOpenAdd} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {sorted.map(addr => (
                <AddressCard
                  key={addr.id}
                  address={addr}
                  onEdit={handleEdit}
                  onDelete={setDeleteTarget}
                  onSetDefault={handleSetDefault}
                  settingDefault={settingDefaultId === addr.id}
                />
              ))}
            </div>
            <SavedLocationsBanner count={sorted.length} />
          </>
        )}

        {/* Full-width add button at bottom */}
        {!isLoading && sorted.length > 0 && (
          <button
            onClick={handleOpenAdd}
            className="w-full flex cursor-pointer mb-8 items-center justify-center gap-2 py-4 rounded-2xl  bg-brand-surface text-brand-dark font-extrabold text-[15px] shadow-[0_4px_20px_rgba(13,158,126,.25)] hover:scale-[1.01] active:scale-[.98] transition-transform border-dashed border-2 border-brand-dark"
          >
            <Plus size={18} />
            Add New Address
          </button>
        )}
      </div>

      {/* ── Step 1: Map picker ── */}
      <MapPickerModal
        open={step === "map"}
        onClose={handleClose}
        onConfirm={handleMapConfirm}
        initial={editTarget}  // existing lat/lng pre-positions the pin for edits
      />

      {/* ── Step 2: Address form (pre-filled from map) ── */}
      <AddressFormModal
        open={step === "form"}
        onClose={handleClose}
        onBack={handleBackToMap}
        onSave={handleSave}
        prefill={mapPrefill}
        initial={editTarget}
        isSaving={isSaving}
      />

      {/* Delete dialog */}
      <DeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isSaving={isSaving}
      />
    </>
  );
}