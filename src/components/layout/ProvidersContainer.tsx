"use client";

import CartContextProvider from "@/context/cartContext";
import { store } from "@/Redux/Slices/store";
import React, { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";

const ProvidersContainer = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <CartContextProvider>
        {children}
        <Toaster />
      </CartContextProvider>
    </Provider>
  );
};

export default ProvidersContainer;
