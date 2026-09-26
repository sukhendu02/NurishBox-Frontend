import { useState, useEffect, useRef } from "react";
import {
  User, Phone, Mail, Cake, Salad, Beef, Leaf, Infinity as InfinityIcon,
  MapPin, LifeBuoy, MessageSquareText, Trash2, Gift, Info,
  Check, X, Pencil, ChevronRight, Loader, AlertCircle,
  
} from "lucide-react";
import useUserStore from "../../store/userStore";
import { Navigate,Link } from "react-router-dom";
/* ------------------------------------------------------------------ */
/*  Field configuration                                                */
/* ------------------------------------------------------------------ */

const DIET_OPTIONS = [
  { value: "veg",      label: "Veg",          Icon: Salad },
  { value: "non_veg",  label: "Non-Veg",      Icon: Beef },
  { value: "vegan",    label: "Vegan",        Icon: Leaf },
  { value: "no_pref",  label: "No Preference", Icon: InfinityIcon },
];

const GOAL_OPTIONS = [
  { value: "muscle_gain", label: "Muscle Gain" },
  { value: "weight_loss", label: "Weight Loss" },
  { value: "clean_eating", label: "Clean Eating / Detox" },
  { value: "high_protein", label: "High Protein" },
  { value: "maintenance", label: "Maintenance" },
];

const validateName = (v) => (!v ? "Name can't be empty" : v.length < 2 ? "Name is too short" : "");
const validateDob = (v) => {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "Enter a valid date";
  if (d > new Date()) return "Date of birth can't be in the future";
  return "";
};
const validatePhone = (v) =>
  !v ? "Mobile number is required" : !/^[6-9]\d{9}$/.test(v) ? "Enter a valid 10-digit number" : "";
const validateEmail = (v) =>
  !v ? "Email is required" : !/^\S+@\S+\.\S+$/.test(v) ? "Enter a valid email address" : "";

const formatPhone = (v) => (v ? `+91 ${v.slice(0, 5)} ${v.slice(5)}` : "");

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const str = (v) => (v === null || v === undefined ? "" : String(v));

const maskEmail = (email) => {
  if (!email) return "your email";
  const [user, domain] = email.split("@");
  const head = user.slice(0, 2);
  return `${head}${"•".repeat(Math.max(user.length - 2, 2))}@${domain}`;
};

const maskPhone = (phone) => {
  const digits = str(phone).replace(/\D/g, "");
  if (!digits) return "your mobile number";
  return `+91 •••••${digits.slice(-5)}`;
};

/* ------------------------------------------------------------------ */
/*  Shared bits                                                        */
/* ------------------------------------------------------------------ */

// Small uppercase label used above every field, with optional trailing action/badge
function SectionLabel({ children, trailing }) {
  return (
    <div className="mb-1.5 flex items-center justify-between gap-2">
      <p className="text-[11px] font-bold uppercase tracking-wide text-[#7f9384]">{children}</p>
      {trailing}
    </div>
  );
}

// A muted note row with a leading icon — used for helper copy and OTP explainers
function InfoNote({ Icon = Info, children }) {
  return (
    <div className="mt-2 flex items-start gap-2 rounded-lg bg-[#eef4f1] px-3 py-2.5">
      <Icon size={13} className="mt-0.5 shrink-0 text-[#8ba396]" />
      <p className="text-[12px] leading-relaxed text-[#7f9384]">{children}</p>
    </div>
  );
}

// Plain editable field: icon + input inside a soft rounded box (Full name, Date of birth)
function InputRow({ Icon, value, onChange, error, type = "text", placeholder, max }) {
  return (
    <div>
      <div
        className={`flex h-12 items-center gap-2.5 rounded-xl bg-[#f4f7f5] px-3.5 transition-colors ${
          error ? "ring-1 ring-red-300" : "focus-within:ring-1 focus-within:ring-brand-primary"
        }`}
      >
        <Icon size={16} className="shrink-0 text-[#8ba396]" />
        <input
          type={type}
          value={value}
          max={max}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="h-full w-full min-w-0 bg-transparent text-[13.5px] font-semibold text-[#1a2e1a]
                     outline-none placeholder:text-[#b7c2ba] placeholder:font-medium"
        />
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-red-400">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

// Read-only contact row (mobile / email) — value is only changed via its own OTP-backed flow
function ContactRow({ Icon, display, placeholder }) {
  return (
    <div className="flex h-12 items-center gap-2.5 rounded-xl bg-[#f4f7f5] px-3.5">
      <Icon size={16} className="shrink-0 text-[#8ba396]" />
      <p className="truncate text-[13.5px] font-semibold text-[#1a2e1a]">
        {display || <span className="font-medium text-[#b7c2ba]">{placeholder}</span>}
      </p>
    </div>
  );
}

function ChangeLink({ onClick, label = "Change" }) {
  return (
    <button
      onClick={onClick}
      className="flex cursor-pointer items-center gap-1 text-[12px] font-semibold text-brand-primary
                 transition-opacity hover:opacity-75"
    >
      {label}
      <Pencil size={11} />
    </button>
  );
}

function VerifiedPill({ verified, onVerify }) {
  if (verified) {
    return (
      <span className="flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-[10.5px] font-bold text-white">
        <Check size={11} strokeWidth={3} />
        Verified
      </span>
    );
  }
  return (
    <button
      onClick={onVerify}
      className="flex cursor-pointer items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1
                 text-[10.5px] font-bold text-amber-700 transition-colors hover:bg-amber-200"
    >
      <AlertCircle size={11} />
      Verify now
    </button>
  );
}

function BirthdayBanner({ dob }) {
 
  return (
    <div className="flex items-start gap-2 align-middle  rounded-xl bg-[#fdece9] px-4 py-1.5">
      <div className="mt-0.5 flex  shrink-0 items-center justify-center rounded-lg  text-rose-600 ">
        <Gift size={20} />
      </div>
      <div>
        {/* <p className="text-[13px] font-bold text-[#c14a3d]">Celebration Privilege Enrolled</p> */}
        <p className="mt-0.5 text-xs leading-relaxed text-rose-500">
          Add your Date of Birth for exclusive birthday rewards.
        </p>
      </div>
    </div>
  );
}

function DietGrid({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {DIET_OPTIONS.map(({ value: v, label, Icon }) => {
        const active = value === v;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`flex flex-col items-center justify-center gap-1.5 rounded-xl py-3.5 text-[12.5px] font-bold
                        transition-colors cursor-pointer ${
                          active
                            ? "bg-brand-dark text-white"
                            : "bg-[#f4f7f5] text-[#5b6b62] hover:bg-[#eaf0ec]"
                        }`}
          >
            <Icon size={18} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

function GoalPills({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {GOAL_OPTIONS.map(({ value: v, label }) => {
        const active = value === v;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`h-9 shrink-0 cursor-pointer rounded-lg px-3.5 text-[12.5px] font-bold transition-colors ${
              active ? "bg-brand-dark text-white" : "bg-[#f4f7f5] text-[#5b6b62] hover:bg-[#eaf0ec]"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Change mobile / email dialog (enter new value, then verify OTP)    */
/* ------------------------------------------------------------------ */

function ChangeContactDialog({
  type, otherDestination, onRequestOtp, onVerifyOtp, onClose, onDone,
  reverify = false, initialValue = "",
}) {
  const isPhone = type === "phone";
  const otherChannel = isPhone ? "email" : "phone";
  const label = isPhone ? "mobile number" : "email address";

  const [step, setStep] = useState(reverify ? "sending" : "input"); // "input" | "sending" | "otp"
  const [value, setValue] = useState(initialValue);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const timer = useRef(null);

  // Reverifying an address we already have: send straight to that same channel and skip the input step.
  useEffect(() => {
    if (!reverify) return;
    (async () => {
      const res = await onRequestOtp({ field: type, newValue: initialValue, channel: type, destination: initialValue });
      if (res?.ok === false) { setError(res.error || "Couldn't send the code. Try again."); setStep("input"); return; }
      setStep("otp");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (step !== "otp") return;
    timer.current = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(timer.current);
  }, [step]);

  const submitValue = async () => {
    const cleaned = isPhone ? value.replace(/\D/g, "").slice(0, 10) : value.trim().toLowerCase();
    const err = isPhone ? validatePhone(cleaned) : validateEmail(cleaned);
    if (err) { setError(err); return; }

    setBusy(true);
    const res = await onRequestOtp({ field: type, newValue: cleaned, channel: otherChannel, destination: otherDestination });
    setBusy(false);
    if (res?.ok === false) { setError(res.error || "Couldn't send the code. Try again."); return; }

    setValue(cleaned);
    setError("");
    setSeconds(30);
    setStep("otp");
  };

  const submitOtp = async () => {
    if (code.length !== 6) { setError("Enter the 6-digit code"); return; }
    setBusy(true);
    const res = await onVerifyOtp({ field: type, newValue: value, otp: code });
    setBusy(false);
    if (res?.ok === false) { setError(res.error || "That code didn't match. Try again."); return; }
    onDone(value);
  };

  const resend = async () => {
    setError("");
    setCode("");
    if (reverify) {
      await onRequestOtp({ field: type, newValue: initialValue, channel: type, destination: initialValue });
    } else {
      await onRequestOtp({ field: type, newValue: value, channel: otherChannel, destination: otherDestination });
    }
    setSeconds(30);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1a12]/30">
      <div className="w-full max-w-90 rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-[16px] font-bold text-[#1a2e1a]">
              {step === "input" ? `Change ${label}` : "Confirm it's you"}
            </h3>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[#888]">
              {step === "input" &&
                `Enter your new ${label}. We'll send a code to confirm the change.`}
              {step === "sending" && `Sending a verification code to ${initialValue}…`}
              {step === "otp" && (
                <>We sent a 6-digit code to{" "}
                  <span className="font-semibold text-[#555]">{reverify ? initialValue : otherDestination}</span>.
                </>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="mt-0.5 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#f5f5f5] text-[#999] transition-colors hover:text-[#555]"
          >
            <X size={13} />
          </button>
        </div>

        {step === "sending" && (
          <div className="flex items-center justify-center py-6 text-[#8ba396]">
            <Loader size={20} className="animate-spin" />
          </div>
        )}

        {step === "input" ? (
          <input
            type={isPhone ? "tel" : "email"}
            value={value}
            autoFocus
            onChange={(e) => { setValue(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && submitValue()}
            placeholder={isPhone ? "10-digit number" : "you@example.com"}
            className="h-11 w-full rounded-xl border-[1.5px] border-[#e0ebe0] bg-[#fafcfa] px-3.5
                       text-[14px] font-semibold text-[#1a2e1a] outline-none transition-colors
                       placeholder:text-[#ccc] focus:border-brand-primary"
          />
        ) : step === "otp" ? (
          <input
            value={code}
            inputMode="numeric"
            autoFocus
            onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && submitOtp()}
            placeholder="••••••"
            className="h-11 w-full rounded-xl border-[1.5px] border-[#e0ebe0] bg-[#fafcfa] text-center
                       text-[18px] font-bold tracking-[0.5em] text-[#1a2e1a] outline-none
                       transition-colors placeholder:tracking-[0.4em] placeholder:text-[#ddd] focus:border-brand-primary"
          />
        ) : null}

        {error && (
          <p className="mt-2 flex items-center gap-1 text-[11px] font-medium text-red-400">
            <AlertCircle size={11} />
            {error}
          </p>
        )}

        {step !== "sending" && (
          <button
            onClick={step === "input" ? submitValue : submitOtp}
            disabled={busy}
            className="mt-4 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl
                       bg-brand-primary text-[13.5px] font-semibold text-white transition-opacity
                       hover:opacity-90 disabled:opacity-50"
          >
            {busy ? <Loader size={14} className="animate-spin" /> : <Check size={14} />}
            {step === "input" ? "Send code" : "Verify and save"}
          </button>
        )}

        {step === "otp" && (
          <p className="mt-3 text-center text-[11.5px] text-[#aaa]">
            {seconds > 0 ? (
              <>Resend code in {seconds}s</>
            ) : (
              <button onClick={resend} className="cursor-pointer font-semibold text-brand-primary hover:underline">
                Send a new code
              </button>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Delete dialog                                                      */
/* ------------------------------------------------------------------ */

function DeleteDialog({ onClose, onConfirm }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const confirm = async () => {
    setBusy(true);
    const res = await onConfirm();
    setBusy(false);
    if (res?.ok === false) setError(res.error || "We couldn't delete the account. Try again.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1a12]/30 px-5">
      <div className="w-full max-w-[380px] rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
          <Trash2 size={18} />
        </div>
        <h3 className="text-[16px] font-bold text-[#1a2e1a]">Delete your account</h3>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#888]">
          Your orders, saved addresses and coupons will be removed and can't be restored. Type{" "}
          <span className="font-bold text-[#555]">DELETE</span> to continue.
        </p>

        <input
          value={text}
          autoFocus
          onChange={(e) => { setText(e.target.value); setError(""); }}
          placeholder="DELETE"
          className="mt-4 h-10 w-full rounded-xl border-[1.5px] border-[#f0dcdc] bg-[#fffafa] px-3
                     text-[13px] font-semibold tracking-wide text-[#1a2e1a] outline-none
                     transition-colors placeholder:font-medium placeholder:text-[#ddd] focus:border-red-300"
        />

        {error && <p className="mt-2 text-[11px] font-medium text-red-400">{error}</p>}

        <div className="mt-4 flex gap-2">
          <button
            onClick={onClose}
            disabled={busy}
            className="h-10 flex-1 cursor-pointer rounded-xl bg-[#f5f5f5] text-[13px] font-semibold
                       text-[#777] transition-colors hover:text-[#444] disabled:opacity-50"
          >
            Keep my account
          </button>
          <button
            onClick={confirm}
            disabled={text !== "DELETE" || busy}
            className="flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl
                       bg-red-500 text-[13px] font-semibold text-white transition-opacity
                       hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy && <Loader size={13} className="animate-spin" />}
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Settings page                                                      */
/* ------------------------------------------------------------------ */

export default function SettingsPage({
  onRequestOtp,      // ({ field, newValue, channel, destination })-> { ok, error? }
  onVerifyOtp,       // ({ field, newValue, otp })                 -> { ok, error? }
  onDeleteAccount,   // ()                                         -> { ok, error? }
  onNavigate = () => {},
}) {
  const profile = useUserStore((s) => s.profile);
  const isLoadingProfile = useUserStore((s) => s.isLoadingProfile);
  const isSaving = useUserStore((s) => s.isSaving);
  const fetchProfile = useUserStore((s) => s.fetchProfile);
  const updateProfile = useUserStore((s) => s.updateProfile);

  const emptyDraft = { name: "", dob: "", dietaryPreference: "", fitnessGoal: "" };
  const [draft, setDraft] = useState(emptyDraft);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [changeType, setChangeType] = useState(null); // "phone" | "email" | null
  const [deleting, setDeleting] = useState(false);

  // Fetch the profile once on mount if the store doesn't already have it
  // (e.g. a hard refresh landing straight on /settings).
  useEffect(() => {
    if (!profile) fetchProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Seed the draft from the store exactly once, the moment the real profile
  // arrives. After that, the draft is only ever driven by the user (or by
  // `discard`) — we never overwrite it out from under an in-progress edit.

  const toDateInput = (v) => {
    if (!v) return "";
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
  };
  
  const normEnum = (v) => (v || "").toString().trim().toUpperCase();


  useEffect(() => {
    if (profile && !hasLoadedOnce) {
      
      setDraft({
        name: str(profile.name),
        dob: toDateInput(profile.dob),
        dietaryPreference: profile.dietary_pref || "",
        fitnessGoal: profile.fitness_goal || "",
      });
      setHasLoadedOnce(true);
    }
  }, [profile, hasLoadedOnce]);

  const dirty =
    !!profile &&
    (draft.name !== str(profile.name) ||
      draft.dob !== toDateInput(profile.dob) ||
      draft.dietaryPreference !== (profile.dietaryPreference || "") ||
      draft.fitnessGoal !== (profile.fitnessGoal || ""));

  const setField = (key, value) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: "" } : e));
    setFormError("");
  };

  const discard = () => {
    if (!profile) return;
    setDraft({
      name: str(profile.name),
      dob: toDateInput(profile.dob),
      dietaryPreference: profile.dietary_pref || "",
      fitnessGoal: profile.fitness_goal || "",
    });
    setErrors({});
    setFormError("");
  };

  const handleSave = async () => {
    const nextErrors = {
      name: validateName(draft.name),
      dob: validateDob(draft.dob),
    };
    if (Object.values(nextErrors).some(Boolean)) { setErrors(nextErrors); return; }

    // updateProfile() in the store applies this patch optimistically before
    // the request even resolves, and rolls back automatically on failure —
    // so the UI reflects the new values immediately, with no local echo needed here.
    const res = await updateProfile({
      name: draft.name,
      dob: draft.dob || null,
      dietary_pref: draft.dietaryPreference || null,
      fitness_goal: draft.fitnessGoal || null,
    });

    if (res?.ok === false) {
      setFormError(typeof res.error === "string" ? res.error : "Couldn't save your changes. Try again.");
    }
  };

  /* --- change mobile / email dialogs -------------------------------- */

  const openChange = (type) => setChangeType(type);
  const closeChange = () => setChangeType(null);

  // The dialog itself calls onRequestOtp/onVerifyOtp; onDone just signals success so we can close.
  // The parent app is expected to update `profile` (and its verified flags) once onVerifyOtp resolves.
  const handleChangeDone = () => setChangeType(null);

  const verifyExistingEmail = () => {
    // Re-uses the same dialog, pre-armed to resend a code to the existing address.
    setChangeType("email-reverify");
  };

  const links = [
    { key: "addresses", label: "Saved addresses", note: "Home, work and other delivery spots", Icon: MapPin,href:'/account/manage-address' },
    { key: "support",   label: "Help and support", note: "Order issues, refunds, account help", Icon: LifeBuoy,href:'/account/manage-address' },
    { key: "feedback",  label: "Share feedback",   note: "Tell us what to fix or build next",   Icon: MessageSquareText,href:'/account/manage-address' },
  ];

  // Profile hasn't arrived from the store yet — avoid reading profile.* below.
  if (!profile) {
    return (
      <div className="mx-auto w-full  px-4 pt-6 sm:px-6">
        <h1 className="mb-5 text-[20px] font-bold text-[#1a2e1a] sm:text-[22px]">Settings</h1>
        <div className="flex items-center justify-center rounded-2xl border border-[#eef5f0] bg-white py-16 text-[#8ba396]">
          <Loader size={20} className="animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full  pb-28  ">
      {/* <h1 className="mb-5 text-[20px] font-bold text-[#1a2e1a] sm:text-[22px]">Settings</h1> */}

      {/* Profile ---------------------------------------------------- */}
      <section className="space-y-5 rounded-2xl border border-[#eef5f0] bg-white p-3">

        {/* Full name */}
        <div>
          <SectionLabel>Full Name</SectionLabel>
          <InputRow
            Icon={User}
            value={draft.name}
            onChange={(v) => setField("name", v)}
            error={errors.name}
            placeholder="Your name"
          />
        </div>
        

        {/* Mobile */}
        <div>
          <SectionLabel trailing={<ChangeLink onClick={() => openChange("phone")} label="Change Mobile" />}>
            Mobile Phone Number
          </SectionLabel>
          <ContactRow Icon={Phone} display={formatPhone(profile.phone)} placeholder="No number added" />
          <InfoNote>
            For mobile number updates, an OTP will be sent to your registered email (
            <span className="font-semibold">{maskEmail(profile.email)}</span>) for two-factor security verification.
          </InfoNote>
        </div>

        {/* Email */}
           {/* Email */}
           <div>
          <SectionLabel
            trailing={
              profile.email ? (
                <VerifiedPill verified={!!profile.isEmailVerified} onVerify={verifyExistingEmail} />
              ) : null
            }
          >
            Email Address
          </SectionLabel>
 
          {profile.email ? (
            <ContactRow Icon={Mail} display={profile.email} placeholder="No email added" />
          ) : (
            <button
              onClick={() => openChange("email")}
              className="flex h-12 w-full cursor-pointer items-center gap-2.5 rounded-xl border-[1.5px]
                         border-dashed border-[#cfe0d5] bg-white px-3.5 text-left text-[13.5px] font-semibold
                         text-brand-primary transition-colors hover:bg-brand-surface"
            >
              <Mail size={16} className="shrink-0" />
              Add an email address
            </button>
          )}
 
          {/* <InfoNote>
            {profile.email
              ? "To update your email, we'll send a verification code to the new address — not to your phone."
              : "We'll send a verification code to the address you enter, so we can confirm it's yours."}
          </InfoNote> */}
 
          {profile.email && !profile.emailVerified && (
            <p className="mt-2 text-[12px] text-[#aaa]">
              Prefer a new address instead? <ChangeLink onClick={() => openChange("email")} label="Change email" />
            </p>
          )}
        </div>

        {/* DOB */}
        <div>
          <SectionLabel>Date of Birth</SectionLabel>
          <InputRow
            Icon={Cake}
            type="date"
            value={draft.dob}
            max={
              new Date(
                new Date().setFullYear(new Date().getFullYear() - 13)
              )
                .toISOString()
                .split("T")[0]
            }
            onChange={(v) => setField("dob", v)}
            error={errors.dob}
          />
          {!draft.dob &&(

            <div className="mt-2">
            <BirthdayBanner  />
          </div>
          )}
        </div>

        {/* Diet */}
        <div>
          <p className="text-[13.5px] font-bold text-[#1a2e1a]">Dietary Identity</p>
          <p className="mb-2.5 mt-0.5 text-[12px] text-[#9aa89f]">
            Our culinary team prioritizes these ingredients across all seasonal menus.
          </p>
          <DietGrid value={draft.dietaryPreference} onChange={(v) => setField("dietaryPreference", v)} />
        </div>

        {/* Fitness goal */}
        <div>
          <p className="text-[13.5px] font-bold text-[#1a2e1a]">Current Wellness &amp; Fitness Goal</p>
          <p className="mb-2.5 mt-0.5 text-[12px] text-[#9aa89f]">
            Calorie calculators and macronutrient ratios will tune themselves to this focus.
          </p>
          <GoalPills value={draft.fitnessGoal} onChange={(v) => setField("fitnessGoal", v)} />
        </div>

        {formError && (
          <p className="flex items-center gap-1 text-[12px] font-medium text-red-400">
            <AlertCircle size={12} />
            {formError}
          </p>
        )}
      </section>

      {/* Sticky action bar ------------------------------------------ */}
      {dirty && (
        <div className=" border-t border-[#eef5f0] bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="mx-auto flex w-full  flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              onClick={discard}
              disabled={isSaving}
              className="h-10 cursor-pointer rounded-xl bg-[#f0f0f0] px-5 text-xs font-semibold
                         text-[#888] transition-colors hover:text-[#555] disabled:opacity-50"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl
                         bg-brand-dark px-5 text-xs font-semibold text-white transition-opacity
                         hover:opacity-90 disabled:opacity-50"
            >
              {isSaving ? <Loader size={14} className="animate-spin" /> : ""}
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Links ------------------------------------------------------ */}
      <section className="mt-4 overflow-hidden rounded-2xl border border-[#eef5f0] bg-white">
        {links.map(({ key, label, note, Icon,href }) => (
          <Link
            key={key}
            // onClick={() => onNavigate(key)}
            to={href}
            className="group flex w-full cursor-pointer items-center gap-3 border-b border-[#f2f7f4]
                       px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-[#fafcfa]"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f2] text-[#888] transition-colors group-hover:bg-brand-surface group-hover:text-brand-primary">
              <Icon size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold text-[#1a2e1a]">{label}</p>
              <p className="truncate text-[11.5px] text-[#aaa]">{note}</p>
            </div>
            <ChevronRight size={16} className="shrink-0 text-[#ccc] transition-colors group-hover:text-brand-primary" />
          </Link>
        ))}
      </section>



      {/* Danger zone ------------------------------------------------ */}
      <section className="mt-4 rounded-2xl border border-[#f7e9e9] bg-white px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-400">
            <Trash2 size={17} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold text-[#1a2e1a]">Delete account</p>
            <p className="mt-0.5 text-[11.5px] leading-relaxed text-[#aaa]">
              Removes your profile, order history and saved addresses. This can't be undone.
            </p>
          </div>
          <button
            onClick={() => setDeleting(true)}
            className="h-8 shrink-0 cursor-pointer rounded-xl border-[1.5px] border-[#f2dede] px-3
                       text-[12.5px] font-semibold text-red-500 transition-colors hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </section>

      {(changeType === "phone" || changeType === "email") && (
        <ChangeContactDialog
          type={changeType}
          otherDestination={changeType === "phone" ? maskEmail(profile.email) : maskPhone(profile.phone)}
          onRequestOtp={onRequestOtp}
          onVerifyOtp={onVerifyOtp}
          onClose={closeChange}
          onDone={handleChangeDone}
        />
      )}

      {changeType === "email-reverify" && (
        <ChangeContactDialog
          type="email"
          reverify
          initialValue={profile.email}
          otherDestination={profile.email}
          onRequestOtp={onRequestOtp}
          onVerifyOtp={onVerifyOtp}
          onClose={closeChange}
          onDone={handleChangeDone}
        />
      )}

      {deleting && (
        <DeleteDialog onClose={() => setDeleting(false)} onConfirm={() => onDeleteAccount?.()} />
      )}
    </div>
  );
}