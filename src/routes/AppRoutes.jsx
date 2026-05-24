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
      

      {/* Account — shell wraps all children */}
      <Route path="/account" element={
         <ProtectedRoute>
    <AccountShell />
  </ProtectedRoute>
      }>
        <Route index          element={<AccountOverview />} />
        <Route path="manage-address" element={<ManageAddress />} />
        <Route path="orders"         element={<Orders />} />
        <Route path="my-coupons"     element={<Coupons />} />
        {/* 
        <Route path="gift-cards"     element={<GiftCards />} />
        <Route path="favourites"     element={<Favourites />} />
        <Route path="settings"       element={<Settings />} />
        <Route path="feedback"       element={<Feedback />} /> */}
      </Route>
    </Routes>

  )
}
