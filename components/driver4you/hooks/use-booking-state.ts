"use client"

import { useState } from "react"
import type { BookingState } from "../types"

export const initialBookingState: BookingState = {
  serviceType: "",
  fromLocation: "",
  toLocation: "",
  multipleStops: [],
  date: null,
  time: "",
  passengers: 1,
  waitingType: "No waiting",
  paymentMethod: "Cash",
  price: 0,
  distance: 0,
  duration: 0,
  isRoundTrip: false,
  isMultipleStops: false,
}

export const useBookingState = () => {
  const [bookingState, setBookingState] = useState<BookingState>(initialBookingState)

  const updateBookingState = (updates: Partial<BookingState>) => {
    setBookingState((prev) => ({ ...prev, ...updates }))
  }

  const resetBookingState = () => {
    setBookingState(initialBookingState)
  }

  return {
    bookingState,
    updateBookingState,
    resetBookingState,
  }
}
