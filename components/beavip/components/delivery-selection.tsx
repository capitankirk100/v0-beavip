"use client"
import { Clock, Info, Sparkles } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { deliveryOptions } from "../data/delivery-options"
import type { OrderState } from "../types"

interface DeliverySelectionProps {
  order: OrderState
  updateOrder: (updates: Partial<OrderState>) => void
  onContinue: () => void
}

export function DeliverySelection({ order, updateOrder, onContinue }: DeliverySelectionProps) {
  // All'inizio del componente DeliverySelection, aggiungi questa funzione
  const getRelevantDeliveryOptions = () => {
    // Per le licenze, mostra solo opzioni di consegna immediate o standard
    if (order.serviceType === "licenses") {
      return deliveryOptions.filter((option) => ["standard", "express", "instant"].includes(option.id))
    }

    // Per i numeri Telegram/WhatsApp, mostra solo opzioni specifiche
    if (order.serviceType === "telegram" || order.serviceType === "whatsapp") {
      return deliveryOptions.filter((option) => ["standard", "express", "instant"].includes(option.id))
    }

    // Per altri servizi, mostra tutte le opzioni
    return deliveryOptions
  }

  // Calcola il nuovo prezzo in base all'opzione di consegna
  const calculatePrice = (deliveryId: string) => {
    // Trova l'opzione di consegna selezionata
    const selectedOption = deliveryOptions.find((opt) => opt.id === deliveryId)
    if (!selectedOption) return order.price

    // Se è un numero Telegram o una licenza, applichiamo solo il prezzo fisso
    if (order.serviceType === "telegram" || order.serviceType === "licenses" || order.serviceType === "whatsapp") {
      return order.price + selectedOption.price
    }

    // Per altri servizi, calcoliamo il prezzo base senza moltiplicatore di consegna
    const basePrice =
      order.price /
      (order.deliveryOption ? deliveryOptions.find((opt) => opt.id === order.deliveryOption)?.multiplier || 1 : 1)

    // Applichiamo il nuovo moltiplicatore e aggiungiamo il prezzo fisso
    return basePrice * selectedOption.multiplier + selectedOption.price
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center">
        <Sparkles className="h-5 w-5 text-purple-400 mr-2" />
        Seleziona il tempo di consegna
      </h2>
      <p className="text-sm text-purple-300">
        Scegli quanto velocemente vuoi ricevere i tuoi {order.serviceName.toLowerCase()}. Tempi di consegna più rapidi
        hanno un costo maggiore.
      </p>

      <div className="grid grid-cols-1 gap-3">
        {getRelevantDeliveryOptions().map((option) => (
          <div
            key={option.id}
            className="bg-gradient-to-br from-[#0c1220] to-[#131b30] rounded-xl cursor-pointer hover:shadow-lg hover:shadow-purple-900/20 transition-all duration-300 border border-gray-800 hover:border-purple-500/50"
            onClick={() => {
              updateOrder({
                deliveryOption: option.id,
                deliveryName: option.name,
                deliveryTimeDescription: option.timeDescription,
                price: calculatePrice(option.id),
              })
              onContinue()
            }}
          >
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center mr-4 shadow-md">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-lg">{option.name}</h3>
                    <p className="text-sm text-purple-300">{option.description}</p>
                    <div className="flex items-center mt-1">
                      <p className="text-xs text-gray-300 mr-2">{option.timeDescription}</p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">
                              {option.price > 0
                                ? `Costo aggiuntivo: +€${option.price.toFixed(2)}`
                                : option.price === 0
                                  ? "Nessun costo aggiuntivo"
                                  : "Errore: il prezzo non dovrebbe essere negativo"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-medium bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                    {option.price > 0 && `+€${option.price.toFixed(2)}`}
                    {option.price === 0 && "Incluso"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gradient-to-r from-[#151a29] to-[#1c2136] rounded-xl shadow-inner">
        <div className="flex items-center mb-1">
          <Info className="h-4 w-4 text-purple-400 mr-2" />
          <h4 className="text-sm font-medium text-white">Cos'è il tempo di consegna?</h4>
        </div>
        <p className="text-xs text-gray-300">
          Il tempo di consegna determina quanto velocemente riceverai i tuoi {order.serviceName.toLowerCase()}. Tempi di
          consegna più rapidi hanno un costo maggiore, mentre tempi più lunghi possono apparire più naturali e sono più
          economici. Scegli l'opzione che meglio si adatta alle tue esigenze.
        </p>
      </div>
    </div>
  )
}
