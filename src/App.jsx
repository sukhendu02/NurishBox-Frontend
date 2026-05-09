import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AppLayout from './components/layout/AppLayout'
import AppRoutes from './routes/AppRoutes'
import { useAuth } from './hooks/useAuth'
import useCartStore from './store/cartStore'

function App() {
  const { initializeAuth } = useAuth()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

   const fetchCart = useCartStore((state) => state.fetchCart)

  useEffect(() => {
    fetchCart()
  }, [])
  return (
    <BrowserRouter>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
      <Toaster position="top-center" reverseOrder={false} />
    </BrowserRouter>
  )
}

export default App
