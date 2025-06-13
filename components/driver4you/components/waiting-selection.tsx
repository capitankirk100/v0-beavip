"use client"

import { Clock, Info } from "lucide-react"
import { waitingTypes } from "../data/waiting-types"
import type { BookingState } from "../types"

interface WaitingSelectionProps {
  booking: BookingState
  updateBooking: (updates: Partial<BookingState>) => void
  onContinue: () => void
}

export function WaitingSelection({ booking, updateBooking, onContinue }: WaitingSelectionProps) {
  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-xl font-bold text-white">Seleziona il tipo di attesa</h2>
      <p className="text-sm text-gray-400">
        Scegli il tipo di attesa che prevedi per il tuo viaggio. Questo influenzerà il costo finale del servizio.
      </p>

      <div className="grid grid-cols-1 gap-3">
        {waitingTypes.map((waitingType) => (
          <div
            key={waitingType.id}
            className="bg-[#0c1220] rounded-lg cursor-pointer hover:bg-[#0f1628] transition-all"
            onClick={() => {
              updateBooking({
                waitingType: waitingType.name,
                // Aggiorna il prezzo considerando il costo di attesa
                price: booking.price + (waitingType.minCost + waitingType.maxCost) / 2,
              })
              onContinue()
            }}
          >
            <div className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#111c36] flex items-center justify-center mr-3">
                  <Clock className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{waitingType.name}</h3>
                  <p className="text-xs text-gray-400">{waitingType.description}</p>
                  <p className="text-xs text-blue-400 mt-1">
                    €{waitingType.minCost} - €{waitingType.maxCost}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-[#111c36] border border-[#1e2c4a] rounded-lg">
        <div className="flex items-center mb-1">
          <Info className="h-4 w-4 text-blue-400 mr-2" />
          <h4 className="text-sm font-medium text-white">Cos'è il tipo di attesa?</h4>
        </div>
        <p className="text-xs text-gray-300">
          Il tipo di attesa determina quanto tempo l'autista dovrà aspettarti durante il servizio. Ad esempio, per una
          discoteca potrebbe essere necessaria un'attesa lunga, mentre per un aeroporto potrebbe non essere necessaria
          alcuna attesa. Il costo dell'attesa viene aggiunto al prezzo finale.
        </p>
      </div>
    </div>
  )
}
