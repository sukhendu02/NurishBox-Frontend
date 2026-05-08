import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import { sendOTP } from '../../api/auth.api'

export default function Login() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  function isValidPhone(val) {
    return /^[6-9]\d{9}$/.test(val)
  }

  async function handleSendOTP(e) {
    e.preventDefault()
    if (!isValidPhone(phone)) {
      toast.error('Enter a valid mobile number', {
        style: { background: '#fff',fontSize:'12px' },
      })
      return
    }
    setLoading(true)
    try {
      const response = await sendOTP(phone)
    
      toast.success('OTP sent successfully!', {
        style: { background: '#fff', fontSize:'12px' },
      })
      navigate('/verify-otp', { state: { phone } })
    } catch (err) {
      console.log('Error sending OTP:', err.response || err)
      const msg = err?.response?.data?.error?.message || 'Failed to send OTP. Try again.'
      toast.error(msg,{
        style: { background: '#fff',fontSize:'12px' },
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    
     <div className="min-h-screen flex flex-col bg-[#f7f6f1]">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-0  sm:px-6 sm:py-12">
        <div className="w-full max-w-6xl h-screen sm:h-auto grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-sm overflow-hidden">
          
          {/* Left Side - Hero Section */}
          <div className="relative hidden lg:flex flex-col items-center justify-center p-12 bg-white overflow-hidden">
            {/* Decorative Circles */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-[420px] h-[420px] rounded-full border border-[#B2E8D6]/60"></div>
              <div className="absolute w-[340px] h-[420px] rounded-full border border-dashed border-[#B2E8D6]/60"></div>
              <div
                className="absolute w-[420px] h-[420px] rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(178,232,214,0.55) 0%, rgba(232,248,243,0.3) 60%, transparent 100%)',
                }}
              ></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
            

              <h1 className="text-4xl font-bold text-[#0A7560] leading-tight mb-6">
                Fueling Your <br /> Living Atrium.
              </h1>
              <p className="text-[#033428]/70 text-base leading-relaxed">
                Experience the organic editorial approach to modern nutrition
                and sustainable living.
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <div className="w-full max-w-md mx-auto">
              {/* Brand */}
              <p className="italic font-bold text-[#0D9E7E] text-lg mb-3">
                GreenKitchen
              </p>

              {/* Heading */}
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back
              </h2>
              <p className="text-gray-500 text-sm mb-8">
                Please enter your details to continue your journey.
              </p>

              {/* Form */}
              <form onSubmit={handleSendOTP} className="space-y-5">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-semibold tracking-widest text-gray-700 mb-2"
                  >
                    PHONE NUMBER
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                    id="phone"
                    type="tel"
                     inputMode="numeric"
                      maxLength={10}
                    value="+91"
                    readOnly
                    className="w-16 px-4 py-3.5 bg-gray-100 rounded-l-lg text-slate-500 placeholder-gray-400 focus:outline-none "
                  />  
                  
                   {/* <input
                    id="phone"
                    type="tel"
                     inputMode="numeric"
                      maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full px-4 py-3.5 bg-gray-100 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9E7E]/40 transition"
                  /> */}

                  <input
  id="phone"
  type="tel"
  inputMode="numeric"
  maxLength={10}
  value={phone}
  onChange={(e) => {
    // Allow only digits and limit to 10 chars
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(value);
  }}
  onKeyDown={(e) => {
    // Block non-numeric keys (except control keys)
    if (
      !/[0-9]/.test(e.key) &&
      !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key) &&
      !(e.ctrlKey || e.metaKey) // allow Ctrl+A, Cmd+C, etc.
    ) {
      e.preventDefault();
    }
  }}
  onPaste={(e) => {
    // Sanitize pasted content
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 10);
    setPhone(pasted);
    console.log('Pasted value:', pasted);
  }}
  placeholder="98765 43210"
  className="w-full px-4 py-3.5 bg-gray-100 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9E7E]/40 transition"
/>
                  </div>
                 
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 my-5 rounded-full bg-brand-primary hover:bg-brand-dark cursor-pointer text-white font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Login with Phone Number
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="px-3 text-xs tracking-wider text-gray-500">
                  OR CONTINUE WITH
                </span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

         

              {/* Sign up link */}
              <p className="text-center text-sm text-gray-500 mt-8">
                Don't have an account?{' '}
                <a
                  href="#"
                  className="font-semibold text-[#0A7560] hover:text-[#065443]"
                >
                  Create account
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      {/* <footer className="border-t border-gray-200 bg-[#f7f6f1]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm">
            <span className="font-bold text-[#0A7560]">GreenKitchen.</span>
            <span className="text-gray-500">
              © 2024 GreenKitchen. The Living Atrium.
            </span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-[#0A7560]">Sourcing</a>
            <a href="#" className="hover:text-[#0A7560]">Nutrition</a>
            <a href="#" className="hover:text-[#0A7560]">Support</a>
            <a href="#" className="hover:text-[#0A7560]">Privacy</a>
          </nav>
        </div>
      </footer> */}
    </div>
    
    </>
    
  )
}
