
import React, { useRef, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  CalendarDays,
  ShoppingCart,
  Compass,
  User,
} from 'lucide-react';

import useCartStore from '../../store/cartStore';
const navItems = [
  { to: '/', icon: Home, label: 'Home', color: '#0A7560' },
  { to: '/plans', icon: CalendarDays, label: 'Plans', color: '#0D9E7E' },
  { to: '/cart', icon: ShoppingCart, label: 'Cart', color: '#0D9E7E', isCart: true },
  { to: '/explore', icon: Compass, label: 'Explore', color: '#0A7560' },
  { to: '/account', icon: User, label: 'Account', color: '#0D9E7E' },
];

const AUTH_PATHS = ['/login', '/verify-otp', '/onboarding'];

export default function BottomNav() {
  const location = useLocation();
  const itemRefs = useRef([]);
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0, opacity: 0 });

  // 🛒 Cart count - hardcoded for now. Replace later with Context/Redux/Zustand

const cartCount = useCartStore((state) => state.itemCount)
  
const [pop, setPop] = useState(false)
const prevCount  = useRef(cartCount)

useEffect(() => {
  // Only trigger when count INCREASES (item added)
  if (cartCount > prevCount.current) {
    setPop(true)
    const timer = setTimeout(() => setPop(false), 600)
    return () => clearTimeout(timer)
  }
  prevCount.current = cartCount
}, [cartCount])


  const activeIndex = navItems.findIndex((item) =>
    item.to === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(item.to)
  );

  useEffect(() => {
    const updateSlider = () => {
      if (activeIndex < 0) {
        setSliderStyle((s) => ({ ...s, opacity: 0 }));
        return;
      }
      const activeItem = itemRefs.current[activeIndex];
      if (activeItem) {
        setSliderStyle({
          left: activeItem.offsetLeft,
          width: activeItem.offsetWidth,
          opacity: 1,
        });
      }
    };

    updateSlider();
    window.addEventListener('resize', updateSlider);
    return () => window.removeEventListener('resize', updateSlider);
  }, [activeIndex, location.pathname]);


  if (AUTH_PATHS.includes(location.pathname)) return null;

  const activeColor =
    activeIndex >= 0 ? navItems[activeIndex].color : '#0A7560';

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50  w-[95%] sm:w-auto
        max-w-md sm:max-w-none">
      <nav className="relative bg-white rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.15)] px-1 sm:px-3 py-2 flex items-center justify-evenly gap-1 border border-gray-100">
        
        {/* Sliding Background Indicator */}
        <div
          className="absolute top-2 bottom-2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none"
          style={{
            left: `${sliderStyle.left}px`,
            width: `${sliderStyle.width}px`,
            opacity: sliderStyle.opacity,
            // background: `linear-gradient(135deg, ${activeColor}15, ${activeColor}30)`,
          }}
        />

        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isCart = item.isCart;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              ref={(el) => (itemRefs.current[index] = el)}
              className="relative flex flex-col items-center justify-center px-2 sm:px-4 py-2  z-10 group outline-none"
            >
              {({ isActive }) => (
                <>
                 

                  {/* Icon Container */}
                  <div
                    className={`relative flex items-center justify-center rounded-full transition-all duration-500 ${
                      isActive ? 'w-9 h-9 sm:w-11 sm:h-11 -mt-1' : 'w-7 h-7 sm:w-9 sm:h-9'
                    }`}
                    style={{
                      backgroundColor: isActive ? item.color : 'transparent',
                      boxShadow: isActive ? `0 8px 20px ${item.color}50` : 'none',
                       animation:  isCart && pop ? 'ringGlow 1.2s ease-out forwards' : 'none',
                    }}
                  >
                    <Icon
                      size={isActive ? 20 : 19}
                      strokeWidth={isActive ? 2.5 : 2}
                      color={isActive ? '#fff' : '#9CA3AF'}
                      className="transition-all duration-500"
                      style={{
      transform:  isCart && pop ? 'scale(1.25)' : 'scale(1)',
      transition: 'transform 0.2s ease',
    }}
                    />

                    {/* 🔴 Cart Badge */}
                    {isCart && cartCount > 0 && (
                      // <div
                      //   className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white"
                      //   style={{ animation: 'bumpBadge 1.5s ease-in-out infinite' }}
                      // >
                      //   {cartCount > 25 ? '25+' : cartCount}
                      // </div>
                        <div
      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1
                 rounded-full bg-red-500 text-white text-[10px] font-bold
                 flex items-center justify-center border-2 border-white"
      style={{
        animation: pop
          ? 'badgePop 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards'
          : 'bumpBadge 1.5s ease-in-out infinite',
        transform: pop ? 'scale(1.4)' : 'scale(1)',
      }}
    >
      {cartCount > 25 ? '25+' : cartCount}
    </div>
                    )}

                    {/* Active Pulse Ring */}
                    {isActive && (
                      <span
                        className="absolute inset-0 rounded-full opacity-30"
                        style={{
                          backgroundColor: item.color,
                          animation: 'navPing 1.8s cubic-bezier(0,0,0.2,1) infinite',
                        }}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-[9px] font-semibold tracking-wider mt-1 transition-all duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-60'
                    }`}
                    style={{
                      color: isActive ? item.color : '#9CA3AF',
                    }}
                  >
                    {item.label.toUpperCase()}
                  </span>

                  {/* Bottom Active Dot */}
                  {isActive && (
                    <span
                      className="absolute -bottom-0.5 w-1 h-1 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

    
    </div>
  );
}