"use client"

import { Badge } from "@/components/ui/badge"
import { MessageCircle, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { waitingTypes } from "../data/waiting-types"
import { carSharingServices } from "../data/car-sharing-services"
import type { BookingState } from "../types"

interface BookingSummaryProps {
  booking: BookingState
  onBookRide: (provider: string) => void
}

export function BookingSummary({ booking, onBookRide }: BookingSummaryProps) {
  // Funzione per creare il messaggio WhatsApp
  const createWhatsAppMessage = () => {
    // Trova i nomi corrispondenti per serviceType e paymentMethod
    const serviceTypeName = booking.serviceType

    // Trova il nome del tipo di attesa
    const waitingTypeName = booking.waitingType

    // Calcola il costo di attesa se è stato selezionato un tipo
    let waitingCostText = ""
    if (booking.waitingType) {
      const waitingType = waitingTypes.find((wt) => wt.name === booking.waitingType)
      if (waitingType) {
        waitingCostText = `\n*Tipo di attesa:* ${waitingType.name} (€${waitingType.minCost}-€${waitingType.maxCost})`
      }
    }

    // Aggiungi le tappe multiple se presenti
    let stopsText = ""
    if (booking.multipleStops.length > 0) {
      stopsText = "\n\n*Tappe aggiuntive:*"
      booking.multipleStops.forEach((stop, index) => {
        stopsText += `\n${index + 1}. ${stop}`
      })
    }

    const message = `
🚗 *RICHIESTA DRIVER4YOU* 🚗

*Servizio:* ${serviceTypeName}
*Partenza:* ${booking.fromLocation}
*Destinazione:* ${booking.toLocation}${stopsText}
*Data:* ${booking.date ? booking.date.toLocaleDateString() : ""}
*Ora:* ${booking.time}
*Passeggeri:* ${booking.passengers}${waitingCostText}
*Pagamento:* ${booking.paymentMethod}
*Prezzo stimato:* €${booking.price.toFixed(2)}

Confermi la richiesta?`

    // Codifica il messaggio per l'URL
    return encodeURIComponent(message)
  }

  // Funzione per aprire WhatsApp con un provider specifico
  const openWhatsApp = (phone?: string) => {
    const message = createWhatsAppMessage()
    const phoneNumber = phone?.replace(/\s+/g, "") || "393335556677" // Rimuove spazi dal numero
    let providerName = "Driver4You"

    // Seleziona il nome del provider in base al provider
    if (phone) {
      const provider = carSharingServices.find((s) => s.phone === phone)
      if (provider) {
        providerName = provider.name
      }
    }

    onBookRide(providerName)
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
  }

  // Funzione per aprire Telegram con un username specifico
  const openTelegram = (username?: string) => {
    const message = createWhatsAppMessage()
    let providerName = "Telegram"

    // Se è specificato un username, usa quello
    if (username) {
      const provider = carSharingServices.find((s) => s.telegram === username)
      if (provider) {
        providerName = provider.name
      }
    }

    onBookRide(providerName)

    // Se un username è fornito, invia direttamente a quell'utente
    if (username) {
      window.open(`https://t.me/${username.replace("@", "")}?text=${message}`, "_blank")
    } else {
      window.open(`https://t.me/share/url?url=&text=${message}`, "_blank")
    }
  }

  // Colori per i provider di car sharing
  const providerColors: Record<string, string> = {
    "Fruttivendolo Car": "bg-green-600 hover:bg-green-700",
    "Movimento Urbano": "bg-blue-600 hover:bg-blue-700",
    "Leon Trasp": "bg-purple-600 hover:bg-purple-700",
    "Bee Trasp": "bg-amber-600 hover:bg-amber-700",
    "Zoro Car": "bg-indigo-600 hover:bg-indigo-700",
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Riepilogo della prenotazione</h2>

      <div className="bg-[#0c1220] rounded-lg">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#1e2c4a]">
            <span className="text-gray-400">Servizio</span>
            <span className="font-medium text-white">{booking.serviceType}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-[#1e2c4a]">
            <span className="text-gray-400">Partenza</span>
            <span className="font-medium text-white">{booking.fromLocation}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-[#1e2c4a]">
            <span className="text-gray-400">Destinazione</span>
            <span className="font-medium text-white">{booking.toLocation}</span>
          </div>

          {/* Mostra le tappe multiple se presenti */}
          {booking.multipleStops.length > 0 && (
            <div className="pb-2 border-b border-[#1e2c4a]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Tappe intermedie</span>
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  {booking.multipleStops.length}
                </Badge>
              </div>
              <div className="space-y-2 pl-2">
                {booking.multipleStops.map((stop, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">
                      {index + 1}. {stop}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pb-2 border-b border-[#1e2c4a]">
            <span className="text-gray-400">Data</span>
            <span className="font-medium text-white">
              {booking.date
                ? booking.date.toLocaleDateString("it-IT", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })
                : ""}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-[#1e2c4a]">
            <span className="text-gray-400">Orario</span>
            <span className="font-medium text-white">{booking.time}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-[#1e2c4a]">
            <span className="text-gray-400">Passeggeri</span>
            <span className="font-medium text-white">{booking.passengers}</span>
          </div>

          {booking.waitingType && (
            <div className="flex justify-between items-center pb-2 border-b border-[#1e2c4a]">
              <span className="text-gray-400">Tipo di attesa</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <span className="font-medium text-white">{booking.waitingType}</span>
                      <Info className="h-4 w-4 ml-1 text-blue-400" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">
                      {waitingTypes.find((wt) => wt.name === booking.waitingType)?.description}
                    </p>
                    <p className="text-xs text-blue-400 mt-1">
                      €{waitingTypes.find((wt) => wt.name === booking.waitingType)?.minCost} - €
                      {waitingTypes.find((wt) => wt.name === booking.waitingType)?.maxCost}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          <div className="flex justify-between items-center pb-2 border-b border-[#1e2c4a]">
            <span className="text-gray-400">Pagamento</span>
            <span className="font-medium text-white">{booking.paymentMethod}</span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-gray-400">Prezzo stimato</span>
            <span className="font-bold text-xl text-white">€{booking.price.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-white">Scegli un servizio di Car Sharing</h3>

        {carSharingServices.map((service) => (
          <button
            key={service.name}
            className={`w-full py-3 px-4 rounded-lg text-white flex items-center justify-center ${
              providerColors[service.name] || "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={() => (service.telegram ? openTelegram(service.telegram) : openWhatsApp(service.phone))}
          >
            <div className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              <span>{service.name}</span>
              {service.telegram && <Badge className="ml-2 bg-blue-500">NUOVO</Badge>}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
