"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Plus, Trash2 } from "lucide-react"
import { locations } from "../data/locations"
import type { BookingState, Stop } from "../types"

interface MultipleStopsProps {
  booking: BookingState
  updateBooking: (updates: Partial<BookingState>) => void
  onContinue: () => void
}

export function MultipleStops({ booking, updateBooking, onContinue }: MultipleStopsProps) {
  const [newStopLocation, setNewStopLocation] = useState<string>("")

  // Aggiungere funzione per aggiungere una tappa
  const addStop = () => {
    if (!newStopLocation) return

    // Trova il prezzo della località
    const locationObj = locations.find((loc) => loc.name === newStopLocation)
    if (!locationObj) return

    const newStop: Stop = {
      location: newStopLocation,
      price: locationObj.price,
    }

    updateBooking({
      multipleStops: [...booking.multipleStops, newStop.location],
    })

    // Resetta il campo di input
    setNewStopLocation("")
  }

  // Aggiungere funzione per rimuovere una tappa
  const removeStop = (index: number) => {
    updateBooking({
      multipleStops: booking.multipleStops.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-xl font-bold text-white">Aggiungi tappe intermedie</h2>
      <p className="text-sm text-gray-400">
        Aggiungi le tappe intermedie del tuo viaggio. Puoi aggiungere fino a 5 tappe.
      </p>

      {/* Lista delle tappe già aggiunte */}
      {booking.multipleStops.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white">Tappe selezionate:</h3>
          {booking.multipleStops.map((stop, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-[#151a29] border border-gray-800 rounded-lg"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center mr-3">
                  <MapPin className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-white text-sm">{stop}</p>
                  <p className="text-xs text-blue-400">
                    €{(locations.find((loc) => loc.name === stop)?.price || 0).toFixed(2)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                onClick={() => removeStop(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Selettore di nuove tappe */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-white">Aggiungi una nuova tappa:</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {locations.map((location) => (
            <Card
              key={location.id}
              className={`bg-[#151a29] border-gray-800 hover:border-blue-500 transition-all cursor-pointer ${
                newStopLocation === location.name ? "border-blue-500 ring-1 ring-blue-500" : ""
              }`}
              onClick={() => setNewStopLocation(location.name)}
            >
              <div className="p-3 flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center mb-1">
                  <MapPin className="h-4 w-4 text-blue-400" />
                </div>
                <h3 className="font-medium text-white text-xs">{location.name}</h3>
                <p className="text-xs text-blue-400">€{location.price.toFixed(2)}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex space-x-2 mt-4">
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={addStop}
            disabled={!newStopLocation || booking.multipleStops.length >= 5}
          >
            <Plus className="h-4 w-4 mr-2" />
            Aggiungi tappa
          </Button>
          <Button className="flex-1" variant="outline" onClick={onContinue}>
            Continua
          </Button>
        </div>

        {booking.multipleStops.length >= 5 && (
          <p className="text-xs text-yellow-500">Hai raggiunto il numero massimo di tappe (5).</p>
        )}
      </div>
    </div>
  )
}
