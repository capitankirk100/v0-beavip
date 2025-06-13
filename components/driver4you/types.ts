import type React from "react"
export type BookingStep =
  | "info"
  | "partenza"
  | "destinazione"
  | "data"
  | "orario"
  | "passeggeri"
  | "waitingType"
  | "pagamento"
  | "riepilogo"
  | "pro-access"
  | "multiple-stops"

export interface Location {
  id: string
  name: string
  price: number
  zone: "vicini" | "medi" | "lontani"
}

export interface ServiceType {
  id: string
  name: string
  icon: React.ReactNode
}

export interface WaitingType {
  id: string
  name: string
  description: string
  minCost: number
  maxCost: number
}

export interface Stop {
  location: string
  price: number
}

export interface SavedRide {
  id: string
  serviceType: string
  serviceTypeName: string
  departure: string
  destination: string
  date: string
  time: string
  passengers: number
  waitingType?: string
  waitingTypeName?: string
  paymentMethod: string
  price: number
  status: "pending" | "completed" | "rejected" | "canceled"
  provider?: string
  createdAt: number
  stops?: Stop[]
}

export interface UserProfile {
  name: string
  photo?: string
}

export interface BookingState {
  serviceType: string
  serviceTypeName?: string
  fromLocation: string
  toLocation: string
  multipleStops: string[]
  date: Date | null
  time: string
  passengers: number
  waitingType: string
  paymentMethod: string
  price: number
  distance: number
  duration: number
  isRoundTrip: boolean
  isMultipleStops: boolean
}

export interface CarSharingService {
  name: string
  phone?: string
  telegram?: string
}
