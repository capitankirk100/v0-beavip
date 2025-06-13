"use client"

import { MapPin } from "lucide-react"
import { locations } from "../data/locations"
import { specialDestinations } from "../data/special-destinations"

// Raggruppa le località per zona
const locationsByZone = {
  vicini: locations.filter((loc) => loc.zone === "vicini"),
  medi: locations.filter((loc) => loc.zone === "medi"),
  lontani: locations.filter((loc) => loc.zone === "lontani"),
}

// Mappa i tipi di servizio ai loro corrispondenti tipi nelle destinazioni speciali
const serviceTypeMapping: Record<string, string> = {
  standard: "standard",
  discoteca: "discoteca",
  ristorante: "ristorante",
  aeroporto: "aeroporto",
  multiplo: "multiplo",
  visita: "visita",
  cantina: "cantina",
  universita: "universita",
  casariposo: "casariposo",
  sport: "sport",
  terme: "terme",
  sagre: "sagre",
  escursioni: "escursioni",
  station: "station",
  centri_commerciali: "centri_commerciali",
  piste_sci: "piste_sci",
  matrimoni: "matrimoni",
  concerti: "concerti",
  spesa: "spesa",
  business: "business",
  gruppi: "gruppi",
  animali: "animali",
  cinema: "cinema",
  bagagli: "bagagli",
}

interface LocationSelectionProps {
  type: "departure" | "destination"
  onSelectLocation: (location: string) => void
  serviceType?: string
}

export function LocationSelection({ type, onSelectLocation, serviceType }: LocationSelectionProps) {
  const title = type === "departure" ? "Seleziona la tua località" : "Seleziona la destinazione"

  // Determina il tipo di destinazione speciale da filtrare
  const specialDestType = serviceType ? serviceTypeMapping[serviceType] || serviceType : ""

  // Filtra le destinazioni speciali in base al tipo di servizio
  const filteredSpecialDestinations = specialDestinations.filter((dest) => dest.type === specialDestType)

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-xl font-bold text-white">{title}</h2>

      {type === "destination" && serviceType && serviceType !== "standard" && serviceType !== "multiplo" && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Destinazioni speciali</h3>
          <div className="grid grid-cols-2 gap-3">
            {filteredSpecialDestinations.length > 0 ? (
              filteredSpecialDestinations.map((destination) => (
                <div
                  key={destination.id}
                  className="bg-[#0c1220] rounded-lg cursor-pointer hover:bg-[#0f1628] transition-all"
                  onClick={() => onSelectLocation(destination.name)}
                >
                  <div className="p-4 flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-full bg-[#111c36] flex items-center justify-center mb-2">
                      <MapPin className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="font-medium text-white text-sm">{destination.name}</h3>
                    <p className="text-xs text-blue-400 mt-1">€{destination.price.toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-4 bg-[#151a29] border border-gray-800 rounded-lg text-center">
                <p className="text-gray-400">Nessuna destinazione speciale disponibile per questo servizio.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3">Vicini (0-10€)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {locationsByZone.vicini.map((location) => (
              <div
                key={location.id}
                className="bg-[#0c1220] rounded-lg cursor-pointer hover:bg-[#0f1628] transition-all"
                onClick={() => onSelectLocation(location.name)}
              >
                <div className="p-4 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-[#111c36] flex items-center justify-center mb-2">
                    <MapPin className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="font-medium text-white text-sm">{location.name}</h3>
                  {location.price > 0 && <p className="text-xs text-blue-400 mt-1">€{location.price.toFixed(2)}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3">Medi (11-30€)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {locationsByZone.medi.map((location) => (
              <div
                key={location.id}
                className="bg-[#0c1220] rounded-lg cursor-pointer hover:bg-[#0f1628] transition-all"
                onClick={() => onSelectLocation(location.name)}
              >
                <div className="p-4 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-[#111c36] flex items-center justify-center mb-2">
                    <MapPin className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="font-medium text-white text-sm">{location.name}</h3>
                  <p className="text-xs text-blue-400 mt-1">€{location.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3">Lontani (31€+)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {locationsByZone.lontani.map((location) => (
              <div
                key={location.id}
                className="bg-[#0c1220] rounded-lg cursor-pointer hover:bg-[#0f1628] transition-all"
                onClick={() => onSelectLocation(location.name)}
              >
                <div className="p-4 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-[#111c36] flex items-center justify-center mb-2">
                    <MapPin className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="font-medium text-white text-sm">{location.name}</h3>
                  <p className="text-xs text-blue-400 mt-1">€{location.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
