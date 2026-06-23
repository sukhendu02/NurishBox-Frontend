import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Leaf, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { completeProfile } from '../../api/auth.api'
import { saveTokens, clearTempToken } from '../../utils/token'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import useAddressStore from '../../store/addressStrore'

export default function Onboarding() {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)


  const fetchCart = useCartStore((s) => s.fetchCart)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Please enter your name', { style: { background: '', color: '', fontSize: '12px' } })
      return
    }
    setLoading(true)
    try {
      const { data } = await completeProfile(name.trim(), email.trim())
   
      console.log("Profile completion response:", data)

      // console.log(hi)
      saveTokens(data.data.accessToken, data.data.refreshToken)
      clearTempToken()
      if (data.data.user) setUser(data.data.user)
        await fetchCart()
      await useAddressStore.getState().initAddress()
        navigate('/')
    } catch (err) {
      // console.log(err);
      const msg = err?.response?.data?.error?.message || 'Something went wrong. Try again.'
      toast.error(msg, { style: { background: '', color: '', fontSize: '12px' } })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-10">
      {/* Brand */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center">
          <Leaf size={20} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="font-bold text-text-brand text-lg">NurishBox</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto gap-6">
        {/* Heading */}
        <div>
          {/* <div className="flex items-center gap-2 mb-2">
            <Sparkles size={22} className="text-accent-energy" />
            <span className="text-xs font-semibold text-accent-energy bg-accent-energy/10 px-2 py-0.5 rounded-full">
              Almost there!
            </span>
          </div> */}
          <h2 className="text-2xl font-bold text-text-brand mb-1">
            Almost there! 
          </h2>
          <p className="text-gray-400 text-sm">Tell us a bit about yourself</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            label="Full Name *"
            placeholder="Rahul Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            
          />
          <input
            label="Email (optional)"
            type="email"
            placeholder="rahul@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            hint="For order receipts and offers"
          />
          <Button type="submit" loading={loading} className="mt-2 cursor-pointer">
            Get Started
          </Button>
        </form>
      </div>
    </div>
  )
}
