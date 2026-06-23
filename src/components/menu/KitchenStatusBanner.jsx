import { MapPin, AlertCircle, Clock, LogIn, Navigation } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const BANNER_CONFIG = {
  no_location: {
    icon:    Navigation,
    bg:      'bg-blue-50 border-blue-100',
    iconBg:  'bg-blue-100',
    iconCol: 'text-blue-500',
    text:    'text-blue-800',
    sub:     'text-blue-500',
    title:   'Enable location access',
    message: 'Allow location or add an address to check delivery availability in your area',
    action:  null,
  },
  not_serviceable: {
    icon:    MapPin,
    bg:      'bg-orange-50 border-orange-100',
    iconBg:  'bg-orange-100',
    iconCol: 'text-orange-500',
    text:    'text-orange-800',
    sub:     'text-orange-500',
    title:   'Not serviceable at this location',
    message: "We don't deliver to your area yet. Try a different address.",
    action:  null,
  },
  not_accepting: {
    icon:    Clock,
    bg:      'bg-yellow-50 border-yellow-100',
    iconBg:  'bg-yellow-100',
    iconCol: 'text-yellow-600',
    text:    'text-yellow-800',
    sub:     'text-yellow-600',
    title:   'Currently not accepting orders',
    message: 'The kitchen is currently not accepting orders. You can still browse the menu.',
    action:  null,
  },
  not_logged_in: {
    icon:    LogIn,
    bg:      'bg-gray-50 border-gray-200',
    iconBg:  'bg-gray-100',
    iconCol: 'text-gray-500',
    text:    'text-gray-800',
    sub:     'text-gray-500',
    title:   'Login to order',
    message: 'Please login to check availability and place orders in your area.',
    action:  'login',
  },
}

export default function KitchenStatusBanner({ status, message }) {
  const {isAuthenticated} =useAuth();
  const navigate = useNavigate()

  // Determine which config to use
  const key = !isAuthenticated && status === 'no_location'
    ? 'not_logged_in'
    : status

  const config = BANNER_CONFIG[key]

  // Don't show banner if kitchen is open
  if (!config || status === 'open') return null

  const Icon = config.icon

  return (
    <div className={`flex items-start gap-3 rounded-2xl border p-4 mb-4 ${config.bg}`}>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${config.iconBg}`}>
        <Icon size={17} className={config.iconCol} strokeWidth={2.2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${config.text}`}>
          {config.title}
        </p>
        <p className={`text-xs mt-0.5 ${config.sub}`}>
          {message || config.message}
        </p>
      </div>
      {config.action === 'login' && (
        <button
          onClick={() => navigate('/login')}
          className="shrink-0 text-xs font-bold text-white bg-gray-800 px-3 py-1.5 rounded-full hover:bg-gray-700 transition"
        >
          Login
        </button>
      )}
    </div>
  )
}