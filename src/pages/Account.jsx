import { useNavigate } from 'react-router-dom'
import { ShoppingBag, MapPin, Wallet, Headphones, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { logout } from '../api/auth.api'
import { clearTokens, getRefreshToken } from '../utils/token'

const menuItems = [
  { icon: ShoppingBag, label: 'My Orders' },
  { icon: MapPin, label: 'My Addresses' },
  { icon: Wallet, label: 'Wallet' },
  { icon: Headphones, label: 'Help & Support' },
]

export default function Account() {
  const navigate = useNavigate()
  const { user, clearUser } = useAuth()

  async function handleLogout() {
    try {
      const refreshToken = getRefreshToken()
      await logout(refreshToken)
      clearTokens()
      clearUser()
      navigate('/')
    } catch (err) {
      console.error('Logout error:', err)
    }
    // toast.success('Logged out successfully', { style: { background: '#0D9E7E', color: 'white' } })
  }

  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Profile section */}
      <div className="bg-gradient-to-b from-brand-primary/10 to-transparent p-6 flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-brand-primary text-white flex items-center justify-center text-4xl font-bold uppercase shadow-lg shadow-brand-primary/30">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-text-brand">{user?.name || 'User'}</h2>
          <p className="text-sm text-gray-500">{user?.phone || 'No phone'}</p>
        </div>
      </div>

      {/* Menu items */}
      <div className="px-4 py-6 flex flex-col gap-3">
        <div className="bg-white rounded-2xl border border-brand-tint overflow-hidden">
          {menuItems.map((item, idx) => {
            const Icon = item.icon
            return (
              <button
                key={idx}
                className="w-full flex items-center justify-between px-4 py-4 text-text-brand hover:bg-brand-surface/50 transition-colors"
                style={{
                  borderBottom:
                    idx !== menuItems.length - 1 ? '1px solid var(--color-brand-tint)' : 'none',
                }}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className="text-brand-primary" />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                <span className="text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M6 2L10 8L6 14" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </span>
              </button>
            )
          })}
        </div>

        {/* Logout button */}
        <Button
          variant="danger"
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 mt-4"
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </div>
  )
}
