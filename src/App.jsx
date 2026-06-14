import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AppLayout from './components/layout/AppLayout'
import AppRoutes from './routes/AppRoutes'
import { useAuth } from './hooks/useAuth'
import useCartStore from './store/cartStore'
import useAddressStore from './store/addressStrore'


function App() {
  const { initializeAuth } = useAuth()


  const fetchCart = useCartStore((state) => state.fetchCart)
   const initAddress  = useAddressStore((state) => state.initAddress) 
  
  // useEffect(() => {
  //   initializeAuth()
  //   fetchCart()
  // }, [])

   useEffect(() => {
    const init = async () => {
      await initializeAuth()       // wait for auth to settle first
      initAddress() // then initialize address with correct auth state
      fetchCart()
    }
    init()
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
