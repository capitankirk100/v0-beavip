"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Check, TrendingUp, Info } from "lucide-react"
import { upsellingRecommendations } from "../data/packages"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { OrderState, ComplementaryService } from "../types"

interface UpsellingRecommendationsProps {
  order: OrderState
  updateOrder: (updates: Partial<OrderState>) => void
  onContinue: () => void
  onSkip: () => void
}

export function UpsellingRecommendations({ order, updateOrder, onContinue, onSkip }: UpsellingRecommendationsProps) {
  const [selectedRecommendations, setSelectedRecommendations] = useState<string[]>([])
  const [complementaryDetails, setComplementaryDetails] = useState<Record<string, { url?: string; username?: string }>>(
    {},
  )
  const [showDetailsForm, setShowDetailsForm] = useState(false)

  // Determina quali raccomandazioni mostrare in base al servizio selezionato
  const getRecommendations = () => {
    const serviceType = order.serviceType

    // Se è un pacchetto o abbonamento, non mostrare raccomandazioni
    if (order.isPackage || order.isSubscription) {
      return []
    }

    // Cerca raccomandazioni specifiche per il tipo di servizio
    if (serviceType === "telegramShop") {
      return upsellingRecommendations.telegramShop || []
    } else if (serviceType === "telegram") {
      return upsellingRecommendations.telegram || []
    } else if (serviceType === "telegramMembers") {
      return upsellingRecommendations.telegramMembers || []
    } else if (serviceType === "followers") {
      return upsellingRecommendations.followers || []
    } else if (serviceType === "likes") {
      return upsellingRecommendations.likes || []
    } else if (serviceType === "views") {
      return upsellingRecommendations.views || []
    } else if (serviceType === "youtubeServices") {
      return upsellingRecommendations.youtubeServices || []
    } else if (serviceType === "views" && order.platform === "tiktok") {
      return upsellingRecommendations.tiktokViews || []
    } else if (serviceType === "licenses") {
      return upsellingRecommendations.licenses || []
    }

    return []
  }

  const recommendations = getRecommendations()

  // Se non ci sono raccomandazioni, salta questo step
  if (recommendations.length === 0) {
    onSkip()
    return null
  }

  // Funzione per selezionare/deselezionare una raccomandazione
  const toggleRecommendation = (serviceType: string) => {
    if (selectedRecommendations.includes(serviceType)) {
      setSelectedRecommendations(selectedRecommendations.filter((id) => id !== serviceType))

      // Rimuovi i dettagli per questo servizio
      const updatedDetails = { ...complementaryDetails }
      delete updatedDetails[serviceType]
      setComplementaryDetails(updatedDetails)
    } else {
      setSelectedRecommendations([...selectedRecommendations, serviceType])

      // Inizializza i dettagli per questo servizio
      setComplementaryDetails({
        ...complementaryDetails,
        [serviceType]: { url: "", username: "" },
      })
    }
  }

  // Funzione per aggiornare i dettagli di un servizio complementare
  const updateComplementaryDetail = (serviceType: string, field: "url" | "username", value: string) => {
    setComplementaryDetails({
      ...complementaryDetails,
      [serviceType]: {
        ...complementaryDetails[serviceType],
        [field]: value,
      },
    })
  }

  // Funzione per procedere alla raccolta dei dettagli
  const proceedToDetails = () => {
    if (selectedRecommendations.length > 0) {
      setShowDetailsForm(true)
    } else {
      onSkip()
    }
  }

  // Funzione per continuare con le raccomandazioni selezionate
  const handleContinue = () => {
    // Se non ci sono raccomandazioni selezionate, salta
    if (selectedRecommendations.length === 0) {
      onSkip()
      return
    }

    // Calcola il prezzo totale includendo le raccomandazioni
    const additionalPrice = recommendations
      .filter((rec) => selectedRecommendations.includes(rec.serviceType))
      .reduce((total, rec) => total + rec.price, 0)

    // Crea un array di servizi complementari selezionati con i dettagli
    const selectedServices: ComplementaryService[] = recommendations
      .filter((rec) => selectedRecommendations.includes(rec.serviceType))
      .map((rec) => ({
        serviceType: rec.serviceType,
        name: rec.name,
        description: rec.description,
        price: rec.price,
        url: complementaryDetails[rec.serviceType]?.url || "",
        username: complementaryDetails[rec.serviceType]?.username || "",
      }))

    // Aggiorna l'ordine con le raccomandazioni selezionate
    updateOrder({
      price: order.price + additionalPrice,
      complementaryServices: selectedServices,
    })

    onContinue()
  }

  // Se stiamo mostrando il form per i dettagli
  if (showDetailsForm) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Info className="h-5 w-5 text-purple-400 mr-2" />
          Dettagli Servizi Complementari
        </h2>

        <p className="text-gray-300">
          Per completare l'aggiunta dei servizi complementari, fornisci i dettagli necessari:
        </p>

        <div className="space-y-6">
          {selectedRecommendations.map((serviceType) => {
            const service = recommendations.find((rec) => rec.serviceType === serviceType)
            if (!service) return null

            return (
              <Card
                key={serviceType}
                className="bg-gradient-to-br from-[#0c1220] to-[#131b30] border border-purple-500/30"
              >
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-bold text-white text-lg">{service.name}</h3>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor={`${serviceType}-url`} className="text-gray-300">
                        URL o Link
                      </Label>
                      <Input
                        id={`${serviceType}-url`}
                        placeholder="https://..."
                        value={complementaryDetails[serviceType]?.url || ""}
                        onChange={(e) => updateComplementaryDetail(serviceType, "url", e.target.value)}
                        className="bg-[#151a29] border-gray-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`${serviceType}-username`} className="text-gray-300">
                        Username o Profilo
                      </Label>
                      <Input
                        id={`${serviceType}-username`}
                        placeholder="@username"
                        value={complementaryDetails[serviceType]?.username || ""}
                        onChange={(e) => updateComplementaryDetail(serviceType, "username", e.target.value)}
                        className="bg-[#151a29] border-gray-700 text-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="flex flex-col space-y-3 mt-6">
          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-medium text-lg shadow-lg transition-all duration-200"
            onClick={handleContinue}
          >
            Continua con i servizi aggiuntivi
          </Button>

          <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={onSkip}>
            Salta e continua senza servizi aggiuntivi
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center">
        <TrendingUp className="h-5 w-5 text-purple-400 mr-2" />
        Servizi Complementari Consigliati
      </h2>

      <p className="text-gray-300">
        Basandoci sulla tua selezione, ti consigliamo questi servizi aggiuntivi per massimizzare i risultati:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => (
          <Card
            key={rec.serviceType}
            className={`bg-gradient-to-br from-[#0c1220] to-[#131b30] border ${
              selectedRecommendations.includes(rec.serviceType)
                ? "border-purple-500 shadow-lg shadow-purple-500/20"
                : "border-gray-800 hover:border-purple-500/50"
            } cursor-pointer transition-all duration-300`}
            onClick={() => toggleRecommendation(rec.serviceType)}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white text-lg">{rec.name}</h3>
                  <p className="text-sm text-purple-300">{rec.description}</p>
                </div>
                <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600">€{rec.price.toFixed(2)}</Badge>
              </div>

              {selectedRecommendations.includes(rec.serviceType) ? (
                <div className="mt-4 flex items-center text-green-400 text-sm">
                  <Check className="h-4 w-4 mr-1" />
                  Aggiunto al tuo ordine
                </div>
              ) : (
                <div className="mt-4 flex items-center text-purple-300 text-sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Aggiungi al tuo ordine
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col space-y-3 mt-6">
        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-medium text-lg shadow-lg transition-all duration-200"
          onClick={proceedToDetails}
        >
          {selectedRecommendations.length > 0
            ? `Continua con ${selectedRecommendations.length} servizi aggiuntivi`
            : "Continua senza servizi aggiuntivi"}
        </Button>

        {selectedRecommendations.length > 0 && (
          <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={onSkip}>
            Salta e continua senza servizi aggiuntivi
          </Button>
        )}
      </div>
    </div>
  )
}
