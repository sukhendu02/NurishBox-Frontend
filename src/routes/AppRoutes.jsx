import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoutes.jsx'

import Home from '../pages/Home'
import Explore from '../pages/Explore'
import Plans from '../pages/Plans'
import Cart from '../pages/Cart'

import Login from '../pages/auth/Login'
import VerifyOTP from '../pages/auth/verifyOTP'
import Onboarding from '../pages/auth/Onboarding'
import AccountShell from '../pages/AccountShell.jsx'
import AccountOverview from '../pages/AccountOverview.jsx'
import ManageAddress from '../pages/account/ManageAddresses.jsx'
import Orders from '../pages/account/Orders.jsx'
import Coupons from '../pages/account/Coupons.jsx'
import OrderTracking from '../components/order/OrderTracking.jsx'
import SettingsPage from '../pages/account/SettingsPage.jsx'
import GiftCard from '../pages/account/GiftCard.jsx'
import Feedback from '../pages/account/Feedback.jsx'

export default function AppRoutes() {
  return (
    <>
   
  
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/plans" element={<Plans />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/onboarding" element={<Onboarding />} />
      

      {/* Account — shell wraps all children */}
      <Route path="/account" element={
         <ProtectedRoute>
    <AccountShell />
  </ProtectedRoute>
      }>
        <Route index          element={<AccountOverview />} />
        <Route path="manage-address" element={<ManageAddress />} />
        <Route path="orders"         element={<Orders />} />
        <Route path="orders/track/:orderId"         element={<OrderTracking/>} />
        <Route path="my-coupons"     element={<Coupons />} />
        <Route path="settings"     element={<SettingsPage/>} />
        <Route path="gift-cards"     element={<GiftCard/>} />
        <Route path="feedback"     element={<Feedback/>} />

      </Route>
    </Routes>
 </>
  )
}
