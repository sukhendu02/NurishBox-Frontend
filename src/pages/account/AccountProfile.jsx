
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  User, Mail, Phone, Pencil, Check, X,
  BadgeCheck, ShieldAlert, Loader,
} from "lucide-react";
import useUserStore from "../../store/userStore";

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
 


// ─── FIELD CONFIG ─────────────────────────────────────────────────────────────
// Add new fields here when the API supports them — no changes needed elsewhere
const FIELD_DEFS = [
  {
    key:         "name",
    label:       "Full Name",
    Icon:        User,
    type:        "text",
    placeholder: "Enter your full name",
    validate:    v => !v.trim() ? "Name is required" : null,
    format:      v => v,
  },
 
  {
    key:         "phone",
    label:       "Phone Number",
    Icon:        Phone,
    type:        "tel",
    placeholder: "10-digit mobile number",
    validate:    v => v && !/^\d{10}$/.test(v.replace(/\s/g, ""))
                    ? "Enter a valid 10-digit number"
                    : null,
    format:      v => v ? `+91 ${v}` : "—",
    // stored without +91, sent without +91
    sanitize:    v => v.replace(/^\+91\s?/, "").replace(/\s/g, ""),
  },
   {
    key:         "email",
    label:       "Email Address",
    Icon:        Mail,
    type:        "email",
    placeholder: "Enter your email",
    validate:    v => !v.trim() ? "Email is required"
                    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email"
                    : null,
    format:      v => v,
    // badge shown next to value when not editing
    
    Badge: ({ profile }) => profile?.isEmailVerified
      ? <span className="flex items-center gap-1 text-[10px] font-bold text-brand-dark bg-brand-surface border border-brand-tint rounded-full px-2 py-0.5">
          <BadgeCheck size={11} /> Verified
        </span>
      : <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
          <ShieldAlert size={11} /> Unverified
        </span>,
  },
];

// ─── SINGLE FIELD ROW ─────────────────────────────────────────────────────────
function ProfileFieldRow({ fieldDef, value, profile, onSave }) {
  const { key, label, Icon, type, placeholder, validate, format, sanitize, Badge } = fieldDef;

  const [editing,   setEditing]   = useState(false);
  const [draft,     setDraft]     = useState("");
  const [error,     setError]     = useState("");
  const [saving,    setSaving]    = useState(false);

  const startEdit = () => {
    setDraft(value ?? "");
    setError("");
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setError("");
    setDraft("");
  };

  const handleSave = async () => {
    const cleaned = sanitize ? sanitize(draft) : draft.trim();

    // Client validation
    const err = validate?.(cleaned);
    if (err) { setError(err); return; }

    // No change — just close
    if (cleaned === (value ?? "")) { cancelEdit(); return; }

    setSaving(true);
    const result = await onSave({ [key]: cleaned });
    setSaving(false);

    if (result?.ok === true) {
      setEditing(false);
      setError("");
    } else if (result?.ok === false && result?.error) {
      setError(
        typeof result.error === "string"
          ? result.error
          : result.error?.message || "Failed to update"
      );
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter")  handleSave();
    if (e.key === "Escape") cancelEdit();
  };

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 px-5 py-4 ${
      editing
        ? "border-brand-primary shadow-[0_0_0_1px_rgba(13,158,126,0.12)]"
        : "border-[#eef5f0] hover:border-brand-tint"
    }`}>
      <div className="flex items-start gap-3">

        {/* Icon */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
          editing ? "bg-brand-surface text-brand-primary" : "bg-[#f0f5f2] text-[#888]"
        }`}>
          <Icon size={17} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#aaa] mb-1">
            {label}
          </p>

          {editing ? (
            <div className="flex flex-col gap-1.5">
              <input
                type={type}
                value={draft}
                onChange={e => { setDraft(e.target.value); if (error) setError(""); }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                autoFocus
                className="h-9 rounded-xl 
                border-[1.5px] border-[#e0ebe0] 
                px-3 text-[13px] font-medium text-[#1a2e1a] outline-none bg-[#fafcfa]  transition-colors placeholder:text-[#ccc] w-full"
              />
              {error && (
                <p className="flex items-center gap-1 text-[11px] text-red-400 font-medium">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[14px] font-semibold text-[#1a2e1a] truncate">
                {format ? format(value) : value || "—"}
              </p>
              {Badge && <Badge profile={profile} />}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-7 h-7 rounded-lg cursor-pointer bg-brand-surface flex items-center justify-center text-brand-primary hover:bg-brand-tint transition-colors disabled:opacity-50"
                title="Save"
              >
                {saving
                  ? <Loader size={13} className="animate-spin" />
                  : <Check size={13}  />
                }
              </button>
              <button
                onClick={cancelEdit}
                disabled={saving}
                className="w-7 h-7 cursor-pointer rounded-lg bg-[#f5f5f5] flex items-center justify-center text-[#999] hover:text-[#555] transition-colors disabled:opacity-50"
                title="Cancel"
              >
                <X size={13}  />
              </button>
            </>
          ) : (
            <button
              onClick={startEdit}
              className="w-7 h-7 rounded-lg cursor-pointer flex items-center justify-center text-[#ccc] hover:text-brand-primary hover:bg-brand-surface transition-all"
              title={`Edit ${label}`}
            >
              <Pencil size={13} className="cursor-pointer" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function AccountProfile() {
  const { isLoadingProfile } = useOutletContext();
  const { profile, updateProfile } = useUserStore();

  const handleSave = async (patch) => {
    const result = await updateProfile(patch);
    // updateProfile in store returns true/false — normalise to { ok }
    if (result === true  || result?.ok === true)  return { ok: true };
    if (result === false || result?.ok === false) {
      return {
        ok: false,
        error: typeof result?.error === "string"
          ? result.error
          : result?.error?.message || "Failed to update profile",
      };
    }
    return { ok: true }; // fallback
  };

  if (isLoadingProfile) {
    return (
      <>
        <style>{SHIMMER_CSS}</style>
        <ProfileSkeleton />
      </>
    );
  }

  return (
    <>
      <style>{SHIMMER_CSS}</style>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        
        {/* Field rows — add new fields to FIELD_DEFS above, nothing else changes */}
        {FIELD_DEFS.map(def => (
          <ProfileFieldRow
            key={def.key}
            fieldDef={def}
            value={profile?.[def.key] ?? ""}
            profile={profile}
            onSave={handleSave}
          />
        ))}

      </div>
    </>
  );
}