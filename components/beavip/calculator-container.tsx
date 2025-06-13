"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Zap, User } from "lucide-react"
import { useOrderState } from "./hooks/use-order-state"
import { useUserProfile } from "./hooks/use-user-profile"
import { useOrderHistory } from "./hooks/use-order-history"
import { ServiceSelection } from "./components/service-selection"
import { PlatformSelection } from "./components/platform-selection"
import { QuantitySelection } from "./components/quantity-selection"
import { DeliverySelection } from "./components/delivery-selection"
import { PaymentSelection } from "./components/payment-selection"
import { UserDetails } from "./components/user-details"
import { OrderSummary } from "./components/order-summary"
import { TelegramShopSelection } from "./components/telegram-shop-selection"
import { getNearestPrice } from "./data/all-services-prices"
import { LicenseSelection } from "./components/license-selection"
import { PackagesSelection } from "./components/packages-selection"
import { UpsellingRecommendations } from "./components/upselling-recommendations"
import { UserProfileDialog } from "./components/user-profile-dialog"
import { OrderTracking } from "./components/order-tracking"
import { flashPromotions } from "./data/packages"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { OrderStep } from "./types"
import type { OrderState } from "./types"
import type { SavedOrder } from "./hooks/use-order-history"

export function BeavipCalculator() {
  // Stati per la gestione del flusso di prenotazione
  const [currentStep, setCurrentStep] = useState<OrderStep>("service")
  const [previousSteps, setPreviousSteps] = useState<OrderStep[]>([])
  const [isMobile, setIsMobile] = useState(true)
  const [showUpselling, setShowUpselling] = useState(false)
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [showFlashPromotions, setShowFlashPromotions] = useState(false)
  const [trackingInfo, setTrackingInfo] = useState<{ orderId: string; trackingUrl: string } | null>(null)
  const [showOrderTracking, setShowOrderTracking] = useState(false)
  const [currentTrackedOrder, setCurrentTrackedOrder] = useState<SavedOrder | null>(null)
  const [pulseProfileButton, setPulseProfileButton] = useState(false)

  // Custom hooks
  const { orderState, updateOrderState, resetOrderState } = useOrderState()
  const { userProfile, updateUserProfile } = useUserProfile()
  const { orderHistory, addOrder, updateOrderStatus, deleteOrder, getOrderById } = useOrderHistory()

  // Effetto per rilevare se è mobile o desktop
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Effetto per mostrare le promozioni flash casualmente
  useEffect(() => {
    // Mostra le promozioni flash con una probabilità del 30%
    const shouldShowFlash = Math.random() < 0.3
    setShowFlashPromotions(shouldShowFlash)

    // Imposta un timer per nascondere le promozioni flash dopo un po'
    if (shouldShowFlash) {
      const timer = setTimeout(
        () => {
          setShowFlashPromotions(false)
        },
        1000 * 60 * 5,
      ) // 5 minuti
      return () => clearTimeout(timer)
    }
  }, [currentStep])

  // Funzione per gestire la navigazione tra gli step
  const goToStep = (step: OrderStep) => {
    setPreviousSteps((prev) => [...prev, currentStep])
    setCurrentStep(step)
    // Scroll to top when changing steps
    window.scrollTo(0, 0)
  }

  // Funzione per tornare allo step precedente
  const goBack = () => {
    if (previousSteps.length > 0) {
      const prevStep = previousSteps[previousSteps.length - 1]
      setPreviousSteps((prev) => prev.slice(0, -1))
      setCurrentStep(prevStep)
      // Scroll to top when going back
      window.scrollTo(0, 0)
    }
  }

  // Funzione per gestire la selezione di una promozione flash
  const handleSelectFlashPromotion = (packageId: string) => {
    // Trova il pacchetto corrispondente
    const selectedPromotion = flashPromotions.find((promo) => promo.packageId === packageId)
    if (!selectedPromotion) return

    // Reset completo dello stato
    resetOrderState()

    // Imposta i valori per il pacchetto selezionato
    updateOrderState({
      serviceType: "package",
      serviceName: "Pacchetto Combinato",
      packageId: selectedPromotion.packageId,
      isPackage: true,
      discountCode: `FLASH-${selectedPromotion.id}`,
      discountPercentage: selectedPromotion.discountPercentage,
    })

    // Vai direttamente alla selezione del pacchetto
    goToStep("packages")
  }

  // Modifica la funzione handleSelectService per utilizzare i prezzi fissi
  const handleSelectService = (serviceType: string, serviceName: string) => {
    // Reset completo dello stato
    resetOrderState()

    // Se l'utente seleziona "pacchetti", vai direttamente alla selezione dei pacchetti
    if (serviceType === "packages") {
      updateOrderState({
        serviceType,
        serviceName,
      })
      goToStep("packages")
      return
    }

    // Imposta i nuovi valori
    const updates: Partial<OrderState> = {
      serviceType,
      serviceName,
      platform: "",
      platformName: "",
      quantity: 100,
      price: 0,
      serviceSubtype: undefined,
      serviceSubtypeName: undefined,
      duration: undefined,
      postCount: undefined,
    }

    // Aggiungi il nickname di affiliazione se presente
    if (userProfile.affiliateNickname) {
      updates.affiliateNickname = userProfile.affiliateNickname
    }

    // Impostazioni specifiche per tipo di servizio
    if (serviceType === "telegram") {
      updates.platform = "telegram"
      updates.platformName = "Telegram"
      updates.quantity = 1
      updates.price = 40 // Prezzo base per un numero
      updates.isRental = false
      goToStep("quantity")
    } else if (serviceType === "whatsapp") {
      updates.platform = "whatsapp"
      updates.platformName = "WhatsApp"
      updates.quantity = 1
      updates.price = 50 // Prezzo base per un numero
      updates.isRental = false
      goToStep("quantity")
    } else if (serviceType === "telegramShop") {
      updates.platform = "telegram"
      updates.platformName = "Telegram"
      updates.quantity = 1
      updates.price = 9.99 // Prezzo base per un mese di negozio
      updates.serviceSubtype = "shop"
      updates.serviceSubtypeName = "Negozio Standard"
      goToStep("telegramShop")
    } else if (serviceType === "telegramMembers") {
      updates.platform = "telegram"
      updates.platformName = "Telegram"
      updates.serviceSubtype = "members"
      updates.serviceSubtypeName = "Standard"
      updates.price = getNearestPrice(100, "members", "telegram")
      goToStep("quantity")
    } else if (serviceType === "telegramViews") {
      updates.platform = "telegram"
      updates.platformName = "Telegram"
      updates.serviceSubtype = "views"
      updates.serviceSubtypeName = "Standard"
      updates.price = getNearestPrice(100, "views", "telegram")
      goToStep("quantity")
    } else if (serviceType === "liveStream") {
      updates.platform = "youtube"
      updates.platformName = "YouTube"
      updates.duration = 15
      updates.price = getNearestPrice(1000, "liveStream", "youtube")
      goToStep("quantity")
    } else if (serviceType === "twitchServices") {
      updates.platform = "twitch"
      updates.platformName = "Twitch"
      updates.serviceSubtype = "followers"
      updates.serviceSubtypeName = "Followers"
      updates.price = getNearestPrice(100, "followers", "twitch")
      goToStep("quantity")
    } else if (serviceType === "youtubeServices") {
      updates.platform = "youtube"
      updates.platformName = "YouTube"
      updates.serviceSubtype = "viewsHQ"
      updates.serviceSubtypeName = "HQ Views"
      updates.price = getNearestPrice(1000, "viewsHQ", "youtube")
      goToStep("quantity")
    } else if (serviceType === "websiteVisits") {
      updates.platform = "website"
      updates.platformName = "Sito Web"
      updates.serviceSubtype = "fromFacebook"
      updates.serviceSubtypeName = "Da Facebook"
      updates.price = getNearestPrice(100, "fromFacebook", "website")
      goToStep("quantity")
    } else if (serviceType === "licenses") {
      updates.platform = "licenses"
      updates.platformName = "Licenze Software"
      updates.price = 0 // Il prezzo sarà determinato dalla licenza selezionata
      goToStep("licenses") // Nuovo step per la selezione delle licenze
    } else {
      // Per altri servizi, vai alla selezione della piattaforma
      goToStep("platform")
    }

    updateOrderState(updates)
  }

  // Funzione per gestire la selezione della piattaforma
  const handleSelectPlatform = (platformId: string, platformName: string, basePrice: number) => {
    // Calcola il prezzo iniziale
    let initialPrice = basePrice * 100 // Prezzo base * quantità minima (100)
    let serviceSubtype: string | undefined = undefined
    let serviceSubtypeName: string | undefined = undefined

    // Se è Instagram e il servizio è followers o likes, usa i prezzi fissi
    if (platformId === "instagram" && (orderState.serviceType === "followers" || orderState.serviceType === "likes")) {
      initialPrice = getNearestPrice(100, orderState.serviceType, "instagram")
    } else if (platformId === "tiktok") {
      if (orderState.serviceType === "views") {
        serviceSubtype = "viewsCheap"
        serviceSubtypeName = "Economiche"
        initialPrice = getNearestPrice(100, "viewsCheap", "tiktok")
      } else if (orderState.serviceType === "likes") {
        serviceSubtype = "likes"
        serviceSubtypeName = "Standard"
        initialPrice = getNearestPrice(100, "likes", "tiktok")
      } else if (orderState.serviceType === "shares") {
        serviceSubtype = "shares"
        serviceSubtypeName = "Standard"
        initialPrice = getNearestPrice(100, "shares", "tiktok")
      } else if (orderState.serviceType === "followers") {
        serviceSubtype = "followers"
        serviceSubtypeName = "HQ"
        initialPrice = getNearestPrice(100, "followers", "tiktok")
      }
    } else if (platformId === "facebook" && orderState.serviceType === "likes") {
      serviceSubtype = "postLikes"
      serviceSubtypeName = "Post/Photo Likes"
      initialPrice = getNearestPrice(100, "postLikes", "facebook")
    } else if (platformId === "youtube") {
      if (orderState.serviceType === "views") {
        serviceSubtype = "viewsHQ"
        serviceSubtypeName = "HQ Views"
        initialPrice = getNearestPrice(1000, "viewsHQ", "youtube")
      } else if (orderState.serviceType === "likes") {
        serviceSubtype = "likes"
        serviceSubtypeName = "Likes"
        initialPrice = getNearestPrice(100, "likes", "youtube")
      } else if (orderState.serviceType === "comments") {
        serviceSubtype = "comments"
        serviceSubtypeName = "Custom Comments"
        initialPrice = getNearestPrice(10, "comments", "youtube")
      } else if (orderState.serviceType === "followers") {
        serviceSubtype = "subscribers"
        serviceSubtypeName = "Subscribers"
        initialPrice = getNearestPrice(100, "subscribers", "youtube")
      }
    }

    updateOrderState({
      platform: platformId,
      platformName,
      price: initialPrice,
      serviceSubtype,
      serviceSubtypeName,
    })

    // Vai allo step successivo
    goToStep("quantity")
  }

  // Funzione per gestire l'invio dell'ordine
  const handleSubmitOrder = () => {
    // Aggiungi l'ordine allo storico con URL di tracciamento
    const { orderId, trackingUrl } = addOrder({
      ...orderState,
      affiliateNickname: userProfile.affiliateNickname,
    })

    // Salva le informazioni di tracciamento
    setTrackingInfo({ orderId, trackingUrl })

    // Attiva l'animazione pulsante sul profilo
    setPulseProfileButton(true)

    // Resetta lo stato dell'ordine e torna allo step iniziale
    resetOrderState()
    setCurrentStep("service")
    setPreviousSteps([])
  }

  // Funzione per gestire il completamento della selezione della quantità
  const handleQuantityComplete = () => {
    // Determina se mostrare suggerimenti di upselling
    setShowUpselling(true)
    goToStep("delivery")
  }

  // Funzione per gestire il completamento della selezione del pacchetto
  const handlePackageComplete = () => {
    // Salta l'upselling per i pacchetti
    setShowUpselling(false)
    goToStep("delivery")
  }

  // Funzione per gestire il salto dell'upselling
  const handleSkipUpselling = () => {
    setShowUpselling(false)
    goToStep("delivery")
  }

  // Funzione per gestire l'ordine di nuovo
  const handleOrderAgain = (order: SavedOrder) => {
    // Imposta lo stato dell'ordine con i valori dell'ordine precedente
    resetOrderState()
    updateOrderState({
      ...order,
      id: undefined,
      date: undefined,
      status: undefined,
    })

    // Vai direttamente al riepilogo
    setCurrentStep("summary")
    setPreviousSteps(["service", "platform", "quantity", "delivery"])
    setShowProfileDialog(false)
  }

  // Funzione per visualizzare il tracciamento di un ordine
  const handleTrackOrder = (orderId: string) => {
    const order = getOrderById(orderId)
    if (order) {
      setCurrentTrackedOrder(order)
      setShowOrderTracking(true)
      setShowProfileDialog(false)
    }
  }

  // Renderizza lo step corrente
  const renderStep = () => {
    // Se stiamo visualizzando il tracciamento di un ordine
    if (showOrderTracking && currentTrackedOrder) {
      return (
        <OrderTracking
          order={currentTrackedOrder}
          onBack={() => {
            setShowOrderTracking(false)
            setCurrentTrackedOrder(null)
          }}
        />
      )
    }

    switch (currentStep) {
      case "service":
        return (
          <>
            {showFlashPromotions && (
              <div className="mb-8 p-4 bg-gradient-to-br from-[#0c1220] to-[#131b30] rounded-xl shadow-lg border border-yellow-500/30 animate-pulse">
                <h3 className="text-lg font-bold text-white flex items-center mb-4">
                  ⚡ Offerta Flash - Tempo Limitato!
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {flashPromotions.slice(0, 1).map((promo) => (
                    <div key={promo.id} className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-yellow-300">{promo.name}</h4>
                        <p className="text-sm text-yellow-100">{promo.description}</p>
                      </div>
                      <Button
                        className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white"
                        onClick={() => handleSelectFlashPromotion(promo.packageId)}
                      >
                        Approfitta ora
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <ServiceSelection onSelectService={handleSelectService} />
          </>
        )
      case "platform":
        return <PlatformSelection onSelectPlatform={handleSelectPlatform} />
      case "packages":
        return (
          <PackagesSelection order={orderState} updateOrder={updateOrderState} onContinue={handlePackageComplete} />
        )
      case "telegramShop":
        return (
          <TelegramShopSelection
            order={orderState}
            updateOrder={updateOrderState}
            onContinue={() => goToStep("delivery")}
          />
        )
      case "quantity":
        return (
          <QuantitySelection order={orderState} updateOrder={updateOrderState} onContinue={handleQuantityComplete} />
        )
      case "delivery":
        return showUpselling ? (
          <UpsellingRecommendations
            order={orderState}
            updateOrder={updateOrderState}
            onContinue={() => {
              setShowUpselling(false)
              goToStep("summary")
            }}
            onSkip={handleSkipUpselling}
          />
        ) : (
          <DeliverySelection order={orderState} updateOrder={updateOrderState} onContinue={() => goToStep("summary")} />
        )
      case "payment":
        return (
          <PaymentSelection order={orderState} updateOrder={updateOrderState} onContinue={() => goToStep("summary")} />
        )
      case "summary":
        // Modificato per mostrare UserDetails o OrderSummary in base alla presenza di username e url
        return (orderState.username && orderState.url) ||
          orderState.serviceType === "telegram" ||
          orderState.serviceType === "whatsapp" ||
          orderState.serviceType === "telegramShop" ||
          orderState.serviceType === "telegramMembers" ||
          orderState.serviceType === "telegramViews" ||
          orderState.serviceType === "liveStream" ||
          orderState.serviceType === "twitchServices" ||
          orderState.serviceType === "youtubeServices" ||
          orderState.serviceType === "websiteVisits" ||
          orderState.serviceType === "licenses" ||
          orderState.serviceType === "package" ||
          orderState.serviceType === "subscription" ? (
          <OrderSummary
            order={orderState}
            userProfile={userProfile}
            onSubmitOrder={handleSubmitOrder}
            trackingInfo={trackingInfo}
          />
        ) : (
          <UserDetails order={orderState} updateOrder={updateOrderState} onContinue={() => goToStep("summary")} />
        )
      case "licenses":
        return (
          <LicenseSelection order={orderState} updateOrder={updateOrderState} onContinue={() => goToStep("delivery")} />
        )
      default:
        return <ServiceSelection onSelectService={handleSelectService} />
    }
  }

  // Funzione per renderizzare l'indicatore di progresso
  const renderProgressIndicator = () => {
    const steps = [
      { id: "service", label: "Servizio" },
      {
        id: "platform",
        label:
          orderState.serviceType === "telegram" ||
          orderState.serviceType === "whatsapp" ||
          orderState.serviceType === "telegramShop" ||
          orderState.serviceType === "telegramMembers" ||
          orderState.serviceType === "telegramViews" ||
          orderState.serviceType === "liveStream" ||
          orderState.serviceType === "twitchServices" ||
          orderState.serviceType === "youtubeServices" ||
          orderState.serviceType === "websiteVisits" ||
          orderState.serviceType === "licenses" ||
          orderState.serviceType === "packages"
            ? "Dettagli"
            : "Piattaforma",
      },
      { id: "quantity", label: "Quantità" },
      { id: "delivery", label: "Consegna" },
    ]

    // Determina lo step attuale per l'indicatore
    let currentProgressStep = "service"
    if (
      currentStep === "platform" ||
      currentStep === "telegramShop" ||
      currentStep === "licenses" ||
      currentStep === "packages"
    ) {
      currentProgressStep = "platform"
    } else if (currentStep === "quantity") {
      currentProgressStep = "quantity"
    } else if (["delivery", "payment", "summary"].includes(currentStep)) {
      currentProgressStep = "delivery"
    }

    // Funzione per gestire il click su un indicatore di progresso
    const handleStepClick = (stepId: string) => {
      // Permetti la navigazione solo tra step già visitati
      if (stepId === "service" && currentProgressStep !== "service") {
        // Torna all'inizio e resetta completamente lo stato
        resetOrderState()
        setCurrentStep("service")
        setPreviousSteps([])
      } else if (stepId === "platform" && currentProgressStep !== "platform" && orderState.serviceType) {
        // Vai a piattaforma solo se è stato selezionato un tipo di servizio
        if (orderState.serviceType === "packages") {
          setCurrentStep("packages")
        } else if (orderState.serviceType === "licenses") {
          setCurrentStep("licenses")
        } else {
          setCurrentStep("platform")
        }
        setPreviousSteps(["service"])
      } else if (
        stepId === "quantity" &&
        currentProgressStep !== "quantity" &&
        orderState.platform &&
        orderState.serviceType
      ) {
        // Vai a quantità solo se è stata selezionata una piattaforma
        setCurrentStep("quantity")
        setPreviousSteps(["service", "platform"])
      } else if (
        stepId === "delivery" &&
        currentProgressStep !== "delivery" &&
        orderState.platform &&
        orderState.serviceType &&
        orderState.quantity
      ) {
        // Vai a consegna solo se è stata selezionata una quantità
        setCurrentStep("delivery")
        setPreviousSteps(["service", "platform", "quantity"])
      }
    }

    return (
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`rounded-full ${
                currentProgressStep === step.id
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/30"
                  : "bg-[#111c36] text-gray-400"
              } flex items-center justify-center ${isMobile ? "w-14 h-14" : "w-18 h-18"} ${
                step.id === "service" ||
                (step.id === "platform" && orderState.serviceType) ||
                (step.id === "quantity" && orderState.platform && orderState.serviceType) ||
                (step.id === "delivery" && orderState.platform && orderState.serviceType && orderState.quantity)
                  ? "cursor-pointer hover:ring-2 hover:ring-purple-400/50 transition-all duration-300"
                  : ""
              }`}
              onClick={() => handleStepClick(step.id)}
            >
              <span className={`${isMobile ? "text-sm" : "text-base"} font-medium`}>{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 ${
                  steps.findIndex((s) => s.id === currentProgressStep) > index
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600"
                    : "bg-gray-700"
                } ${isMobile ? "w-12" : "w-32"} mx-1`}
              />
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050914] to-[#0a0f1e] p-4 md:p-8">
      <div className={`mx-auto ${isMobile ? "max-w-md" : "max-w-6xl"}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            {previousSteps.length > 0 && !showOrderTracking && (
              <Button
                variant="ghost"
                size="icon"
                onClick={goBack}
                className="mr-2 text-white hover:bg-purple-900/20 transition-all duration-200"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center mr-3 shadow-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Beavip
              </h1>
            </div>
          </div>

          {/* Pulsante profilo utente con foto */}
          <div
            className={`relative cursor-pointer ${pulseProfileButton ? "animate-pulse" : ""}`}
            onClick={() => {
              setShowProfileDialog(true)
              setPulseProfileButton(false)
            }}
          >
            <Avatar
              className={`w-10 h-10 border-2 ${pulseProfileButton ? "border-green-500" : "border-gray-700"} transition-all duration-300`}
            >
              {userProfile.photo ? (
                <AvatarImage src={userProfile.photo || "/placeholder.svg"} alt={userProfile.name} />
              ) : (
                <AvatarFallback className="bg-[#151a29] text-purple-400">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              )}
            </Avatar>
            {pulseProfileButton && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            )}
          </div>
        </div>

        {!showOrderTracking && renderProgressIndicator()}

        {/* Main Content */}
        <div className={isMobile ? "" : "grid grid-cols-1 gap-6"}>
          <div className="p-0">{renderStep()}</div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Beavip © 2025 - Progetto educazionale per UI/UX</p>
        </div>
      </div>

      {/* Dialog del profilo utente */}
      <UserProfileDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
        userProfile={userProfile}
        updateUserProfile={updateUserProfile}
        orderHistory={orderHistory}
        updateOrderStatus={updateOrderStatus}
        deleteOrder={deleteOrder}
        onOrderAgain={handleOrderAgain}
        onTrackOrder={handleTrackOrder}
      />
    </div>
  )
}
