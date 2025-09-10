import CartContextProvider from '@/context/cartContext'
import React, { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'

const ProvidersContainer = ({children} : {children: ReactNode}) => {
  return (
      <CartContextProvider>
        {children}
        <Toaster />
      </CartContextProvider>
  )
}

export default ProvidersContainer