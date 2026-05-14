import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoutes.jsx'

import Home from '../pages/Home'
import Explore from '../pages/Explore'
import Plans from '../pages/Plans'
import Cart from '../pages/Cart'
import Account from '../pages/Account'
import Login from '../pages/auth/Login'
import VerifyOTP from '../pages/auth/verifyOTP'
import Onboarding from '../pages/auth/Onboarding'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/plans" element={<Plans />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/onboarding" element={<Onboarding />} />
      

      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
