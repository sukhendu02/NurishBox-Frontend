import { useState, useEffect } from "react";
import { CircleCheck } from "lucide-react";
// ─── ICONS (inline SVG) ────────────────────────────────────────────────────────
const Icon = {
  menu:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6"  x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  kitchen: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 3h18v4H3z"/><path d="M3 10h7v11H3z"/><path d="M14 10h7v4h-7z"/><path d="M14 17h7v4h-7z"/></svg>,
  explore: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  wallet:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 12h.01"/></svg>,
  orders:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>,
  profile: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  star:    <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  coupon:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="7" width="20" height="10" rx="1"/><path d="M16 7v10M8 7v10M12 11h.01"/></svg>,
  gift:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="8" width="18" height="13" rx="1"/><path d="M12 8v13M19 8V6a3 3 0 00-6 0v2M5 8V6a3 3 0 016 0v2"/></svg>,
  receipt: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16l3-2 3 2 3-2 3 2 3-2V8z"/><path d="M10 9h4M10 13h4"/></svg>,
  heart:   <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  pin:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  settings:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  chat:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  logout:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  chevron: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
  edit:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  verify:  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>,
};

const NAV_ITEMS = [
  { id: "kitchen",  label: "Kitchen",  icon: Icon.kitchen },
  { id: "explore",  label: "Explore",  icon: Icon.explore  },
  { id: "wallet",   label: "Wallet",   icon: Icon.wallet   },
  { id: "orders",   label: "Orders",   icon: Icon.orders   },
  { id: "profile",  label: "Profile",  icon: Icon.profile  },
];

const SIDEBAR_MENU = [
  { id: "overview",   label: "Overview",           icon: Icon.profile  },
  { id: "wallet",     label: "Wallet",             icon: Icon.wallet   },
  { id: "coupons",    label: "My Coupons",         icon: Icon.coupon   },
  { id: "gifts",      label: "Gift Cards",         icon: Icon.gift     },
  { id: "orders",     label: "Recent Orders",      icon: Icon.receipt  },
  { id: "favorites",  label: "Favourites",         icon: Icon.heart    },
  { id: "addresses",  label: "Delivery Addresses", icon: Icon.pin      },
  { id: "settings",   label: "Settings",           icon: Icon.settings },
  { id: "feedback",   label: "Feedback",           icon: Icon.chat     },
];

// ─── SHIMMER STYLE (injected once) ───────────────────────────────────────────
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

// ─── SKELETON BASE ────────────────────────────────────────────────────────────
function Sk({ className = "" }) {
  return <div className={`sk ${className}`} />;
}

// ─── PROFILE HEADER SKELETON ─────────────────────────────────────────────────
function ProfileHeaderSkeleton({ compact = false }) {
  return (
    <div className="flex items-center gap-4">
      <Sk className={`rounded-full flex-shrink-0 ${compact ? "w-14 h-14" : "w-20 h-20"}`} />
      <div className="flex flex-col gap-2 flex-1">
        <Sk className={`${compact ? "h-4 w-28" : "h-5 w-36"}`} />
        <Sk className="h-3 w-44" />
        <Sk className="h-5 w-28 rounded-full" />
      </div>
    </div>
  );
}

// ─── WALLET CARD SKELETON ─────────────────────────────────────────────────────
function WalletCardSkeleton() {
  return (
    <div className="relative rounded-2xl overflow-hidden p-5 h-[148px]"
      style={{ background: "linear-gradient(135deg,#c2e8da 0%,#a8d5c4 100%)" }}>
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10 border-[32px] border-white" />
      <div className="absolute -bottom-10 -left-6 w-32 h-32 rounded-full opacity-10 border-[20px] border-white" />
      <div className="relative flex items-start justify-between mb-6">
        <Sk className="w-10 h-10 rounded-xl opacity-50" />
        <Sk className="h-3 w-28 rounded-full opacity-40" />
      </div>
      <Sk className="h-9 w-36 rounded-xl opacity-50 mb-3" />
      <Sk className="h-3 w-24 rounded-full opacity-40" />
    </div>
  );
}

// ─── POINTS CARD SKELETON ─────────────────────────────────────────────────────
function PointsCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-[#e8f0ec] p-5">
      <div className="flex items-start justify-between mb-4">
        <Sk className="w-10 h-10 rounded-full" />
        <Sk className="h-3 w-14 rounded-full" />
      </div>
      <Sk className="h-9 w-28 rounded-xl mb-3" />
      <div className="flex items-center gap-2">
        <Sk className="h-3 w-20 rounded-full" />
        <Sk className="flex-1 h-1.5 rounded-full" />
        <Sk className="h-3 w-16 rounded-full" />
      </div>
    </div>
  );
}

// ─── ACCOUNT HUB SKELETON ────────────────────────────────────────────────────
function AccountHubSkeleton() {
  return (
    <div>
      <Sk className="h-5 w-36 mb-4" />
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="flex flex-col gap-3 p-4 rounded-2xl bg-white border border-[#eef5f0]">
            <Sk className="w-10 h-10 rounded-xl" />
            <Sk className="h-3.5 w-24 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PREFERENCES SKELETON ────────────────────────────────────────────────────
function PreferencesSkeleton() {
  return (
    <div>
      <Sk className="h-5 w-28 mb-4" />
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map(i => (
          <div key={i} className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 border border-[#eef5f0]">
            <Sk className="w-9 h-9 rounded-xl flex-shrink-0" />
            <Sk className="flex-1 h-3.5 rounded-full" />
            <Sk className="w-4 h-4 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SIDEBAR SKELETON (desktop) ───────────────────────────────────────────────
function SidebarSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#eef5f0] overflow-hidden">
      {/* mini profile */}
      <div className="p-5 border-b border-[#f0f5f2] flex items-center gap-3">
        <Sk className="w-12 h-12 rounded-full flex-shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <Sk className="h-3.5 w-24 rounded-full" />
          <Sk className="h-3 w-16 rounded-full" />
        </div>
      </div>
      {/* menu rows */}
      <div className="p-2 flex flex-col gap-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
            <Sk className="w-4 h-4 rounded flex-shrink-0" />
            <Sk className="flex-1 h-3 rounded-full" style={{ width: `${55 + (i % 3) * 15}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FULL PAGE SKELETON (mobile content) ─────────────────────────────────────
function MobilePageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 border border-[#eef5f0]">
        <ProfileHeaderSkeleton />
      </div>
      <WalletCardSkeleton />
      <PointsCardSkeleton />
      <AccountHubSkeleton />
      <PreferencesSkeleton />
      <Sk className="h-12 w-full rounded-2xl" />
    </div>
  );
}

// ─── WALLET CARD ──────────────────────────────────────────────────────────────
function WalletCard() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden p-5 text-white"
      style={{ background: "linear-gradient(135deg, #0D9E7E 0%, #065443 100%)" }}
    >
      {/* subtle texture rings */}
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10 border-[32px] border-white" />
      <div className="absolute -bottom-10 -left-6 w-32 h-32 rounded-full opacity-10 border-[20px] border-white" />

      <div className="relative flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          <span className="w-5 h-5 text-white">{Icon.wallet}</span>
        </div>
        <span className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase">Wallet Balance</span>
      </div>
      <div className="relative">
        <p className="text-[38px] font-black tracking-tight leading-none mb-3">₹124.50</p>
        <button className="text-[13px] font-bold underline underline-offset-2 text-[#B2E8D6] hover:text-white transition-colors">
          Top Up Funds
        </button>
      </div>
    </div>
  );
}

// ─── POINTS CARD ──────────────────────────────────────────────────────────────
function PointsCard() {
  return (
    <div className="rounded-2xl bg-white border border-[#e8f0ec] p-5">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
          style={{ background: "linear-gradient(135deg,#E8A020,#f0c050)" }}
        >
          <span className="w-4 h-4 text-white">{Icon.star}</span>
        </div>
        <span className="text-[10px] font-black tracking-[0.2em] text-[#aaa] uppercase">Points</span>
      </div>
      <p className="text-[38px] font-black text-[#033428] leading-none">2,480</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-[12px] text-[#666]">Gold Status Tier</span>
        <div className="flex-1 h-1.5 bg-[#E8F8F3] rounded-full overflow-hidden">
          <div className="h-full w-[68%] rounded-full" style={{ background: "linear-gradient(90deg,#E8A020,#f0c050)" }} />
        </div>
        <span className="text-[11px] font-semibold text-[#E8A020]">Platinum →</span>
      </div>
    </div>
  );
}

// ─── ACCOUNT HUB GRID ─────────────────────────────────────────────────────────
function AccountHub({ onNav }) {
  const tiles = [
    { id: "coupons",   label: "My Coupons",    icon: Icon.coupon,  color: "#E8F8F3", iconColor: "#0D9E7E" },
    { id: "gifts",     label: "Gift Cards",    icon: Icon.gift,    color: "#E8F8F3", iconColor: "#0D9E7E" },
    { id: "orders",    label: "Recent Orders", icon: Icon.receipt, color: "#E8F8F3", iconColor: "#0D9E7E" },
    { id: "favorites", label: "Favourites",    icon: Icon.heart,   color: "#E8F8F3", iconColor: "#065443" },
  ];

  return (
    <div>
      <p className="text-[18px] font-extrabold text-[#033428] mb-3">Account Hub</p>
      <div className="grid grid-cols-2 gap-3">
        {tiles.map(t => (
          <button
            key={t.id}
            onClick={() => onNav(t.id)}
            className="flex flex-col items-start gap-3 p-4 rounded-2xl bg-white border border-[#eef5f0] hover:border-[#0D9E7E] hover:shadow-md transition-all active:scale-95 text-left"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: t.color }}>
              <span className="w-5 h-5" style={{ color: t.iconColor }}>{t.icon}</span>
            </div>
            <span className="text-[13px] font-bold text-[#033428]">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── PREFERENCES LIST ─────────────────────────────────────────────────────────
function Preferences({ onNav }) {
  const items = [
    { id: "addresses", label: "Delivery Addresses", icon: Icon.pin      },
    { id: "settings",  label: "Settings",           icon: Icon.settings },
    { id: "feedback",  label: "Feedback",           icon: Icon.chat     },
  ];

  return (
    <div>
      <p className="text-[18px] font-extrabold text-[#033428] mb-3">Preferences</p>
      <div className="flex flex-col gap-2">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 border border-[#eef5f0] hover:border-[#0D9E7E] hover:shadow-sm transition-all active:scale-[.98] text-left w-full"
          >
            <div className="w-9 h-9 rounded-xl bg-[#f0f5f2] flex items-center justify-center flex-shrink-0">
              <span className="w-4 h-4 text-[#555]">{item.icon}</span>
            </div>
            <span className="flex-1 text-[14px] font-semibold text-[#1a2e1a]">{item.label}</span>
            <span className="w-4 h-4 text-[#ccc]">{Icon.chevron}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── PROFILE HEADER ───────────────────────────────────────────────────────────
function ProfileHeader({ compact = false }) {
  return (
    <div className={`flex items-center gap-4 ${compact ? "" : "mb-0"}`}>
      <div className="relative flex-shrink-0">
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
          alt="Alex Rivers"
          className={`rounded-full object-cover border-4 border-white shadow-lg ${compact ? "w-14 h-14" : "w-20 h-20"}`}
        />
        <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#0D9E7E] flex items-center justify-center border-2 border-white shadow">
          <span className="w-3 h-3 text-white">{Icon.edit}</span>
        </div>
      </div>
      <div>
        <p className={`font-extrabold text-[#033428] leading-tight ${compact ? "text-[16px]" : "text-[22px]"}`}>Alex Rivers</p>
        <p className={`text-[#888] mt-0.5 ${compact ? "text-[12px]" : "text-[13px]"}`}>alex.rivers@email.com</p>
        <div className="mt-1.5 inline-flex items-center gap-1 bg-[#E8F8F3] border border-[#B2E8D6] rounded-full px-2.5 py-0.5">
          <span className="w-3 h-3 text-[#0D9E7E]">{Icon.verify}</span>
          <span className="text-[10px] font-black tracking-wider text-[#0A7560] uppercase">Premium Member</span>
        </div>
      </div>
    </div>
  );
}

// ─── CONTENT PANEL (right side on desktop) ────────────────────────────────────
function ContentPanel({ activeSection }) {
  const labels = {
    overview:   "Overview",
    wallet:     "Wallet",
    coupons:    "My Coupons",
    gifts:      "Gift Cards",
    orders:     "Recent Orders",
    favorites:  "Favourites",
    addresses:  "Delivery Addresses",
    settings:   "Settings",
    feedback:   "Feedback",
  };

  if (activeSection === "overview") {
    return (
      <div className="space-y-5">
        <WalletCard />
        <PointsCard />
        <AccountHub onNav={() => {}} />
        <Preferences onNav={() => {}} />
        <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#fff0f0] border border-[#ffd5d5] text-red-500 font-bold text-[15px] hover:bg-[#ffe0e0] transition-colors">
          <span className="w-5 h-5">{Icon.logout}</span>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#eef5f0] p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#E8F8F3] flex items-center justify-center mb-4">
        <span className="w-7 h-7 text-[#0D9E7E]">
          {SIDEBAR_MENU.find(m => m.id === activeSection)?.icon}
        </span>
      </div>
      <p className="text-[20px] font-extrabold text-[#033428] mb-1">{labels[activeSection]}</p>
      <p className="text-[14px] text-[#999]">Content for {labels[activeSection]} goes here.</p>
    </div>
  );
}

// ─── MOBILE LAYOUT ────────────────────────────────────────────────────────────
function MobileLayout() {
  const [activeNav, setActiveNav] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate a data fetch — replace with real useEffect + store call
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#f2f6f3] flex flex-col">
      <style>{SHIMMER_CSS}</style>

    

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto px-4 pb-28 space-y-4 pt-2">
        {isLoading ? (
          <MobilePageSkeleton />
        ) : (
          <>
            {/* Profile */}
            <div className="bg-white rounded-2xl p-4 border border-[#eef5f0]">
              <ProfileHeader />
            </div>
            <WalletCard />
            <PointsCard />
            <AccountHub onNav={() => {}} />
            <Preferences onNav={() => {}} />
            {/* Logout */}
            <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#fff0f0] border border-[#ffd5d5] text-red-500 font-bold text-[15px] hover:bg-[#ffe0e0] transition-colors">
              <span className="w-5 h-5">{Icon.logout}</span>
              Logout
            </button>
          </>
        )}
      </main>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#e8f0ec] px-2 py-2 flex items-end justify-around z-50">
        {NAV_ITEMS.map(item => {
          const active = item.id === activeNav;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className="flex flex-col items-center gap-0.5 relative"
            >
              {active && item.id === "profile" ? (
                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg,#0D9E7E,#065443)" }}>
                  <span className="w-5 h-5 text-white">{item.icon}</span>
                </div>
              ) : (
                <>
                  <span className={`w-5 h-5 ${active ? "text-[#0D9E7E]" : "text-[#aaa]"}`}>{item.icon}</span>
                  <span className={`text-[10px] font-semibold ${active ? "text-[#0D9E7E]" : "text-[#bbb]"}`}>{item.label.toUpperCase()}</span>
                </>
              )}
              {active && item.id !== "profile" && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#0D9E7E]" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// ─── DESKTOP LAYOUT ───────────────────────────────────────────────────────────
function DesktopLayout() {
  const [active, setActive] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate a data fetch — replace with real useEffect + store call
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFAF7] flex flex-col">
      <style>{SHIMMER_CSS}</style>

  

      <div className="flex flex-1 max-w-6xl mx-auto w-full px-6 py-8 gap-7">
        {/* LEFT sidebar */}
        <aside className="w-64 flex-shrink-0">
          <div className="sticky top-24">
            {isLoading ? (
              <SidebarSkeleton />
            ) : (
              <div className="bg-white rounded-2xl border border-[#eef5f0] ring-1 ring-black/5 overflow-hidden">
                {/* Sidebar profile mini */}
                <div className="p-5 border-b border-[#f0f5f2]">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
                      alt="Alex"
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#B2E8D6]"
                    />
                    <div>
                      <p className="font-extrabold text-[14px] text-[#033428]">Alex Rivers</p>
                      <p className="text-[12px] text-[#555] flex items-center gap-1">+91-99999999 <span>
                        <CircleCheck size={14} className="text-brand-primary" />
                        </span> 
                        </p>
                   
                      <div className="inline-flex items-center gap-1 bg-[#E8F8F3] rounded-full px-2 py-0.5 mt-0.5">
                        <span className="w-3 h-3 text-[#0D9E7E]">{Icon.verify}</span>
                        <span className="text-[9px] font-black tracking-wider text-[#0A7560] uppercase">Premium</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <nav className="p-2">
                  {SIDEBAR_MENU.map(item => {
                    const isActive = active === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-left transition-all ${
                          isActive
                            ? "bg-[#E8F8F3] text-[#0D9E7E]"
                            : "text-[#555] hover:bg-[#f5faf7] hover:text-[#0D9E7E]"
                        }`}
                      >
                        <span className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#0D9E7E]" : "text-[#aaa]"}`}>
                          {item.icon}
                        </span>
                        <span className={`text-[13px] font-semibold ${isActive ? "text-[#0D9E7E] font-bold" : ""}`}>
                          {item.label}
                        </span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0D9E7E]" />
                        )}
                      </button>
                    );
                  })}
                </nav>

                {/* Logout at bottom */}
                <div className="p-3 border-t border-[#f0f5f2]">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-[#fff5f5] transition-colors">
                    <span className="w-4 h-4">{Icon.logout}</span>
                    <span className="text-[13px] font-semibold">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT content */}
        <main className="flex-1 min-w-0">
          {isLoading ? (
            <div className="space-y-5">
              {/* title skeleton */}
              <div className="mb-5 space-y-2">
                <Sk className="h-7 w-40" />
                <Sk className="h-3.5 w-64" />
              </div>
              <WalletCardSkeleton />
              <PointsCardSkeleton />
              <AccountHubSkeleton />
              <PreferencesSkeleton />
            </div>
          ) : (
            <>
              <div className="mb-5">
                <p className="text-[26px] font-extrabold text-[#033428] tracking-tight">
                  {SIDEBAR_MENU.find(m => m.id === active)?.label ?? "Overview"}
                </p>
                <p className="text-[13px] text-[#999] mt-0.5">Manage your account and preferences</p>
              </div>
              <ContentPanel activeSection={active} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,800&display=swap" rel="stylesheet" />
      {/* Mobile */}
      <div className="lg:hidden">
        <MobileLayout />
      </div>
      {/* Desktop */}
      <div className="hidden lg:block">
        <DesktopLayout />
      </div>
    </>
  );
}