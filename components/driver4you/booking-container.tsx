"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, ChevronLeft, Car } from "lucide-react"
import { serviceTypes } from "./data/service-types"
import { locations } from "./data/locations"
import { specialDestinations } from "./data/special-destinations"
import { useBookingState } from "./hooks/use-booking-state"
import { useSavedRides } from "./hooks/use-saved-rides"
import { useUserProfile } from "./hooks/use-user-profile"
import { useProAccess } from "./hooks/use-pro-access"
import { useCookieConsent } from "./hooks/use-cookie-consent"
import { ServiceSelection } from "./components/service-selection"
import { LocationSelection } from "./components/location-selection"
import { MultipleStops } from "./components/multiple-stops"
import { DateTimeSelection } from "./components/date-time-selection"
import { PassengersSelection } from "./components/passengers-selection"
import { WaitingSelection } from "./components/waiting-selection"
import { PaymentSelection } from "./components/payment-selection"
import { BookingSummary } from "./components/booking-summary"
import { ProAccessRequired } from "./components/pro-access-required"
import { UserProfileDialog } from "./components/user-profile-dialog"
import { BecomeProviderDialog } from "./components/become-provider-dialog"
import { AboutProjectDialog } from "./components/about-project-dialog"
import { CookieBanner } from "./components/cookie-banner"
import type { BookingStep } from "./types"
import type { SavedRide } from "./types"

// Aggiungi l'importazione degli stili CSS all'inizio del file, dopo le altre importazioni
import "./styles/custom-scrollbar.css"

export function Driver4YouBooking() {
  // Stati per la gestione del flusso di prenotazione
  const [currentStep, setCurrentStep] = useState<BookingStep>("info")
  const [previousSteps, setPreviousSteps] = useState<BookingStep[]>([])
  const [activeUsers, setActiveUsers] = useState(0)
  const [showUserProfileDialog, setShowUserProfileDialog] = useState(false)
  const [showBecomeProviderDialog, setShowBecomeProviderDialog] = useState(false)
  const [showAboutProjectDialog, setShowAboutProjectDialog] = useState(false)
  const [isMobile, setIsMobile] = useState(true)

  // Custom hooks
  const { bookingState, updateBookingState, resetBookingState } = useBookingState()
  const { savedRides, saveRideToHistory, updateRideStatus, deleteRide } = useSavedRides()
  const { userProfile, updateUserProfile, userGender, toggleUserGender } = useUserProfile()
  const { isPro, verifyProPassword } = useProAccess()
  const { cookieConsent, isLoading, acceptCookies, rejectCookies } = useCookieConsent()

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

  // Effetto per simulare utenti attivi (dark pattern)
  useEffect(() => {
    // Genera un numero casuale di utenti attivi tra 3 e 8
    setActiveUsers(Math.floor(Math.random() * 6) + 3)

    // Aggiorna il numero di utenti attivi ogni 30-60 secondi
    const interval = setInterval(
      () => {
        // Aumenta o diminuisci di 1-2 utenti, mantenendo tra 2 e 10
        setActiveUsers((prev) => {
          const change = Math.floor(Math.random() * 3) - 1 // -1, 0, o 1
          const newValue = prev + change
          return Math.max(2, Math.min(10, newValue))
        })
      },
      Math.floor(Math.random() * 30000) + 30000,
    )

    return () => clearInterval(interval)
  }, [])

  // Funzione per gestire la navigazione tra gli step
  const goToStep = (step: BookingStep) => {
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

  // Modifica la funzione handleSelectService per assicurarsi che il tipo di servizio sia correttamente impostato
  const handleSelectService = (serviceType: string) => {
    // Se l'utente seleziona "Diventa Car Sharing", mostra il dialog
    if (serviceType === "become_sharing") {
      setShowBecomeProviderDialog(true)
      return
    }

    // Se l'utente seleziona "Scopri di più", mostra informazioni
    if (serviceType === "about") {
      setShowAboutProjectDialog(true)
      return
    }

    // Trova il nome del servizio
    const serviceTypeName = serviceTypes.find((s) => s.id === serviceType)?.name || ""

    // Aggiorna lo stato della prenotazione
    updateBookingState({
      serviceType,
      serviceTypeName,
      // Resetta alcuni campi quando si cambia servizio
      fromLocation: "",
      toLocation: "",
      multipleStops: [],
      isMultipleStops: serviceType === "multiplo",
    })

    // Vai allo step successivo
    goToStep("partenza")
  }

  // Funzione per gestire la selezione della località di partenza
  const handleSelectDeparture = (location: string) => {
    // Trova il prezzo della località
    const locationObj = locations.find((loc) => loc.name === location)
    const price = locationObj?.price || 0

    // Aggiorna lo stato della prenotazione
    updateBookingState({
      fromLocation: location,
      price: price, // Inizializza il prezzo con il costo della località di partenza
    })

    // Vai allo step successivo
    goToStep("destinazione")
  }

  // Funzione per gestire la selezione della destinazione
  const handleSelectDestination = (location: string) => {
    // Trova il prezzo della località o destinazione speciale
    let price = 0
    const locationObj = locations.find((loc) => loc.name === location)
    const specialDestObj = specialDestinations.find((dest) => dest.name === location)

    if (locationObj) {
      price = locationObj.price
    } else if (specialDestObj) {
      price = specialDestObj.price
    }

    // Aggiorna lo stato della prenotazione
    updateBookingState({
      toLocation: location,
      price: bookingState.price + price, // Aggiungi il prezzo della destinazione
    })

    // Se è un servizio con tappe multiple, vai allo step delle tappe multiple
    if (bookingState.serviceType === "multiplo") {
      goToStep("multiple-stops")
    } else {
      // Altrimenti vai allo step della data
      goToStep("data")
    }
  }

  // Funzione per gestire la richiesta di accesso PRO
  const handleRequestProAccess = () => {
    goToStep("pro-access")
  }

  // Funzione per gestire la prenotazione della corsa
  const handleBookRide = (provider: string) => {
    // Salva la corsa nello storico
    saveRideToHistory(bookingState, provider)

    // Resetta lo stato della prenotazione e torna allo step iniziale
    resetBookingState()
    setCurrentStep("info")
    setPreviousSteps([])
  }

  // Funzione per gestire la prenotazione ripetuta
  const handleBookAgain = (ride: SavedRide) => {
    // Converti la data da stringa a oggetto Date
    const rideDate = ride.date ? new Date(ride.date) : null

    // Popola lo stato della prenotazione con i dati della corsa precedente
    updateBookingState({
      serviceType: ride.serviceType,
      serviceTypeName: ride.serviceTypeName,
      fromLocation: ride.departure,
      toLocation: ride.destination,
      multipleStops: ride.stops?.map((stop) => stop.location) || [],
      date: rideDate,
      time: ride.time,
      passengers: ride.passengers,
      waitingType: ride.waitingType || "No waiting",
      paymentMethod: ride.paymentMethod,
      price: ride.price,
      distance: 0,
      duration: 0,
      isRoundTrip: false,
      isMultipleStops: (ride.stops?.length || 0) > 0,
    })

    // Vai direttamente alla pagina di riepilogo
    setCurrentStep("riepilogo")
    setPreviousSteps(["info", "partenza", "destinazione", "data", "orario", "passeggeri", "waitingType", "pagamento"])
  }

  // Renderizza lo step corrente
  const renderStep = () => {
    switch (currentStep) {
      case "info":
        return <ServiceSelection onSelectService={handleSelectService} activeUsers={activeUsers} />
      case "partenza":
        return <LocationSelection type="departure" onSelectLocation={handleSelectDeparture} />
      case "destinazione":
        return (
          <LocationSelection
            type="destination"
            onSelectLocation={handleSelectDestination}
            serviceType={bookingState.serviceType}
          />
        )
      case "multiple-stops":
        return (
          <MultipleStops
            booking={bookingState}
            updateBooking={updateBookingState}
            onContinue={() => goToStep("data")}
          />
        )
      case "data":
        return (
          <DateTimeSelection
            mode="date"
            booking={bookingState}
            updateBooking={updateBookingState}
            isPro={isPro}
            onContinue={() => goToStep("orario")}
            onRequestProAccess={handleRequestProAccess}
          />
        )
      case "orario":
        return (
          <DateTimeSelection
            mode="time"
            booking={bookingState}
            updateBooking={updateBookingState}
            isPro={isPro}
            onContinue={() => goToStep("passeggeri")}
            onRequestProAccess={handleRequestProAccess}
          />
        )
      case "passeggeri":
        return (
          <PassengersSelection
            booking={bookingState}
            updateBooking={updateBookingState}
            onContinue={() => goToStep("waitingType")}
          />
        )
      case "waitingType":
        return (
          <WaitingSelection
            booking={bookingState}
            updateBooking={updateBookingState}
            onContinue={() => goToStep("pagamento")}
          />
        )
      case "pagamento":
        return (
          <PaymentSelection
            booking={bookingState}
            updateBooking={updateBookingState}
            onContinue={() => goToStep("riepilogo")}
          />
        )
      case "riepilogo":
        return <BookingSummary booking={bookingState} onBookRide={handleBookRide} />
      case "pro-access":
        return (
          <ProAccessRequired
            onVerifyPassword={verifyProPassword}
            onSuccess={() => {
              // Torna allo step precedente dopo aver sbloccato l'accesso PRO
              goBack()
            }}
          />
        )
      default:
        return <ServiceSelection onSelectService={handleSelectService} activeUsers={activeUsers} />
    }
  }

  // Funzione per renderizzare l'indicatore di progresso
  const renderProgressIndicator = () => {
    const steps = [
      { id: "info", label: "Info" },
      { id: "partenza", label: "Partenza" },
      { id: "destinazione", label: "Destinazione" },
      { id: "dettagli", label: "Dettagli" },
    ]

    // Determina lo step attuale per l'indicatore
    let currentProgressStep = "info"
    if (currentStep === "partenza") {
      currentProgressStep = "partenza"
    } else if (currentStep === "destinazione" || currentStep === "multiple-stops") {
      currentProgressStep = "destinazione"
    } else if (
      ["data", "orario", "passeggeri", "waitingType", "pagamento", "riepilogo", "pro-access"].includes(currentStep)
    ) {
      currentProgressStep = "dettagli"
    }

    // Funzione per gestire il click su un indicatore di progresso
    const handleStepClick = (stepId: string) => {
      // Permetti la navigazione solo tra info, partenza e destinazione
      if (stepId === "info" && currentProgressStep !== "info") {
        // Torna all'inizio
        setCurrentStep("info")
        setPreviousSteps([])
      } else if (stepId === "partenza" && currentProgressStep !== "partenza" && bookingState.serviceType) {
        // Vai a partenza solo se è stato selezionato un tipo di servizio
        setCurrentStep("partenza")
        setPreviousSteps(["info"])
      } else if (
        stepId === "destinazione" &&
        currentProgressStep !== "destinazione" &&
        bookingState.fromLocation &&
        bookingState.serviceType
      ) {
        // Vai a destinazione solo se è stata selezionata una località di partenza
        setCurrentStep("destinazione")
        setPreviousSteps(["info", "partenza"])
      }
      // Non permettere di saltare a dettagli direttamente
    }

    return (
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`rounded-full ${
                currentProgressStep === step.id ? "bg-blue-600 text-white" : "bg-[#111c36] text-gray-400"
              } flex items-center justify-center ${isMobile ? "w-12 h-12" : "w-16 h-16"} ${
                step.id === "info" ||
                (step.id === "partenza" && bookingState.serviceType) ||
                (step.id === "destinazione" && bookingState.fromLocation && bookingState.serviceType)
                  ? "cursor-pointer hover:ring-2 hover:ring-blue-400/50"
                  : ""
              }`}
              onClick={() => handleStepClick(step.id)}
            >
              <span className={`${isMobile ? "text-sm" : "text-base"} font-medium`}>{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 ${
                  steps.findIndex((s) => s.id === currentProgressStep) > index ? "bg-blue-600" : "bg-gray-700"
                } ${isMobile ? "w-12" : "w-32"} mx-1`}
              />
            )}
          </div>
        ))}
      </div>
    )
  }

  // Renderizza il messaggio di benvenuto
  const renderWelcomeMessage = () => {
    if (currentStep !== "info") return null

    const isNight = new Date().getHours() >= 20 || new Date().getHours() < 6
    const message = `Ciao ${userProfile.name}! Ancora in giro a quest'ora?`

    return (
      <div className="mb-6 py-2 px-4 bg-[#111c36] rounded-full text-white text-sm inline-block">
        <div className="flex items-center">
          <span>{message}</span>
        </div>
      </div>
    )
  }

  // Se il consenso ai cookie non è stato ancora dato e non è in caricamento, mostra il banner
  return (
    <div className="min-h-screen bg-[#050914] p-4 md:p-8">
      <div className={`mx-auto ${isMobile ? "max-w-md" : "max-w-6xl"}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            {previousSteps.length > 0 && (
              <Button variant="ghost" size="icon" onClick={goBack} className="mr-2 text-white">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="flex items-center">
              <Car className="h-6 w-6 text-blue-500 mr-2" />
              <h1 className="text-2xl font-bold text-white">Driver4You</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Avatar className="h-12 w-12 cursor-pointer bg-[#111c36]" onClick={() => setShowUserProfileDialog(true)}>
              {userProfile.photo ? (
                <AvatarImage src={userProfile.photo || "/placeholder.svg"} alt={userProfile.name} />
              ) : (
                <AvatarFallback className="bg-[#111c36] text-blue-400">
                  <User className="h-6 w-6" />
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        </div>

        {renderProgressIndicator()}
        {renderWelcomeMessage()}

        {/* Main Content */}
        <div className={isMobile ? "" : "grid grid-cols-1 gap-6"}>
          <div className="p-0">{renderStep()}</div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Driver4You © 2025</p>
        </div>
      </div>

      {/* Dialogs */}
      <UserProfileDialog
        open={showUserProfileDialog}
        onOpenChange={setShowUserProfileDialog}
        userProfile={userProfile}
        setUserProfile={updateUserProfile}
        userGender={userGender}
        toggleUserGender={toggleUserGender}
        savedRides={savedRides}
        updateRideStatus={updateRideStatus}
        deleteRide={deleteRide}
        isPro={isPro}
        showProPasswordModal={() => {
          setShowUserProfileDialog(false)
          goToStep("pro-access")
        }}
        onBookAgain={handleBookAgain}
      />

      <BecomeProviderDialog open={showBecomeProviderDialog} onOpenChange={setShowBecomeProviderDialog} />

      <AboutProjectDialog open={showAboutProjectDialog} onOpenChange={setShowAboutProjectDialog} />

      {/* Cookie Banner */}
      {cookieConsent === null && !isLoading && <CookieBanner onAccept={acceptCookies} onReject={rejectCookies} />}
    </div>
  )
}
