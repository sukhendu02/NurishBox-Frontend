import { useEffect, useRef } from 'react'
import useOrderStore from './orderStore'
import { getAccessToken } from '../utils/token'

export function useOrderTracking(orderId) {
  const eventSourceRef = useRef(null)
  const setTrackedStatus = useOrderStore((s) => s.setTrackedStatus)
  const setIsTracking    = useOrderStore((s) => s.setIsTracking)
  const clearTracking    = useOrderStore((s) => s.clearTracking)

  useEffect(() => {
    if (!orderId) return

   const token = getAccessToken()
   console.log(token)
    if (!token) return

    setIsTracking(true)

    const es = new EventSource(
      `${import.meta.env.VITE_API_URL}/order/track/${orderId}?token=${token}`,
      { withCredentials: true } // sends cookies; for JWT in header see note below
    )

    eventSourceRef.current = es

    es.addEventListener('order_update', (e) => {
      const data = JSON.parse(e.data)
      setTrackedStatus(data.status)

      // Server closed on terminal — clean up client side too
      if (data.isFinal) {
        es.close()
        setIsTracking(false)
      }
    })

    es.onerror = () => {
      es.close()
      setIsTracking(false)
    }

    return () => {
      es.close()
      clearTracking()
    }
  }, [orderId])
}