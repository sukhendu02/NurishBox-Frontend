import { Gift, TicketPercent } from 'lucide-react'
import React from 'react'

export default function GiftCard() {
  return (
    <>
    <div className='flex justify-center flex-col  text-sm items-center text-gray-500 mt-16'>
       
       <Gift className='my-5' size={40}/>
       <p>
         No Gift Cards available yet
        </p>
    </div>
    </>
  )
}
