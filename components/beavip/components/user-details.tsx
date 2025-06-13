"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AtSign, LinkIcon, Phone, Sparkles, Users, Eye, Play, Twitch, Globe, Youtube } from "lucide-react"
import type { OrderState } from "../types"

interface UserDetailsProps {
  order: OrderState
  updateOrder: (updates: Partial<OrderState>) => void
  onContinue: () => void
}

export function UserDetails({ order, updateOrder, onContinue }: UserDetailsProps) {
  const [username, setUsername] = useState(order.username || "")
  const [url, setUrl] = useState(order.url || "")
  const [errors, setErrors] = useState({ username: false, url: false })

  // Modifichiamo la funzione handleSubmit per verificare che i campi richiesti siano compilati
  const handleSubmit = () => {
    // Se è un servizio che non richiede username e URL, passiamo direttamente
    if (
      order.serviceType === "telegram" ||
      order.serviceType === "whatsapp" ||
      order.serviceType === "telegramMembers" ||
      order.serviceType === "telegramViews" ||
      order.serviceType === "liveStream" ||
      order.serviceType === "twitchServices" ||
      order.serviceType === "youtubeServices" ||
      order.serviceType === "websiteVisits" ||
      order.serviceType === "licenses"
    ) {
      updateOrder({})
      onContinue()
      return
    }

    const newErrors = {
      username: !username.trim(),
      url: !url.trim(),
    }

    setErrors(newErrors)

    if (!newErrors.username && !newErrors.url) {
      updateOrder({ username, url })
      onContinue()
    }
  }

  // Funzione per ottenere l'icona appropriata in base al tipo di servizio
  const getServiceIcon = () => {
    if (order.serviceType === "telegram") return <Phone className="h-6 w-6 text-white" />
    if (order.serviceType === "whatsapp") return <Phone className="h-6 w-6 text-white" />
    if (order.serviceType === "telegramMembers") return <Users className="h-6 w-6 text-white" />
    if (order.serviceType === "telegramViews") return <Eye className="h-6 w-6 text-white" />
    if (order.serviceType === "liveStream") return <Play className="h-6 w-6 text-white" />
    if (order.serviceType === "twitchServices") return <Twitch className="h-6 w-6 text-white" />
    if (order.serviceType === "youtubeServices") return <Youtube className="h-6 w-6 text-white" />
    if (order.serviceType === "websiteVisits") return <Globe className="h-6 w-6 text-white" />
    return <Users className="h-6 w-6 text-white" />
  }

  // Funzione per ottenere la descrizione appropriata in base al tipo di servizio
  const getServiceDescription = () => {
    if (order.serviceType === "telegram") {
      return order.isRental
        ? `Noleggio di ${order.quantity} ${order.quantity === 1 ? "numero" : "numeri"} per ${order.rentalDuration} ${order.rentalDuration === 1 ? "mese" : "mesi"}`
        : `Acquisto di ${order.quantity} ${order.quantity === 1 ? "numero" : "numeri"}`
    }
    if (order.serviceType === "whatsapp") {
      return order.isRental
        ? `Noleggio di ${order.quantity} ${order.quantity === 1 ? "numero" : "numeri"} per ${order.rentalDuration} ${order.rentalDuration === 1 ? "mese" : "mesi"}`
        : `Acquisto di ${order.quantity} ${order.quantity === 1 ? "numero" : "numeri"}`
    }
    if (order.serviceType === "telegramMembers") {
      return `${order.quantity} membri per il tuo canale Telegram - ${order.serviceSubtypeName}`
    }
    if (order.serviceType === "telegramViews") {
      return `${order.quantity} visualizzazioni per i tuoi post Telegram - ${order.serviceSubtypeName}`
    }
    if (order.serviceType === "liveStream") {
      return `Streaming live di ${order.duration} minuti con 100% di spettatori simultanei`
    }
    if (order.serviceType === "twitchServices") {
      if (order.serviceSubtype === "followers") {
        return `${order.quantity} followers per il tuo canale Twitch`
      } else {
        return `Live Plays di ${order.duration} minuti per il tuo canale Twitch`
      }
    }
    if (order.serviceType === "youtubeServices") {
      if (order.serviceSubtype === "viewsHQ" || order.serviceSubtype?.includes("viewsHQ")) {
        return `${order.quantity} visualizzazioni HQ per il tuo video YouTube - ${order.serviceSubtypeName}`
      } else if (order.serviceSubtype === "likes") {
        return `${order.quantity} likes per il tuo video YouTube`
      } else if (order.serviceSubtype === "comments") {
        return `${order.quantity} commenti personalizzati per il tuo video YouTube`
      } else if (order.serviceSubtype === "subscribers") {
        return `${order.quantity} iscritti per il tuo canale YouTube`
      }
    }
    if (order.serviceType === "websiteVisits") {
      return `${order.quantity} visite al tuo sito web da ${order.serviceSubtypeName}`
    }
    return `${order.quantity} ${order.serviceName.toLowerCase()} per ${order.platformName}`
  }

  // Aggiorniamo anche la condizione per mostrare il riepilogo semplificato
  if (
    order.serviceType === "telegram" ||
    order.serviceType === "whatsapp" ||
    order.serviceType === "telegramMembers" ||
    order.serviceType === "telegramViews" ||
    order.serviceType === "liveStream" ||
    order.serviceType === "twitchServices" ||
    order.serviceType === "youtubeServices" ||
    order.serviceType === "websiteVisits" ||
    order.serviceType === "licenses"
  ) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Sparkles className="h-5 w-5 text-purple-400 mr-2" />
          Conferma i dettagli
        </h2>

        <Card className="bg-gradient-to-br from-[#0c1220] to-[#131b30] border-gray-800 p-6 shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center mr-4 shadow-md">
                {getServiceIcon()}
              </div>
              <div>
                <h3 className="font-medium text-white text-lg">{order.serviceName}</h3>
                <p className="text-sm text-purple-300">{getServiceDescription()}</p>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-r from-[#151a29] to-[#1c2136] rounded-xl shadow-inner">
              <p className="text-sm text-gray-300">
                <span className="font-medium text-purple-400">Nota:</span>{" "}
                {order.serviceType === "telegram" || order.serviceType === "whatsapp"
                  ? `I numeri ${order.serviceType === "telegram" ? "Telegram" : "WhatsApp"} verranno forniti dopo la conferma dell'ordine. Riceverai i dettagli di accesso via Telegram.`
                  : order.serviceType === "telegramMembers" || order.serviceType === "telegramViews"
                    ? "Fornisci il link al tuo canale o post Telegram quando richiesto dopo la conferma dell'ordine."
                    : order.serviceType === "liveStream" || order.serviceType === "youtubeServices"
                      ? "Fornisci il link al tuo canale o video YouTube quando richiesto dopo la conferma dell'ordine."
                      : order.serviceType === "twitchServices"
                        ? "Fornisci il link al tuo canale Twitch quando richiesto dopo la conferma dell'ordine."
                        : "Fornisci l'URL del tuo sito web quando richiesto dopo la conferma dell'ordine."}
              </p>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-medium text-lg shadow-lg transition-all duration-200 mt-4"
              onClick={handleSubmit}
            >
              Continua al riepilogo
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center">
        <Sparkles className="h-5 w-5 text-purple-400 mr-2" />
        Inserisci i dettagli del tuo account
      </h2>

      <Card className="bg-gradient-to-br from-[#0c1220] to-[#131b30] border-gray-800 p-6 shadow-lg">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-white text-lg">
              Username {order.platformName}
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <AtSign className="h-5 w-5 text-purple-400" />
              </div>
              <Input
                id="username"
                placeholder={`Il tuo username su ${order.platformName}`}
                className={`bg-[#151a29] border-gray-700 text-white pl-12 h-12 rounded-xl ${errors.username ? "border-red-500" : ""}`}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  if (e.target.value.trim()) setErrors({ ...errors, username: false })
                }}
              />
            </div>
            {errors.username && <p className="text-xs text-red-500 mt-1">Inserisci il tuo username</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url" className="text-white text-lg">
              URL del profilo/post
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <LinkIcon className="h-5 w-5 text-purple-400" />
              </div>
              <Input
                id="url"
                placeholder={`URL del tuo profilo o post su ${order.platformName}`}
                className={`bg-[#151a29] border-gray-700 text-white pl-12 h-12 rounded-xl ${errors.url ? "border-red-500" : ""}`}
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  if (e.target.value.trim()) setErrors({ ...errors, url: false })
                }}
              />
            </div>
            {errors.url && <p className="text-xs text-red-500 mt-1">Inserisci l'URL del tuo profilo o post</p>}
          </div>

          <div className="p-5 bg-gradient-to-r from-[#151a29] to-[#1c2136] rounded-xl mt-4 shadow-inner">
            <p className="text-sm text-gray-300">
              <span className="font-medium text-purple-400">Nota:</span> Assicurati che il tuo profilo sia pubblico e
              che l'URL sia corretto. Non è necessario fornire la password del tuo account.
            </p>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-medium text-lg shadow-lg transition-all duration-200 mt-4"
            onClick={handleSubmit}
          >
            Continua
          </Button>
        </div>
      </Card>
    </div>
  )
}
