"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Clock, Lock, Sun, SunDim, Moon } from "lucide-react"
import type { BookingState } from "../types"

interface DateTimeSelectionProps {
  mode?: "date" | "time"
  booking: BookingState
  updateBooking: (updates: Partial<BookingState>) => void
  isPro: boolean
  onContinue: () => void
  onRequestProAccess: () => void
}

export function DateTimeSelection({
  mode = "date",
  booking,
  updateBooking,
  isPro,
  onContinue,
  onRequestProAccess,
}: DateTimeSelectionProps) {
  const [customDate, setCustomDate] = useState<string>("")
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<"mattina" | "pomeriggio" | "sera" | "notte">("sera")

  if (mode === "date") {
    // Genera le date disponibili (oggi + 5 giorni successivi per utenti standard)
    const dates = [
      { date: "Oggi", value: new Date().toISOString().split("T")[0] },
      { date: "Domani", value: new Date(Date.now() + 86400000).toISOString().split("T")[0] },
      { date: "Dopodomani", value: new Date(Date.now() + 172800000).toISOString().split("T")[0] },
      { date: "Fra 3 giorni", value: new Date(Date.now() + 259200000).toISOString().split("T")[0] },
      { date: "Fra 4 giorni", value: new Date(Date.now() + 345600000).toISOString().split("T")[0] },
      { date: "Fra 5 giorni", value: new Date(Date.now() + 432000000).toISOString().split("T")[0] },
    ]

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Seleziona data</h2>

        <div className="grid grid-cols-2 gap-3">
          {dates.map((dateOption) => (
            <Card
              key={dateOption.date}
              className="bg-[#0c1220] border-gray-800 hover:border-blue-500 transition-all cursor-pointer"
              onClick={() => {
                updateBooking({ date: new Date(dateOption.value) })
                onContinue()
              }}
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-[#111c36] flex items-center justify-center mb-2">
                  <CalendarIcon className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="font-medium text-white text-sm">{dateOption.date}</h3>
                <p className="text-xs text-gray-400">
                  {new Date(dateOption.value).toLocaleDateString("it-IT", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Data personalizzata per utenti PRO - Design migliorato */}
        <Card className="bg-[#0c1220] border-gray-800 mt-4">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-[#111c36] flex items-center justify-center mr-3">
                <CalendarIcon className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-white text-sm flex items-center">
                  Data personalizzata <Badge className="ml-2 bg-blue-600">PRO</Badge>
                </h3>
                <p className="text-xs text-gray-400">Seleziona una data specifica per la tua prenotazione</p>
              </div>
            </div>

            {isPro ? (
              <div className="space-y-3">
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                />
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    if (customDate) {
                      updateBooking({ date: new Date(customDate) })
                      onContinue()
                    }
                  }}
                  disabled={!customDate}
                >
                  Seleziona questa data
                </Button>
              </div>
            ) : (
              <Button className="w-full mt-2 bg-[#1e3a8a] hover:bg-blue-800 text-white" onClick={onRequestProAccess}>
                <Lock className="h-4 w-4 mr-2" />
                Sblocca funzionalità PRO
              </Button>
            )}
          </div>
        </Card>
      </div>
    )
  } else {
    // Modalità selezione orario
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Seleziona orario</h2>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white">Fasce orarie</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card
              className={`bg-[#0c1220] border-gray-800 hover:border-blue-500 transition-all cursor-pointer ${
                selectedTimeOfDay === "mattina" ? "border-blue-500 ring-2 ring-blue-500/20" : ""
              }`}
              onClick={() => {
                setSelectedTimeOfDay("mattina")
                updateBooking({ time: "09:00" })
              }}
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-[#111c36] flex items-center justify-center mb-2">
                  <Sun className="h-5 w-5 text-yellow-400" />
                </div>
                <h3 className="font-medium text-white text-sm">Mattina</h3>
                <p className="text-xs text-gray-400">06:00 - 12:00</p>
              </div>
            </Card>

            <Card
              className={`bg-[#0c1220] border-gray-800 hover:border-blue-500 transition-all cursor-pointer ${
                selectedTimeOfDay === "pomeriggio" ? "border-blue-500 ring-2 ring-blue-500/20" : ""
              }`}
              onClick={() => {
                setSelectedTimeOfDay("pomeriggio")
                updateBooking({ time: "15:00" })
              }}
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-[#111c36] flex items-center justify-center mb-2">
                  <SunDim className="h-5 w-5 text-orange-400" />
                </div>
                <h3 className="font-medium text-white text-sm">Pomeriggio</h3>
                <p className="text-xs text-gray-400">12:00 - 18:00</p>
              </div>
            </Card>

            <Card
              className={`bg-[#0c1220] border-gray-800 hover:border-blue-500 transition-all cursor-pointer ${
                selectedTimeOfDay === "sera" ? "border-blue-500 ring-2 ring-blue-500/20" : ""
              }`}
              onClick={() => {
                setSelectedTimeOfDay("sera")
                updateBooking({ time: "20:00" })
              }}
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-[#111c36] flex items-center justify-center mb-2">
                  <Moon className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="font-medium text-white text-sm">Sera</h3>
                <p className="text-xs text-gray-400">18:00 - 00:00</p>
              </div>
            </Card>

            <Card
              className={`bg-[#0c1220] border-gray-800 hover:border-blue-500 transition-all cursor-pointer ${
                selectedTimeOfDay === "notte" ? "border-blue-500 ring-2 ring-blue-500/20" : ""
              }`}
              onClick={() => {
                setSelectedTimeOfDay("notte")
                updateBooking({ time: "03:00" })
              }}
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-[#111c36] flex items-center justify-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-indigo-400"
                  >
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                </div>
                <h3 className="font-medium text-white text-sm">Notte</h3>
                <p className="text-xs text-gray-400">00:00 - 06:00</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Nuovo selettore di orario preciso - SOLO PER UTENTI PRO */}
        <div className="space-y-4 mt-6">
          <h3 className="text-sm font-medium text-white flex items-center">
            Orario preciso <Badge className="ml-2 bg-blue-600">PRO</Badge>
          </h3>

          {isPro ? (
            <Card className="bg-[#0c1220] border-gray-800">
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#111c36] flex items-center justify-center mr-3">
                    <Clock className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-sm">Seleziona un orario specifico</h3>
                    <p className="text-xs text-gray-400">Inserisci l'ora e i minuti esatti</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="hour-select" className="text-xs text-gray-400 mb-1 block">
                      Ora
                    </Label>
                    <Select
                      defaultValue="19"
                      onValueChange={(value) => {
                        const currentTime = booking.time || "19:00"
                        const newTime = `${value}:${currentTime.split(":")[1] || "00"}`
                        updateBooking({ time: newTime })
                      }}
                    >
                      <SelectTrigger id="hour-select" className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Ora" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")).map((hour) => (
                          <SelectItem key={hour} value={hour}>
                            {hour}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="minute-select" className="text-xs text-gray-400 mb-1 block">
                      Minuti
                    </Label>
                    <Select
                      defaultValue="00"
                      onValueChange={(value) => {
                        const currentTime = booking.time || "19:00"
                        const newTime = `${currentTime.split(":")[0] || "19"}:${value}`
                        updateBooking({ time: newTime })
                      }}
                    >
                      <SelectTrigger id="minute-select" className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Minuti" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        {Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, "0")).map((minute) => (
                          <SelectItem key={minute} value={minute}>
                            {minute}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-[#0c1220] border-gray-800">
              <div className="p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#111c36] flex items-center justify-center mr-3">
                    <Lock className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white text-sm">Funzionalità PRO</h3>
                    <p className="text-xs text-gray-400">Abbonati a Driver4You per selezionare orari precisi</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2 bg-[#1e3a8a] hover:bg-blue-800 text-white border-0"
                    onClick={onRequestProAccess}
                  >
                    Sblocca
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4" onClick={onContinue}>
          Continua
        </Button>
      </div>
    )
  }
}
