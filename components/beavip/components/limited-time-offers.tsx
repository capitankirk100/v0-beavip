"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, AlertCircle, ArrowRight } from "lucide-react"
import { limitedTimeOffers } from "../data/packages"

interface LimitedTimeOffersProps {
  onSelectOffer: (offerId: string) => void
}

export function LimitedTimeOffers({ onSelectOffer }: LimitedTimeOffersProps) {
  const [activeOffers, setActiveOffers] = useState<any[]>([])
  const [now, setNow] = useState(new Date())

  // Aggiorna il tempo ogni minuto
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  // Calcola il tempo rimanente per ogni offerta
  useEffect(() => {
    const updatedOffers = limitedTimeOffers
      .map((offer) => {
        const endDate = new Date(offer.endDate)

        // Se l'offerta è scaduta, non includerla
        if (endDate <= now) {
          return null
        }

        const diffTime = endDate.getTime() - now.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

        let timeRemaining = ""
        if (diffDays > 0) {
          timeRemaining = `${diffDays} ${diffDays === 1 ? "giorno" : "giorni"} e ${diffHours} ${diffHours === 1 ? "ora" : "ore"}`
        } else if (diffHours > 0) {
          timeRemaining = `${diffHours} ${diffHours === 1 ? "ora" : "ore"}`
        } else {
          const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60))
          timeRemaining = `${diffMinutes} ${diffMinutes === 1 ? "minuto" : "minuti"}`
        }

        // Calcola l'urgenza in base al tempo rimanente (0-100)
        const totalDuration = 7 * 24 * 60 * 60 * 1000 // 7 giorni in millisecondi
        const urgency = Math.max(0, Math.min(100, 100 - (diffTime / totalDuration) * 100))

        return {
          ...offer,
          timeRemaining,
          urgency,
        }
      })
      .filter(Boolean)

    setActiveOffers(updatedOffers)
  }, [now])

  // Se non ci sono offerte attive, non mostrare nulla
  if (activeOffers.length === 0) {
    return null
  }

  return (
    <div className="space-y-4 mb-8">
      <h3 className="text-lg font-bold text-white flex items-center">
        <Clock className="h-4 w-4 text-purple-400 mr-2" />
        Offerte a Tempo Limitato
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeOffers.map((offer) => {
          // Determina il colore del badge in base all'urgenza
          const badgeColor =
            offer.urgency > 75
              ? "from-red-600 to-orange-600"
              : offer.urgency > 50
                ? "from-orange-600 to-amber-600"
                : "from-yellow-600 to-amber-600"

          // Determina il messaggio di urgenza
          let urgencyMessage = ""
          if (offer.urgency > 75) {
            urgencyMessage = "Sta per scadere!"
          } else if (offer.urgency > 50) {
            urgencyMessage = "Affrettati!"
          } else {
            urgencyMessage = "Tempo limitato"
          }

          return (
            <Card
              key={offer.id}
              className={`bg-gradient-to-br from-[#0c1220] to-[#131b30] border ${
                offer.urgency > 75
                  ? "border-red-500/30 hover:border-red-500/50"
                  : "border-yellow-500/30 hover:border-yellow-500/50"
              } transition-all duration-300`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white">{offer.name}</h4>
                    <p className="text-sm text-yellow-300">{offer.description}</p>
                  </div>
                  <Badge className={`bg-gradient-to-r ${badgeColor} ${offer.urgency > 75 ? "animate-pulse" : ""}`}>
                    -{offer.discountPercentage}%
                  </Badge>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div
                    className={`flex items-center ${offer.urgency > 75 ? "text-red-400" : "text-amber-400"} text-xs`}
                  >
                    <AlertCircle className="h-3 w-3 mr-1" />
                    <span className="font-medium">{urgencyMessage}</span>
                    <span className="ml-1">• Scade tra {offer.timeRemaining}</span>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className={`text-xs border ${
                      offer.urgency > 75
                        ? "border-red-500/50 text-red-400 hover:bg-red-950/20"
                        : "border-yellow-500/50 text-yellow-400 hover:bg-yellow-950/20"
                    }`}
                    onClick={() => onSelectOffer(offer.id)}
                  >
                    Approfitta ora <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>

                {offer.minimumPurchase > 0 && (
                  <div className="mt-1 text-xs text-gray-400">Minimo d'ordine: €{offer.minimumPurchase.toFixed(2)}</div>
                )}

                {offer.newCustomersOnly && <div className="mt-1 text-xs text-gray-400">Solo per nuovi clienti</div>}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
