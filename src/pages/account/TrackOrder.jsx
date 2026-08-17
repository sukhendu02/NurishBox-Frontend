import React, { useState, useEffect, useRef } from "react";
import {
  Package,
  ClipboardCheck,
  ChefHat,
  Bike,
  PartyPopper,
  Check,
  MessageCircle,
  Phone,
  MapPin,
  Star,
  Clock,
  Salad,
  CupSoda,
  ArrowRight,
} from "lucide-react";

// ---- brand palette (applied via inline style so it works with zero build step) ----
const C = {
  primary: "#0D9E7E",
  dark: "#0A7560",
  deeper: "#065443",
  light: "#5ECBA8",
  tint: "#B2E8D6",
  surface: "#E8F8F3",
  energy: "#E8A020",
  text: "#033428",
};

const STATUSES = [
  { key: "placed", label: "Placed", icon: Package, quote: "Order received — we're getting things ready.", time: "12:15 PM" },
  { key: "confirmed", label: "Confirmed", icon: ClipboardCheck, quote: "Restaurant confirmed your order.", time: "12:18 PM" },
  { key: "preparing", label: "Preparing", icon: ChefHat, quote: "Chef Isabella is assembling your Organic Harvest Bowl.", time: "In progress" },
  { key: "on_the_way", label: "On the Way", icon: Bike, quote: "Marcus has picked up your order and is heading over.", time: "Est. 10 min" },
  { key: "delivered", label: "Delivered", icon: PartyPopper, quote: "Delivered — enjoy every bite.", time: "Arrived" },
];

const ORDER = {
  id: "GK-88291",
  placedAt: "Today, 12:15 PM",
  eta: "12:45 PM",
  items: [
    { name: "Organic Harvest Bowl", note: "Custom · Extra Avocado", price: 14.5, Icon: Salad },
    { name: "Green Vitality Juice", note: "Small · 12oz", price: 7.25, Icon: CupSoda },
  ],
  subtotal: 21.75,
  deliveryFee: 2.99,
  serviceFee: 1.5,
  total: 26.24,
  address: { label: "Home", line1: "124 Oakwood Terrace, Apt 4B", line2: "Portland, OR 97201" },
  courier: { name: "Marcus Chen", meta: "Top Rated · 542 Deliveries", initials: "MC" },
};

/* ---------------- Hero ---------------- */

function HeroScene({ statusKey }) {
  const Icon = STATUSES.find((s) => s.key === statusKey)?.icon ?? Package;
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        // background: `linear-gradient(150deg, ${C.dark} 0%, ${C.deeper} 65%, #04352a 100%)`,
      }}
    >
      {/* soft ambient blobs */}
      <div
        className="absolute h-72 w-72 rounded-full blur-3xl opacity-30"
        style={{ backgroundColor: C.primary, top: "-15%", left: "-10%" }}
      />
      <div
        className="absolute h-80 w-80 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: C.light, bottom: "-20%", right: "-10%" }}
      />
      <div
        className="absolute h-56 w-56 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: C.energy, top: "10%", right: "12%" }}
      />

      {/* fine dot texture for depth */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          key={statusKey}
          className="relative flex h-24 w-24 items-center justify-center rounded-full backdrop-blur-md sm:h-28 sm:w-28"
          style={{
            backgroundColor: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.25)",
            animation: "heroPop 0.55s cubic-bezier(0.34,1.56,0.64,1), heroFloat 3.6s ease-in-out 0.55s infinite",
          }}
        >
          <Icon className="h-11 w-11 sm:h-12 sm:w-12" color="white" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  return (
    <div
      key={status.key}
      className="inline-flex max-w-full items-start gap-3 rounded-2xl px-4 py-3 backdrop-blur-md sm:px-5"
      style={{
        backgroundColor: "rgba(255,255,255,0.92)",
        boxShadow: "0 10px 30px rgba(3,52,40,0.18)",
        animation: "pillIn 0.45s ease-out",
      }}
    >
      <span className="relative mt-1.5 flex h-2 w-2 shrink-0">
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
          style={{ backgroundColor: C.primary }}
        />
        <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: C.primary }} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: C.primary }}>
          {status.label}
        </p>
        <p className="mt-0.5 text-sm leading-snug" style={{ color: C.text }}>
          {status.quote}
        </p>
      </div>
    </div>
  );
}

/* ---------------- Progress ---------------- */

function ProgressStepper({ currentIndex }) {
  const [justChanged, setJustChanged] = useState(false);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setJustChanged(true);
    const t = setTimeout(() => setJustChanged(false), 650);
    return () => clearTimeout(t);
  }, [currentIndex]);

  const fillPercent = (currentIndex / (STATUSES.length - 1)) * 100;

  return (
    <div className="w-full">
      <div className="relative flex items-start">
        <div className="absolute left-0 right-0 top-4 h-0.5 -translate-y-1/2 rounded-full" style={{ backgroundColor: "#EEF2F0" }} />
        <div
          className="absolute left-0 top-4 h-0.5 -translate-y-1/2 rounded-full transition-all duration-700 ease-out"
          style={{ backgroundColor: C.primary, width: `${fillPercent}%` }}
        />

        {STATUSES.map((s, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          const Icon = s.icon;
          return (
            <div key={s.key} className="relative z-10 flex flex-1 flex-col items-center gap-2.5">
              <div
                className="relative flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-500"
                style={{
                  backgroundColor: done || active ? C.dark : "#FFFFFF",
                  border: `1.5px solid ${done || active ? C.dark : "#E2E8E5"}`,
                  transform: active && justChanged ? "scale(1.18)" : "scale(1)",
                }}
              >
                {active && (
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-40"
                    style={{ backgroundColor: C.primary }}
                  />
                )}
                {done ? (
                  <Check className="h-3.5 w-3.5" color="white" strokeWidth={3} />
                ) : active ? (
                  <Icon className="h-3.5 w-3.5" color="white" strokeWidth={2.25} />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#CBD5D1" }} />
                )}
              </div>
              <div className="text-center">
                <p className="text-xs font-medium leading-tight" style={{ color: done || active ? C.text : "#A3ADA9" }}>
                  {s.label}
                </p>
                <p className="mt-0.5 text-xs" style={{ color: "#A3ADA9" }}>
                  {active ? "Current" : done ? s.time : ""}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Layout helpers ---------------- */

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl bg-white p-6 sm:p-7 ${className}`}
      style={{ border: "1px solid #EEF2F0", boxShadow: "0 1px 2px rgba(3,52,40,0.04), 0 8px 24px rgba(3,52,40,0.04)" }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide" style={{ color: "#7C8B85" }}>
      {children}
    </h2>
  );
}

/* ---------------- Root ---------------- */

export default function TrackOrder() {
  const [currentIndex, setCurrentIndex] = useState(2); // start at "Preparing"
  const status = STATUSES[currentIndex];
  const canAdvance = currentIndex < STATUSES.length - 1;

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#F7F8F7" }}>
      <style>{`
        @keyframes heroPop {
          0% { transform: scale(0.55); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes pillIn {
          0% { transform: translateY(-8px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: C.primary }}>
              Live Tracking
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl" style={{ color: C.text }}>
              Track Order
            </h1>
            <p className="mt-1.5 text-sm" style={{ color: "#7C8B85" }}>
              Order #{ORDER.id} · {ORDER.placedAt}
            </p>
          </div>

          {/* demo control to preview the status-change animation */}
          <button
            onClick={() => canAdvance && setCurrentIndex((i) => i + 1)}
            disabled={!canAdvance}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            style={{ backgroundColor: C.text }}
          >
            {canAdvance ? "Simulate next update" : "Delivered"}
            {canAdvance && <ArrowRight className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* main grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT column */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* hero */}
            <div className="relative h-80 overflow-hidden rounded-3xl sm:h-96" style={{ boxShadow: "0 20px 40px rgba(3,52,40,0.18)" }}>
              <HeroScene statusKey={status.key} />

              <div className="absolute inset-x-4 top-4 sm:inset-x-6 sm:top-6">
                <StatusPill status={status} />
              </div>

              <div className="absolute inset-x-4 bottom-5 sm:inset-x-6 sm:bottom-7">
                <p className="text-xs font-medium uppercase tracking-widest text-white/60">Estimated arrival</p>
                <div className="mt-1 flex items-center gap-2.5">
                  <Clock className="h-6 w-6 text-white/80" strokeWidth={1.75} />
                  <span className="text-4xl font-light tracking-tight text-white sm:text-5xl">{ORDER.eta}</span>
                </div>
              </div>
            </div>

            {/* progress */}
            <Card>
              <SectionLabel>Order Status</SectionLabel>
              <ProgressStepper currentIndex={currentIndex} />
            </Card>

            {/* courier */}
            <Card className="flex flex-wrap items-center justify-between gap-5">
              <div className="flex items-center gap-3.5">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: C.dark, boxShadow: `0 0 0 3px ${C.surface}` }}
                >
                  {ORDER.courier.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: C.text }}>
                    {ORDER.courier.name}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs" style={{ color: "#7C8B85" }}>
                    <Star className="h-3 w-3" style={{ color: C.energy }} fill={C.energy} />
                    {ORDER.courier.meta}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-colors"
                  style={{ color: C.text, border: "1px solid #E2E8E5" }}
                >
                  <MessageCircle className="h-4 w-4" />
                  Message
                </button>
                <button
                  className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-white"
                  style={{ backgroundColor: C.dark }}
                >
                  <Phone className="h-4 w-4" />
                  Call
                </button>
              </div>
            </Card>
          </div>

          {/* RIGHT column */}
          <div className="flex flex-col gap-6">
            {/* order summary */}
            <Card>
              <SectionLabel>Order Summary</SectionLabel>
              <div className="flex flex-col gap-4">
                {ORDER.items.map(({ name, note, price, Icon }) => (
                  <div key={name} className="flex items-center gap-3.5">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: C.surface }}
                    >
                      <Icon className="h-5 w-5" style={{ color: C.dark }} strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium" style={{ color: C.text }}>
                        {name}
                      </p>
                      <p className="truncate text-xs" style={{ color: "#A3ADA9" }}>
                        {note}
                      </p>
                    </div>
                    <p className="text-sm font-semibold" style={{ color: C.text }}>
                      ${price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-2.5 pt-5" style={{ borderTop: "1px solid #EEF2F0" }}>
                <div className="flex justify-between text-sm" style={{ color: "#7C8B85" }}>
                  <span>Subtotal</span>
                  <span>${ORDER.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm" style={{ color: "#7C8B85" }}>
                  <span>Delivery Fee</span>
                  <span>${ORDER.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm" style={{ color: "#7C8B85" }}>
                  <span>Service Fee</span>
                  <span>${ORDER.serviceFee.toFixed(2)}</span>
                </div>
                <div
                  className="mt-2 flex items-center justify-between pt-4 text-base font-semibold"
                  style={{ borderTop: "1px solid #EEF2F0", color: C.text }}
                >
                  <span>Total</span>
                  <span style={{ color: C.primary }}>${ORDER.total.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {/* delivery to (no map) */}
            <Card>
              <SectionLabel>Delivery To</SectionLabel>
              <div className="flex items-start gap-3.5">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: C.surface }}
                >
                  <MapPin className="h-4.5 w-4.5" style={{ color: C.dark }} strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: C.text }}>
                    {ORDER.address.label}
                  </p>
                  <p className="mt-0.5 text-sm" style={{ color: "#7C8B85" }}>
                    {ORDER.address.line1}
                  </p>
                  <p className="text-sm" style={{ color: "#7C8B85" }}>
                    {ORDER.address.line2}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}