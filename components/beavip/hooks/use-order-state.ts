"use client"

import { useState } from "react"
import type { OrderState } from "../types"

export const initialOrderState: OrderState = {
  serviceType: "",
  serviceName: "",
  platform: "",
  platformName: "",
  quantity: 100,
  deliveryOption: "",
  deliveryName: "",
  deliveryTimeDescription: "",
  paymentMethod: "crypto",
  price: 0,
  username: "",
  url: "",
}

export const useOrderState = () => {
  const [orderState, setOrderState] = useState<OrderState>(initialOrderState)

  const updateOrderState = (updates: Partial<OrderState>) => {
    setOrderState((prev) => ({ ...prev, ...updates }))
  }

  const resetOrderState = () => {
    setOrderState(initialOrderState)
  }

  return {
    orderState,
    updateOrderState,
    resetOrderState,
  }
}
