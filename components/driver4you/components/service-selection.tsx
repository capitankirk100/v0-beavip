"use client"

import { serviceTypes } from "../data/service-types"
import { Users } from "lucide-react"

interface ServiceSelectionProps {
  onSelectService: (serviceType: string) => void
  activeUsers: number
}

export function ServiceSelection({ onSelectService, activeUsers }: ServiceSelectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Seleziona il tipo di servizio</h2>
      <div className="grid grid-cols-2 gap-4">
        {serviceTypes.map((service) => (
          <div
            key={service.id}
            className="bg-[#0c1220] rounded-lg p-6 cursor-pointer hover:bg-[#0f1628] transition-all"
            onClick={() => onSelectService(service.id)}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#111c36] flex items-center justify-center mb-4">
                <div className="text-white">{service.icon}</div>
              </div>
              <h3 className="font-medium text-white text-sm">{service.name}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Notifica di utenti attivi (dark pattern) */}
      {activeUsers > 0 && (
        <div className="mt-4 p-3 bg-[#111c36] border border-[#1e2c4a] rounded-lg text-white text-sm animate-pulse">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-blue-400" />
            <span>{activeUsers} utenti stanno prenotando in questo momento</span>
          </div>
        </div>
      )}
    </div>
  )
}
