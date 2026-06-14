
import React, { useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MapPin,
  ChevronDown,
  Home,
  Briefcase,
  Plus,
  Check,
  User,
  Bell,
} from 'lucide-react';
// import useAddressStore from '../store/addressStore'; // ← adjust path if needed
import { useAuth } from '../../hooks/useAuth';           // ← adjust path if needed
import useAddressStore from '../../store/addressStrore';
const AUTH_PATHS = ['/login', '/verify-otp', '/onboarding'];

// Map address type strings to icons
function getIcon(type) {
  if (type === 'Home') return Home;
  if (type === 'Work') return Briefcase;
  return MapPin;
}

export default function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const selectedAddress  = useAddressStore((s) => s.selectedAddress);
  const addresses        = useAddressStore((s) => s.addresses);
  const setSelectedAddress = useAddressStore((s) => s.setSelectedAddress);

  const [addressOpen, setAddressOpen] = React.useState(false);
  const addressRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (addressRef.current && !addressRef.current.contains(e.target)) {
        setAddressOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on route change
  useEffect(() => {
    setAddressOpen(false);
  }, [location.pathname]);

  // Hide on auth pages
  if (AUTH_PATHS.includes(location.pathname)) return null;

  // Don't render until address is resolved
  if (!selectedAddress) return null;

  console.log('addresses', addresses)
console.log('selectedAddress', selectedAddress)
console.log('isAuthenticated', isAuthenticated)


  const handleSelectAddress = (addr) => {
    setSelectedAddress({ type: 'saved', ...addr });
    setAddressOpen(false);
  };

  // ── Derived display values ─────────────────────────────────────────────────
  const isCurrentLocation = selectedAddress.type === 'current_location';

  const displayType    = isCurrentLocation ? 'Current' : (selectedAddress.label ?? selectedAddress.type ?? 'Saved');
  const displayAddress = isCurrentLocation
    ? (selectedAddress.label ?? 'Your location')
    : (selectedAddress.line1 ?? selectedAddress.address ?? '');

  // Saved addresses list is only shown when logged in and addresses exist
  const showDropdown = isAuthenticated && addresses.length > 0;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-1 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2">

          {/* ============ LEFT: ADDRESS SELECTOR ============ */}
          <div ref={addressRef} className="relative flex-1 min-w-0">
            <button
              onClick={() => showDropdown && setAddressOpen(!addressOpen)}
              className="flex items-center cursor-pointer gap-2 sm:gap-3 group max-w-full hover:bg-gray-50 rounded-xl px-2 py-1.5 transition-all"
            >
              {/* Pin Icon with gradient bg */}
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0D9E7E] to-[#0A7560] flex items-center justify-center shadow-md shadow-[#0D9E7E]/30">
                  <MapPin size={15} className="text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Address text */}
              <div className="flex flex-col items-start min-w-0 text-left">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                    Deliver to
                  </span>
                  <span className="text-[10px] font-bold text-[#0A7560] bg-[#E8F8F3] px-1.5 py-0.5 rounded-full">
                    {displayType}
                  </span>
                </div>
                <div className="flex items-center gap-1 max-w-[180px] sm:max-w-xs">
                  <span className="text-xs font-semibold text-slate-700 truncate">
                    {displayAddress}
                  </span>
                  {/* Only show chevron when dropdown is available */}
                  {showDropdown && (
                    <ChevronDown
                      size={16}
                      className={`text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                        addressOpen ? 'rotate-180 text-[#0A7560]' : ''
                      }`}
                    />
                  )}
                </div>
              </div>
            </button>

            {/* Address Dropdown — only rendered when user has saved addresses */}
            {showDropdown && (
              <div
                className={`absolute left-0 top-full mt-2 w-[140%] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden origin-top-left transition-all duration-200 ${
                  addressOpen
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}
              >
                {/* Header */}
                <div className="px-5 py-4 bg-gradient-to-br from-[#E8F8F3] to-white border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900">
                    Choose Delivery Address
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Select where you want your fresh meals delivered
                  </p>
                </div>

                {/* Address List */}
                <div className="max-h-80 overflow-y-auto py-2">
                  {addresses.map((addr) => {
                    const Icon = getIcon(addr.type);
                const isSelected =
  selectedAddress.type === 'saved' &&
  selectedAddress.id === addr.id   // ← was address_id


                    return (
                      <button
                        key={addr.id}
                        onClick={() => handleSelectAddress(addr)}
                        className={`w-full flex items-start gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left ${
                          isSelected ? 'bg-[#E8F8F3]/50' : ''
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? 'bg-[#0A7560] text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <Icon size={18} strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-gray-900">
                              {addr.label}
                            </span>
                            {isSelected && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-[#0A7560] bg-[#B2E8D6]/40 px-2 py-0.5 rounded-full">
                                <Check size={10} strokeWidth={3} />
                                Selected
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5 truncate">
                            {addr.line1}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {addr.city}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Add New Address */}
                <button
                  onClick={() => {
                    setAddressOpen(false);
                    navigate('/account/manage-address');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-4 border-t border-gray-100 text-sm font-semibold text-[#0A7560] hover:bg-[#E8F8F3]/50 transition-colors"
                >
                  <Plus size={16} strokeWidth={2.5} />
                  Add New Address
                </button>
              </div>
            )}
          </div>

          {/* ============ RIGHT: NOTIFICATIONS + PROFILE ICON ============ */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Notifications Button */}
            <button
              onClick={() => navigate('/notifications')}
              className="relative w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
              aria-label="Notifications"
            >
              <Bell size={18} className="text-gray-700" strokeWidth={2} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E8A020] ring-2 ring-white" />
            </button>

            {/* Profile Icon Button */}
            <button
              onClick={() => navigate('/account')}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5ECBA8] to-[#0A7560] hover:shadow-lg hover:shadow-[#0A7560]/30 flex items-center justify-center transition-all"
              aria-label="Profile"
            >
              <User size={18} className="text-white" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}