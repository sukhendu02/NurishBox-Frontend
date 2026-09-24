import { useState, useRef } from "react";
import {
  Sprout, Leaf, Salad, Sparkles, Flower2, Star,
  UtensilsCrossed, Thermometer, Bike, FlaskConical, MonitorSmartphone, MessageSquareText,
  ImagePlus, X, Check, Coins, TrendingUp, ShieldCheck, Mail, Phone,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const MOODS = [
  { value: 1, label: "Poor",        Icon: Sprout,   tone: "#9aa89f" },
  { value: 2, label: "Fair",        Icon: Leaf,     tone: "#8fae7a" },
  { value: 3, label: "Good",        Icon: Salad,    tone: "#5b9c6e" },
  { value: 4, label: "Great",       Icon: Sparkles, tone: "#c08a2e" },
  { value: 5, label: "Exceptional", Icon: Flower2,  tone: "#d1608a" },
];

const AREAS = [
  { value: "TASTE",     label: "Food Taste & Quality",   Icon: UtensilsCrossed },
  { value: "PACKAGING", label: "Packaging & Temperature", Icon: Thermometer },
  { value: "DELIVERY",  label: "Delivery Speed & Courier", Icon: Bike },
  { value: "NUTRITION", label: "Nutritional Accuracy",   Icon: FlaskConical },
  { value: "APP",       label: "App & Tech Experience",  Icon: MonitorSmartphone },
  { value: "GENERAL",   label: "General Suggestions",    Icon: MessageSquareText },
];

const ATTRIBUTES = [
  { key: "freshness", label: "Food Freshness & Hygiene",  note: "Crisp greens, safe handling" },
  { key: "flavor",    label: "Taste & Flavor Balance",    note: "Seasoning, ingredient harmony" },
  { key: "packaging", label: "Packaging Sustainability",  note: "Compostable & thermal-safe" },
  { key: "punctual",  label: "Delivery Punctuality",      note: "Courier arrival window" },
];

const MAX_MESSAGE = 500;

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

function StarRow({ value, onChange, size = 18 }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = (hover || value) >= n;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            className="cursor-pointer  p-0.5 transition-transform hover:scale-110"
            aria-label={`${n} star`}
          >
            <Star
              size={size}
              className={filled ? "fill-[#c08a2e] text-[#c08a2e]" : "fill-transparent text-gray-400 "}
            />
          </button>
        );
      })}
    </div>
  );
}

function CardShell({ title, subtitle, trailing, children }) {
  return (
    <section className="rounded-2xl  ring-1 ring-black/10 border border-[#eef5f0] bg-white p-4 sm:p-5">
      {(title || trailing) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-[15px] font-bold text-gray-700">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-[12px] text-[#9aa89f]">{subtitle}</p>}
          </div>
          {trailing}
        </div>
      )}
      {children}
    </section>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
        checked ? "bg-brand-primary" : "bg-[#e2e8e4]"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Feedback page                                                       */
/* ------------------------------------------------------------------ */

export default function Feedback({
  profile = {},
  recentOrder = { id: "GK-6829", placedAt: "Oct 27 · 6:40 PM", item: "Garden Vitality Bowl" },
  onSubmit,   // (payload) -> { ok, error? }
}) {
  const [mood, setMood] = useState(0);
  const [overallStars, setOverallStars] = useState(0);
  const [areas, setAreas] = useState([]);
  const [orderContext, setOrderContext] = useState("order"); // "order" | "general"
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [attrs, setAttrs] = useState({ freshness: 0, flavor: 0, packaging: 0, punctual: 0 });
  const [photos, setPhotos] = useState([]);
  const [followUp, setFollowUp] = useState(false);
  const [channels, setChannels] = useState({ email: true, whatsapp: false });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const fileInput = useRef(null);

  const pickMood = (value) => {
    setMood(value);
    setOverallStars(value); // sensible default; the person can still fine-tune the stars themselves
  };

  const toggleArea = (value) =>
    setAreas((a) => (a.includes(value) ? a.filter((v) => v !== value) : [...a, value]));

  const addPhotos = (fileList) => {
    const files = Array.from(fileList || []).slice(0, 4 - photos.length);
    setPhotos((p) => [...p, ...files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) }))]);
  };

  const removePhoto = (idx) => setPhotos((p) => p.filter((_, i) => i !== idx));

  const canSubmit = mood > 0 && message.trim().length > 0 && !submitting;

  const handleSubmit = async () => {
    if (!mood) { setError("Let us know how the experience felt overall."); return; }
    if (!message.trim()) { setError("Add a few words so we know what to act on."); return; }
    setError("");
    setSubmitting(true);

    const res = await onSubmit?.({
      mood,
      overallStars,
      areas,
      orderId: orderContext === "order" ? recentOrder.id : null,
      topic: topic.trim(),
      message: message.trim(),
      attributes: attrs,
      photoCount: photos.length,
      followUp,
      channels: followUp ? channels : null,
    });

    setSubmitting(false);
    if (res?.ok === false) {
      setError(res.error || "Couldn't send your feedback. Try again.");
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="mx-auto w-full max-w-[640px] px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-surface text-brand-primary">
          <Check size={24} strokeWidth={2.5} />
        </div>
        <h1 className="text-[20px] font-bold text-[#1a2e1a]">Thanks — that's on its way to our team</h1>
        <p className="mx-auto mt-2 max-w-[380px] text-[13.5px] leading-relaxed text-[#9aa89f]">
          +50 Vitality Points have been credited to your account. Your notes shape next season's menu and packaging.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full pb-16 pt-2 ">

    

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Main column ------------------------------------------------ */}
        <div className="space-y-3  lg:col-span-2">

          {/* Overall experience */}
          <CardShell
            title="Overall experience"
            trailing={<span className="text-[11.5px] font-semibold text-[#9aa89f]">Select your feeling</span>}
          >
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {MOODS.map(({ value, label, Icon, tone }) => {
                const active = mood === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => pickMood(value)}
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl py-4 text-[12px] font-bold
                                transition-all cursor-pointer ${
                                  active
                                    ? "bg-[#f4f7f5] ring-2 ring-offset-0"
                                    : "bg-[#f9fbfa] text-[#9aa89f] hover:bg-[#f4f7f5]"
                                }`}
                    style={active ? { color: tone, ["--tw-ring-color"]: tone } : undefined}
                  >
                    <Icon size={22} style={{ color: active ? tone : undefined }} />
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex justify-center">
              <StarRow value={overallStars} onChange={setOverallStars} size={20} />
            </div>
          </CardShell>

          {/* Areas + order context */}
          <CardShell title="What area are you speaking to?" subtitle="Select all that apply">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {AREAS.map(({ value, label, Icon }) => {
                const active = areas.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleArea(value)}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[12.5px] font-semibold
                                transition-colors cursor-pointer ${
                                  active
                                    ? "bg-brand-primary text-white"
                                    : "bg-[#f4f7f5] text-[#5b6b62] hover:bg-[#eaf0ec]"
                                }`}
                  >
                    <Icon size={15} className="shrink-0" />
                    <span className="leading-tight">{label}</span>
                  </button>
                );
              })}
            </div>

            {/* <p className="mb-2 mt-5 text-[11px] font-bold uppercase tracking-wide text-[#7f9384]">
              Contextualize with a recent order (optional)
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setOrderContext("order")}
                className={`flex items-center gap-3 rounded-xl border-[1.5px] p-3 text-left transition-colors cursor-pointer ${
                  orderContext === "order" ? "border-brand-primary bg-brand-surface" : "border-transparent bg-[#f4f7f5] hover:bg-[#eaf0ec]"
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand-primary">
                  <UtensilsCrossed size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10.5px] font-bold uppercase tracking-wide text-[#9aa89f]">
                    Order #{recentOrder.id} · {recentOrder.placedAt}
                  </p>
                  <p className="truncate text-[13px] font-bold text-[#1a2e1a]">{recentOrder.item}</p>
                </div>
                {orderContext === "order" && (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white">
                    <Check size={11} strokeWidth={3} />
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setOrderContext("general")}
                className={`flex items-center gap-3 rounded-xl border-[1.5px] p-3 text-left transition-colors cursor-pointer ${
                  orderContext === "general" ? "border-brand-primary bg-brand-surface" : "border-transparent bg-[#f4f7f5] hover:bg-[#eaf0ec]"
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#9aa89f]">
                  <MessageSquareText size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10.5px] font-bold uppercase tracking-wide text-[#9aa89f]">Unlinked</p>
                  <p className="truncate text-[13px] font-bold text-[#1a2e1a]">General table &amp; app feedback</p>
                </div>
                {orderContext === "general" && (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white">
                    <Check size={11} strokeWidth={3} />
                  </div>
                )}
              </button>
            </div> */}
          </CardShell>

          {/* Detailed reflections */}
          <CardShell title="Detailed reflections">
            <div className="space-y-4">
              <div>
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-[#7f9384]">
                  Topic / core highlight
                </p>
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Eco-packaging durability, flavor balance in autumn dressing…"
                  className="h-11 w-full rounded-xl bg-[#f4f7f5] px-3.5 text-[13.5px] font-medium text-[#1a2e1a]
                             outline-none transition-colors placeholder:text-[#b7c2ba] focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-[#7f9384]">Your message</p>
                  <p className="text-[11px] text-[#b7c2ba]">{message.length}/{MAX_MESSAGE} characters</p>
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE))}
                  rows={4}
                  placeholder="Tell us what you loved, or what we can cultivate better for your vitality journey…"
                  className="w-full resize-none rounded-xl bg-[#f4f7f5] p-3.5 text-[13.5px] font-medium text-[#1a2e1a]
                             outline-none transition-colors placeholder:text-[#b7c2ba] focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[#7f9384]">Attribute breakdown</p>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {ATTRIBUTES.map(({ key, label, note }) => (
                    <div key={key} className="rounded-xl bg-[#f4f7f5] p-3.5">
                      <p className="text-[12.5px] font-bold text-[#1a2e1a]">{label}</p>
                      <p className="mb-2 text-[11px] text-[#9aa89f]">{note}</p>
                      <StarRow
                        value={attrs[key]}
                        onChange={(v) => setAttrs((a) => ({ ...a, [key]: v }))}
                        size={15}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardShell>

          {/* Photo upload */}
          <CardShell title="Visual proof / meal photos" subtitle="Optional — helps us investigate faster">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); addPhotos(e.dataTransfer.files); }}
              onClick={() => fileInput.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-[1.5px]
                         border-dashed border-[#d8e2dc] bg-[#f9fbfa] py-8 text-center transition-colors hover:bg-[#f4f7f5]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#9aa89f]">
                <ImagePlus size={18} />
              </div>
              <p className="text-[13px] font-semibold text-[#5b6b62]">Upload meal photos or screenshots</p>
              <p className="text-[11.5px] text-[#b7c2ba]">
                Drag and drop, or <span className="font-semibold text-brand-primary">browse files</span> · PNG, JPG up to 10MB
              </p>
              <input
                ref={fileInput}
                type="file"
                accept="image/png,image/jpeg"
                multiple
                hidden
                onChange={(e) => addPhotos(e.target.files)}
              />
            </div>

            {photos.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2.5">
                {photos.map((p, i) => (
                  <div key={i} className="group relative h-16 w-16 overflow-hidden rounded-lg">
                    <img src={p.url} alt={p.name} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removePhoto(i); }}
                      className="absolute right-0.5 top-0.5 flex h-5 w-5 cursor-pointer items-center justify-center
                                 rounded-full bg-black/60 text-white transition-opacity hover:bg-black/80"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardShell>

          {/* Follow-up */}
          {/* <CardShell>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-surface text-brand-primary">
                  <ShieldCheck size={17} />
                </div>
                <div>
                  <p className="text-[13.5px] font-bold text-[#1a2e1a]">GreenKitchen Concierge Follow-up</p>
                  <p className="mt-0.5 max-w-[380px] text-[12px] leading-relaxed text-[#9aa89f]">
                    Want our culinary care team to review this and connect with you directly?
                  </p>
                </div>
              </div>
              <Toggle checked={followUp} onChange={setFollowUp} />
            </div>

            {followUp && (
              <div className="mt-4 flex flex-wrap gap-4 border-t border-[#f2f7f4] pt-4">
                <label className="flex cursor-pointer items-center gap-2 text-[12.5px] font-medium text-[#5b6b62]">
                  <input
                    type="checkbox"
                    checked={channels.email}
                    onChange={(e) => setChannels((c) => ({ ...c, email: e.target.checked }))}
                    className="h-4 w-4 cursor-pointer rounded accent-brand-primary"
                  />
                  <Mail size={14} className="text-[#9aa89f]" />
                  Email {profile.email && <span className="text-[#b7c2ba]">({profile.email})</span>}
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-[12.5px] font-medium text-[#5b6b62]">
                  <input
                    type="checkbox"
                    checked={channels.whatsapp}
                    onChange={(e) => setChannels((c) => ({ ...c, whatsapp: e.target.checked }))}
                    className="h-4 w-4 cursor-pointer rounded accent-brand-primary"
                  />
                  <Phone size={14} className="text-[#9aa89f]" />
                  WhatsApp notification
                </label>
              </div>
            )}
          </CardShell> */}

          {error && (
            <p className="text-[12.5px] font-medium text-red-400">{error}</p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-primary
                       text-[14px] font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "Sending…" : "Submit feedback"}
          </button>
        </div>

        {/* Sidebar ------------------------------------------------------ */}
        <div className="space-y-5">
          <CardShell title="Why your voice matters" subtitle="Our ecosystem">
            <p className="text-[12.5px] leading-relaxed text-[#9aa89f]">
              Every crop cycle, dining kit, and packaging choice is voted on by our community — real
              customer voice pushes farm-to-table dining forward.
            </p>

            <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#f4f7f5] p-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-brand-primary text-[12px] font-black text-brand-primary">
                A+
              </div>
              <div>
                <p className="text-[19px] font-bold leading-none text-[#1a2e1a]">98.4%</p>
                <p className="mt-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-[#9aa89f]">
                  Community satisfaction
                </p>
              </div>
              <span className="ml-auto flex items-center gap-1 text-[11px] font-bold text-brand-primary">
                <TrendingUp size={12} /> +4.2%
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#fdf8ec] px-3.5 py-2.5">
              <Coins size={14} className="shrink-0 text-[#c08a2e]" />
              <p className="text-[11.5px] font-semibold text-[#8a611f]">
                50 Vitality Tokens will be credited on submit
              </p>
            </div>
          </CardShell>

          <CardShell
            title="Recent community fixes"
            trailing={
              <span className="flex items-center gap-1 rounded-full bg-brand-surface px-2 py-0.5 text-[10px] font-bold text-brand-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" /> Live log
              </span>
            }
          >
            <ul className="space-y-4">
              {[
                { month: "October 2024", title: "Courier cold-chain monitoring", note: "Digital thermal sensors across all regional couriers keep meals below 4°C." },
                { month: "September 2024", title: "100% bagasse containers", note: "Every clamshell is now compostable, sugarcane-fiber packaging." },
                { month: "August 2024", title: "Sodium & allergen transparency", note: "Real-time micronutrient breakdown added to every order receipt." },
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <div className="flex flex-col items-center pt-1">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-brand-primary" />
                    {i < 2 && <span className="mt-1 w-px flex-1 bg-[#eef5f0]" />}
                  </div>
                  <div className="pb-1">
                    <p className="text-[10.5px] font-bold uppercase tracking-wide text-[#b7c2ba]">{item.month}</p>
                    <p className="text-[13px] font-bold text-[#1a2e1a]">{item.title}</p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-[#9aa89f]">{item.note}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center gap-3 rounded-xl bg-gradient-to-br from-brand-surface to-[#eaf3ec] p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand-primary">
                <Leaf size={16} />
              </div>
              <p className="text-[11.5px] font-semibold leading-snug text-[#5b6b62]">
                Pioneering the future of sustainable dining, one fix at a time.
              </p>
            </div>
          </CardShell>
        </div>
      </div>
    </div>
  );
}