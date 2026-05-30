import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import {
  Icon,
  SIDEBAR_MENU,
  Sk,
  WalletCardSkeleton,
  PointsCardSkeleton,
  AccountHubSkeleton,
  PreferencesSkeleton,
} from "./AccountShell";
import AccountProfile from "./account/AccountProfile";

// ─── PROFILE HEADER ───────────────────────────────────────────────────────────
function ProfileHeader({ profile }) {
  const avatarUrl = profile?.avatarUrl || profile?.photoUrl || null;
  const name      = profile?.name      ?? "—";
  const email     = profile?.email     ?? "";
  const phone     = profile?.phone     ?? "";
    const joined  = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
        month: "long", year: "numeric",
      })
    : null;

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-[#E8F8F3] border-4 border-white shadow-lg flex items-center justify-center">
            <span className="text-[32px] font-black text-[#0D9E7E]">{name[0]?.toUpperCase() ?? "?"}</span>
          </div>
        )}
        <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#0D9E7E] flex items-center justify-center border-2 border-white shadow">
          <span className="w-3 h-3 text-white">{Icon.edit}</span>
        </div>
      </div>
      <div>
        <p className="font-extrabold text-[22px] text-[#033428] leading-tight">{name}</p>
        <p className="text-[13px] text-[#888] mt-0.5 flex items-center gap-1">
          {email || (phone ? `+91-${phone}` : "")}
          {phone && <BadgeCheck size={14} className="text-[#0A7560]" />}
        </p>
        {joined && (
          <p className="text-[11px] text-[#bbb] mt-1">Member since {joined}</p>
        )}

      </div>
    </div>
  );
}

// ─── PROFILE HEADER SKELETON ─────────────────────────────────────────────────
function ProfileHeaderSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Sk className="w-20 h-20 rounded-full flex-shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <Sk className="h-5 w-36" />
        <Sk className="h-3 w-44" />
        <Sk className="h-5 w-28 rounded-full" />
      </div>
    </div>
  );
}

// ─── WALLET CARD ─────────────────────────────────────────────────────────────

function WalletCard({ balance = 0 }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden p-5 text-white"
      style={{ background: "linear-gradient(135deg, #0D9E7E 0%, #065443 100%)" }}
    >
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10 border-[32px] border-white" />
      <div className="absolute -bottom-10 -left-6 w-32 h-32 rounded-full opacity-10 border-[20px] border-white" />
      <div className="relative flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          <span className="w-5 h-5 text-white">{Icon.wallet}</span>
        </div>
        <span className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase">Wallet Balance</span>
      </div>
      <div className="relative">
        <p className="text-[38px] font-black tracking-tight leading-none mb-3">₹{balance.toFixed(2)}</p>
        <button className="text-[13px] font-bold underline underline-offset-2 text-[#B2E8D6] hover:text-white transition-colors">
          Top Up Funds
        </button>
      </div>
    </div>
  );
}

// ─── POINTS CARD ─────────────────────────────────────────────────────────────
function PointsCard({ points = 0, tier = "Silver" }) {
  const tiers  = ["Silver", "Gold", "Platinum", "Diamond"];
  const idx    = tiers.indexOf(tier);
  const next   = tiers[idx + 1] ?? null;
  const pct    = Math.min(100, Math.max(8, (points % 1000) / 10));

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
      <p className="text-[38px] font-black text-[#033428] leading-none">{points.toLocaleString()}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-[12px] text-[#666]">{tier} Status Tier</span>
        <div className="flex-1 h-1.5 bg-[#E8F8F3] rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg,#E8A020,#f0c050)" }} />
        </div>
        {next && <span className="text-[11px] font-semibold text-[#E8A020]">{next} →</span>}
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
     
      {/* Field rows */}
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-2xl border border-[#eef5f0] p-5 flex items-center gap-4">
          <Sk className="w-9 h-9 rounded-xl flex-shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <Sk className="h-3 w-16 rounded-full" />
            <Sk className="h-4 w-40 rounded-full" />
          </div>
          <Sk className="w-7 h-7 rounded-lg flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}

// ─── ACCOUNT HUB GRID ────────────────────────────────────────────────────────
function AccountHub() {
  const tiles = [
    { path: "/account/my-coupons",      label: "My Coupons",    icon: Icon.coupon,  iconColor: "#0D9E7E" },
    { path: "/account/gift-cards",      label: "Gift Cards",    icon: Icon.gift,    iconColor: "#0D9E7E" },
    { path: "/account/orders",          label: "Recent Orders", icon: Icon.receipt, iconColor: "#0D9E7E" },
    { path: "/account/favourites",      label: "Favourites",    icon: Icon.heart,   iconColor: "#065443" },
  ];

  return (
    <div>
      <p className="text-[18px] font-extrabold text-[#033428] mb-3">Account Hub</p>
      <div className="grid grid-cols-2 gap-3">
        {tiles.map(t => (
          <Link
            key={t.path}
            to={t.path}
            className="flex flex-col items-start gap-3 p-4 rounded-2xl bg-white border border-[#eef5f0] hover:border-[#0D9E7E] hover:shadow-md transition-all active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E8F8F3] flex items-center justify-center">
              <span className="w-5 h-5" style={{ color: t.iconColor }}>{t.icon}</span>
            </div>
            <span className="text-[13px] font-bold text-[#033428]">{t.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── PREFERENCES LIST ────────────────────────────────────────────────────────
function Preferences() {
  const items = [
    { path: "/account/manage-address", label: "Delivery Addresses", icon: Icon.pin      },
    { path: "/account/settings",       label: "Settings",           icon: Icon.settings },
    { path: "/account/feedback",       label: "Feedback",           icon: Icon.chat     },
  ];

  return (
    <div>
      <p className="text-[18px] font-extrabold text-[#033428] mb-3">Preferences</p>
      <div className="flex flex-col gap-2">
        {items.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 border border-[#eef5f0] hover:border-[#0D9E7E] hover:shadow-sm transition-all active:scale-[.98]"
          >
            <div className="w-9 h-9 rounded-xl bg-[#f0f5f2] flex items-center justify-center flex-shrink-0">
              <span className="w-4 h-4 text-[#555]">{item.icon}</span>
            </div>
            <span className="flex-1 text-[14px] font-semibold text-[#1a2e1a]">{item.label}</span>
            <span className="w-4 h-4 text-[#ccc]">{Icon.chevron}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function AccountOverview() {
  const { profile, isLoadingProfile, onLogout } = useOutletContext();

  const walletBalance = profile?.walletBalance ?? 0;
  const points        = profile?.points        ?? 0;
  const tier          = profile?.tier          ?? "Silver";

  if (isLoadingProfile) {
    return (
      <div className="space-y-4">
        {/* mobile: profile card on top */}
        <div className="bg-white rounded-2xl p-4 border border-[#eef5f0] lg:hidden">
          <ProfileHeaderSkeleton />
        </div>
        <WalletCardSkeleton />
        <PointsCardSkeleton />
        <ProfileSkeleton/>
        <AccountHubSkeleton />
        <PreferencesSkeleton />
        <Sk className="h-12 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* mobile: profile card at top */}
      <div className="bg-white rounded-2xl p-4 border border-[#eef5f0] lg:hidden">
        <ProfileHeader profile={profile} />
      </div>

      <WalletCard balance={walletBalance} />
      <PointsCard points={points} tier={tier} />
      <AccountProfile/>
      <AccountHub />
      <Preferences />

      {/* Logout — mobile only (desktop has it in sidebar) */}
      <button
        onClick={onLogout}
        className="w-full lg:hidden flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#fff0f0] border border-[#ffd5d5] text-red-500 font-bold text-[15px] hover:bg-[#ffe0e0] transition-colors"
      >
        <span className="w-5 h-5">{Icon.logout}</span>
        Logout
      </button>
    </div>
  );
}