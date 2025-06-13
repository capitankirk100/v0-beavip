import type React from "react"

export type OrderStep =
  | "service"
  | "platform"
  | "quantity"
  | "delivery"
  | "payment"
  | "summary"
  | "telegramShop"
  | "licenses"
  | "packages"
  | "upselling"

export interface ServiceType {
  id: string
  name: string
  icon: React.ReactNode
  description: string
}

export interface PlatformType {
  id: string
  name: string
  icon: React.ReactNode
  basePrice: number
}

export interface DeliveryOption {
  id: string
  name: string
  description: string
  multiplier: number
  timeDescription: string
  price: number
}

export interface ComplementaryService {
  serviceType: string
  name: string
  description: string
  price: number
  url?: string
  username?: string
}

export interface OrderState {
  serviceType: string
  serviceName: string
  platform: string
  platformName: string
  quantity: number
  deliveryOption: string
  deliveryName: string
  deliveryTimeDescription: string
  paymentMethod: string
  price: number
  username: string
  url: string
  isRental?: boolean
  rentalDuration?: number
  // Nuovi campi per servizi specifici
  serviceSubtype?: string
  serviceSubtypeName?: string
  duration?: number // Per live stream
  postCount?: number // Per visualizzazioni su più post
  reactionType?: string // Per reazioni Facebook
  // Nuovi campi per licenze software
  needsRemoteInstallation?: boolean
  anyDeskId?: string
  // Campi per negozio Telegram
  setupFee?: boolean
  logoDesign?: boolean
  welcomeMessage?: boolean
  categoriesSetup?: boolean
  productsCount?: number
  businessDescription?: string
  // Campi per criptovalute
  selectedCrypto?: string
  // Campi per pacchetti e abbonamenti
  isPackage?: boolean
  packageId?: string
  packageItems?: Partial<OrderState>[]
  isSubscription?: boolean
  subscriptionId?: string
  billingCycle?: string
  minimumCommitment?: number
  // Campi per sconti
  discountCode?: string
  discountPercentage?: number
  // Campo per affiliazione
  affiliateNickname?: string
  // Servizi complementari
  complementaryServices?: ComplementaryService[]
}

// Aggiungi il campo description al tipo PaymentMethod
export interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
  paymentUrl?: string
  description: string
}

// Aggiungi una nuova interfaccia per gli indirizzi delle criptovalute
export interface CryptoAddress {
  id: string
  name: string
  address: string
  icon: React.ReactNode
}

export interface ServicePackage {
  id: string
  name: string
  description: string
  services: Partial<OrderState>[]
  regularPrice: number
  discountedPrice: number
  savings: number
  popularityBadge?: string
  featured?: boolean
}

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  services: Partial<OrderState>[]
  price: number
  billingCycle: string
  minimumCommitment: number
  popularityBadge?: string
  featured?: boolean
  regularPrice?: number
  savings?: number
}

export interface FlashPromotion {
  id: string
  name: string
  description: string
  packageId: string
  discountPercentage: number
  durationHours: number
  startTime: string
}
