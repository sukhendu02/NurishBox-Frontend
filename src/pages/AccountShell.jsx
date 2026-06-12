import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import useAuthStore from "../store/authStore";
import useUserStore from "../store/userStore";
import { clearTokens } from "../utils/token.js"; // adjust path as needed

// ─── ICONS ────────────────────────────────────────────────────────────────────
export const Icon = {
  menu:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
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

// ─── ROUTE MAP ────────────────────────────────────────────────────────────────
export const SIDEBAR_MENU = [
  { id: "overview",   label: "Overview",           path: "/account",                  icon: Icon.profile  },
  { id: "coupons",    label: "My Coupons",          path: "/account/my-coupons",       icon: Icon.coupon   },
  { id: "gifts",      label: "Gift Cards",          path: "/account/gift-cards",       icon: Icon.gift     },
  { id: "orders",     label: "Recent Orders",       path: "/account/orders",           icon: Icon.receipt  },
  { id: "favorites",  label: "Favourites",          path: "/account/favourites",       icon: Icon.heart    },
  { id: "addresses",  label: "Delivery Addresses",  path: "/account/manage-address",   icon: Icon.pin      },
  { id: "settings",   label: "Settings",            path: "/account/settings",         icon: Icon.settings },
  { id: "feedback",   label: "Feedback",            path: "/account/feedback",         icon: Icon.chat     },
];

// export const NAV_ITEMS = [
//   { id: "kitchen",  label: "Kitchen",  path: "/",        icon: Icon.kitchen },
//   { id: "explore",  label: "Explore",  path: "/explore", icon: Icon.explore  },
//   { id: "wallet",   label: "Wallet",   path: "/wallet",  icon: Icon.wallet   },
//   { id: "orders",   label: "Orders",   path: "/orders",  icon: Icon.orders   },
//   { id: "profile",  label: "Profile",  path: "/account", icon: Icon.profile  },
// ];

// ─── SHIMMER ──────────────────────────────────────────────────────────────────
export const SHIMMER_CSS = `
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
export function Sk({ className = "" }) {
  return <div className={`sk ${className}`} />;
}

// ─── SKELETON COMPONENTS ─────────────────────────────────────────────────────
export function ProfileHeaderSkeleton({ compact = false }) {
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

export function WalletCardSkeleton() {
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

export function PointsCardSkeleton() {
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

export function AccountHubSkeleton() {
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

export function PreferencesSkeleton() {
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

export function SidebarSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#eef5f0] overflow-hidden">
      <div className="p-5 border-b border-[#f0f5f2] flex items-center gap-3">
        <Sk className="w-12 h-12 rounded-full flex-shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <Sk className="h-3.5 w-24 rounded-full" />
          <Sk className="h-3 w-16 rounded-full" />
        </div>
      </div>
      <div className="p-2 flex flex-col gap-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
            <Sk className="w-4 h-4 rounded flex-shrink-0" />
            <Sk className="h-3 rounded-full" style={{ width: `${50 + (i % 3) * 18}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function OverviewContentSkeleton() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Sk className="h-7 w-40" />
        <Sk className="h-3.5 w-64" />
      </div>
      <WalletCardSkeleton />
      <PointsCardSkeleton />
      <AccountHubSkeleton />
      <PreferencesSkeleton />
    </div>
  );
}

export function MobilePageSkeleton() {
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


// ─── SIDEBAR (shared between mobile sheet + desktop) ─────────────────────────
function SidebarContent({ profile, isLoadingProfile, onLogout }) {
  const location = useLocation();

  const avatarUrl = profile?.avatarUrl || profile?.photoUrl || null;
  const name      = profile?.name ?? "";
  const phone     = profile?.phone ?? "";
  const email     = profile?.email ?? "";
   const joined  = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
        month: "long", year: "numeric",
      })
    : null;

  return (
    <div className="bg-white rounded-2xl border border-[#eef5f0] ring-1 ring-black/5 overflow-hidden">
      {/* Profile mini */}
      <div className="p-5 border-b border-[#f0f5f2]">
        {isLoadingProfile ? (
          <div className="flex items-center gap-3">
            <Sk className="w-12 h-12 rounded-full shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <Sk className="h-3.5 w-24 rounded-full" />
              <Sk className="h-3 w-28 rounded-full" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="w-12 h-12 rounded-full object-cover border-2 border-[#B2E8D6]" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#E8F8F3] border-2 border-[#B2E8D6] flex items-center justify-center">
                <span className="text-[20px] font-black text-brand-dark">{name?.[0]?.toUpperCase() ?? "?"}</span>
              </div>
            )}
            <div>
              <p className="font-extrabold text-[14px] text-text-brand leading-tight">{name}</p>
              {phone && (
                <p className="text-[12px] text-[#555] flex items-center gap-1 mt-0.5">
                  +91-{phone}
                  <BadgeCheck size={13} className="text-brand-primary" />
                </p>
              )}
              {/* {email && (
                <p className="text-[12px] text-[#555] flex items-center gap-1 mt-0.5">
                  {email}
                  <BadgeCheck size={13} className="text-brand-primary" />
                </p>
              )} */}
              {joined && (
          <p className="text-[11px] text-[#bbb] mt-1">Member since {joined}</p>
        )}
            </div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="p-2">
        {SIDEBAR_MENU.map(item => {
          const isActive = location.pathname === item.path ||
            (item.path !== "/account" && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all ${
                isActive
                  ? "bg-[#E8F8F3] text-[#0D9E7E]"
                  : "text-[#555] hover:bg-[#f5faf7] hover:text-[#0D9E7E]"
              }`}
            >
              <span className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#0D9E7E]" : "text-[#aaa]"}`}>
                {item.icon}
              </span>
              <span className={`text-[13px] ${isActive ? "font-bold text-[#0D9E7E]" : "font-semibold"}`}>
                {item.label}
              </span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0D9E7E]" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-[#f0f5f2]">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-[#fff5f5] transition-colors"
        >
          <span className="w-4 h-4">{Icon.logout}</span>
          <span className="text-[13px] font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );
}





// ─── ACCOUNT SHELL ────────────────────────────────────────────────────────────
export default function AccountShell() {
  const navigate    = useNavigate();
  const location    = useLocation();
  const logout      = useAuthStore(s => s.clearUser);
  const { profile, isLoadingProfile, fetchProfile, fetchAddresses } = useUserStore();

  useEffect(() => {
    fetchProfile();
    fetchAddresses();
  }, [fetchProfile, fetchAddresses]);

  const handleLogout = () => {
    clearTokens();
    logout();
    navigate("/login");
  };

  // Active label for desktop breadcrumb
  const activeMenu = SIDEBAR_MENU.find(m =>
    location.pathname === m.path ||
    (m.path !== "/account" && location.pathname.startsWith(m.path))
  ) ?? SIDEBAR_MENU[0];

  const avatarUrl = profile?.avatarUrl || profile?.photoUrl || null;
  const name      = profile?.name ?? "";

  return (
    <>
      <style>{SHIMMER_CSS}</style>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,800&display=swap"
        rel="stylesheet"
      />

      {/* ── MOBILE ─────────────────────────────────────────────── */}
      <div className="lg:hidden min-h-screen bg-[#f2f6f3] flex flex-col">
        <main className="flex-1 overflow-y-auto px-4 pb-28 pt-2">
          <Outlet context={{ profile, isLoadingProfile, onLogout: handleLogout }} />
        </main>

        {/* Bottom tab bar */}
        {/* <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#e8f0ec] px-2 py-2 flex items-end justify-around z-50">
          {NAV_ITEMS.map(item => {
            const isActive = location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.id}
                to={item.path}
                className="flex flex-col items-center gap-0.5 relative"
              >
                {isActive && item.id === "profile" ? (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                    style={{ background: "linear-gradient(135deg,#0D9E7E,#065443)" }}>
                    <span className="w-5 h-5 text-white">{item.icon}</span>
                  </div>
                ) : (
                  <>
                    <span className={`w-5 h-5 ${isActive ? "text-[#0D9E7E]" : "text-[#aaa]"}`}>{item.icon}</span>
                    <span className={`text-[10px] font-semibold ${isActive ? "text-[#0D9E7E]" : "text-[#bbb]"}`}>
                      {item.label.toUpperCase()}
                    </span>
                  </>
                )}
                {isActive && item.id !== "profile" && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#0D9E7E]" />
                )}
              </Link>
            );
          })}
        </nav> */}
      </div>

      {/* ── DESKTOP ────────────────────────────────────────────── */}
      <div className="hidden lg:flex min-h-screen bg-[#FBFAF7] flex-col" 
      >
        <div className="flex flex-1 max-w-6xl mx-auto w-full px-6 py-8 gap-7">

          {/* LEFT sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="sticky top-24">
              {isLoadingProfile
                ? <SidebarSkeleton />
                : <SidebarContent profile={profile} isLoadingProfile={false} onLogout={handleLogout} />
              }
            </div>
          </aside>

          {/* RIGHT content area */}
          <main className="flex-1 min-w-0">
            <div className="mb-5">
              <p className="text-[26px] font-extrabold text-[#033428] tracking-tight">
                {activeMenu.label}
              </p>
              <p className="text-[13px] text-[#999] mt-0.5">Manage your account and preferences</p>
            </div>
            <Outlet context={{ profile, isLoadingProfile, onLogout: handleLogout }} />
          </main>

        </div>
      </div>
    </>
  );
}