"use client"

import { Card } from "@/components/ui/card"
import { Users } from "lucide-react"
import type { BookingState } from "../types"

interface PassengersSelectionProps {
  booking: BookingState
  updateBooking: (updates: Partial<BookingState>) => void
  onContinue: () => void
}

export function PassengersSelection({ booking, updateBooking, onContinue }: PassengersSelectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Seleziona il numero di passeggeri</h2>

      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
          <Card
            key={num}
            className="bg-[#151a29] border-gray-800 hover:border-blue-500 transition-all cursor-pointer"
            onClick={() => {
              updateBooking({ passengers: num })
              onContinue()
            }}
          >
            <div className="p-4 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="font-bold text-white text-lg">{num}</h3>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
