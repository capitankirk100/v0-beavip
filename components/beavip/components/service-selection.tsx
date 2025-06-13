"use client"

import { serviceTypes } from "../data/service-types"
import { Sparkles } from "lucide-react"

interface ServiceSelectionProps {
  onSelectService: (serviceType: string, serviceName: string) => void
}

export function ServiceSelection({ onSelectService }: ServiceSelectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center">
        <Sparkles className="h-5 w-5 text-purple-400 mr-2" />
        Seleziona il tipo di servizio
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {serviceTypes.map((service) => (
          <div
            key={service.id}
            className="bg-gradient-to-br from-[#0c1220] to-[#131b30] rounded-xl p-6 cursor-pointer hover:shadow-lg hover:shadow-purple-900/20 transition-all duration-300 border border-gray-800 hover:border-purple-500/50"
            onClick={() => onSelectService(service.id, service.name)}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center mb-4 shadow-md">
                <div className="text-white">{service.icon}</div>
              </div>
              <h3 className="font-medium text-white text-lg mb-1">{service.name}</h3>
              <p className="text-xs text-purple-300">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
