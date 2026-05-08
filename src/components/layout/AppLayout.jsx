import TopBar from './TopBar'
import BottomNav from './BottomNav'
import { useLocation } from 'react-router-dom'

const AUTH_PATHS = ['/login', '/verify-otp', '/onboarding']

export default function AppLayout({ children }) {
  const location = useLocation()
  const isAuthPage = AUTH_PATHS.includes(location.pathname)

  return (
    <div className="min-h-screen">
      {!isAuthPage && <TopBar />}
      <main className=
      {!isAuthPage ? '' :''}>
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
