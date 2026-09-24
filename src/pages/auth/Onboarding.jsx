import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Leaf, Sparkles,ArrowLeft } from 'lucide-react'
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
        <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate('/login')}
          className="w-10 h-10 cursor-pointer flex items-center justify-center rounded-full bg-brand-primary text-text-brand active:scale-90 transition-transform"
        >
          <ArrowLeft size={20} className='text-white' />
        </button>
        <div className="flex items-center gap-2">
          <Leaf size={20} className="text-brand-primary" />
          <span className="font-bold text-text-brand">NurishBox</span>
        </div>
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
          <h2 className="text-2xl font-semibold text-gray-600 mb-1">
            Almost there! 
          </h2>
          <p className="text-gray-400 text-sm">Tell us a bit about yourself</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            label="Full Name *"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full px-4 py-3.5 bg-gray-100 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none border border-brand-primary focus:ring-2 focus:ring-brand-primary/40 transition'
            
          />
          <input
            label="Email (optional)"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            hint="For order receipts and offers"
            className='w-full px-4 py-3.5 bg-gray-100 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none border border-brand-primary focus:ring-2 focus:ring-brand-primary/40 transition'
          />
          <Button type="submit" loading={loading} className="mt-2 cursor-pointer">
            Get Started
          </Button>
        </form>
      </div>
    </div>
  )
}
