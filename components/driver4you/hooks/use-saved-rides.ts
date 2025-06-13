"use client"

import { useState, useEffect } from "react"
import type { SavedRide, BookingState } from "../types"

export const useSavedRides = () => {
  // Stato per lo storico delle corse
  const [savedRides, setSavedRides] = useState<SavedRide[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("driver4you_saved_rides")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  // Salva le corse nel localStorage quando cambiano
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("driver4you_saved_rides", JSON.stringify(savedRides))
    }
  }, [savedRides])

  // Funzione per salvare una corsa nello storico
  const saveRideToHistory = (booking: BookingState, provider: string) => {
    const newRide: SavedRide = {
      id: `ride_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      serviceType: booking.serviceType,
      serviceTypeName: booking.serviceTypeName || booking.serviceType,
      departure: booking.fromLocation,
      destination: booking.toLocation,
      date: booking.date ? booking.date.toISOString() : "",
      time: booking.time,
      passengers: booking.passengers,
      waitingType: booking.waitingType,
      waitingTypeName: booking.waitingType,
      paymentMethod: booking.paymentMethod,
      price: booking.price,
      status: "pending",
      provider: provider,
      createdAt: Date.now(),
      stops: booking.multipleStops.map((stop) => ({ location: stop, price: 0 })),
    }

    setSavedRides((prev) => [newRide, ...prev])
    return newRide.id
  }

  // Funzione per aggiornare lo stato di una corsa
  const updateRideStatus = (rideId: string, newStatus: "pending" | "completed" | "rejected" | "canceled") => {
    setSavedRides((prev) => prev.map((ride) => (ride.id === rideId ? { ...ride, status: newStatus } : ride)))
  }

  // Funzione per eliminare una corsa dallo storico
  const deleteRide = (rideId: string) => {
    setSavedRides((prev) => prev.filter((ride) => ride.id !== rideId))
    return true
  }

  return {
    savedRides,
    saveRideToHistory,
    updateRideStatus,
    deleteRide,
  }
}
