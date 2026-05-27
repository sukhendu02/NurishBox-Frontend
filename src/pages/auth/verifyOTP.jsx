import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Leaf } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import { verifyOTP } from '../../api/auth.api'
import { saveTokens, saveTempToken } from '../../utils/token'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
const OTP_LENGTH = 6
const RESEND_SECONDS = 60

export default function VerifyOTP() {
  const navigate = useNavigate()
  const location = useLocation()
  const phone = location.state?.phone || ''
  const setUser = useAuthStore((s) => s.setUser)

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''))
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(RESEND_SECONDS)
  const inputRefs = useRef([])

  useEffect(() => {
    if (!phone) navigate('/login')
  }, [phone, navigate])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (timer <= 0) return
    const id = setTimeout(() => setTimer((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timer])


  const fetchCart = useCartStore((s) => s.fetchCart)

  function handleChange(index, value) {
    const char = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = char
    setDigits(next)

    if (char && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    if (char && index === OTP_LENGTH - 1) {
      const otp = [...next].join('')
      // if (otp.length === OTP_LENGTH) submitOTP(otp)
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    const next = [...digits]
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    setDigits(next)
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1)
    inputRefs.current[focusIdx]?.focus()
    if (pasted.length === OTP_LENGTH) submitOTP(pasted)
  }

  async function submitOTP(otp) {
    setLoading(true)
    try {
      const { data } = await verifyOTP(phone, otp)
      console.log(data)
     
      if (data.data.isNewUser) {
        saveTempToken(data.data.tempToken)
        toast.success('OTP verified!', { style: { fontSize:'12px' } })
        navigate('/onboarding')
      } else {
        // console.log("User data after OTP verification:", data.data.user);
        saveTokens(data.data.accessToken, data.data.refreshToken)
        if (data.data.user) setUser(data.data.user)
         await fetchCart()
          console.log("User data after OTP verification:", data.data.user);
        toast.success('Login successful!', { style: { fontSize:'12px' } })
        navigate('/')
      }
    } catch (err) {
      const msg = err?.response?.data?.error?.message || 'Invalid or expired OTP.'
      toast.error(msg, { style: { fontSize:'12px' } })
      setDigits(Array(OTP_LENGTH).fill(''))
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  function handleResend() {
    setTimer(RESEND_SECONDS)
    setDigits(Array(OTP_LENGTH).fill(''))
    inputRefs.current[0]?.focus()
    toast.success('OTP resent!', { style: { fontSize:'12px' } })
  }

  const otp = digits.join('')

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate('/login')}
          className="w-10 h-10 cursor-pointer flex items-center justify-center rounded-full bg-brand-surface text-text-brand active:scale-90 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <Leaf size={20} className="text-brand-primary" />
          <span className="font-bold text-text-brand">NurishBox</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto gap-6">
        <div>
          <h2 className="text-2xl font-bold text-text-brand mb-1">Enter OTP</h2>
          <p className="text-gray-400 text-sm">
            We sent a 6-digit code to{' '}
            <span className="text-brand-primary font-semibold">+91 {phone}</span>
          </p>
        </div>

        {/* OTP inputs */}
        <div className="flex gap-2 justify-between" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-12 h-12 text-center text-xl font-bold text-text-brand rounded-xl border-2 outline-none transition-all duration-150
                ${d ? 'bg-brand-surface border-brand-primary' : 'bg-white border-brand-tint'}
                focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20`}
            />
          ))}
        </div>

        {/* Verify button */}
        <Button
          onClick={() => otp.length === OTP_LENGTH && submitOTP(otp)}
          loading={loading}
          disabled={otp.length < OTP_LENGTH}
          className='cursor-pointer'
        >
          Verify OTP
        </Button>

        {/* Resend */}
        <div className="text-center">
          {timer > 0 ? (
            <p className="text-sm text-gray-400 ">
              Resend in{' '}
              <span className="font-semibold text-text-brand">
                0:{String(timer).padStart(2, '0')}
              </span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-sm cursor-pointer text-brand-primary font-semibold underline underline-offset-2"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
