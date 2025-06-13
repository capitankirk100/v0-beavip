"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Minus, Plus, Phone, Sparkles, Clock, Youtube } from "lucide-react"
import type { OrderState } from "../types"
// Importazione corretta per i prezzi fissi
import { getNearestPrice, getWhatsAppRentalPrice } from "../data/all-services-prices"

interface QuantitySelectionProps {
  order: OrderState
  updateOrder: (updates: Partial<OrderState>) => void
  onContinue: () => void
}

export function QuantitySelection({ order, updateOrder, onContinue }: QuantitySelectionProps) {
  const [quantity, setQuantity] = useState<number>(order.quantity || 100)
  const [isRental, setIsRental] = useState<boolean>(order.isRental || false)
  const [rentalDuration, setRentalDuration] = useState<number>(order.rentalDuration || 1) // in mesi
  const [duration, setDuration] = useState<number>(order.duration || 15) // per live stream
  const [postCount, setPostCount] = useState<number>(order.postCount || 1) // per visualizzazioni su più post

  // Determina i presets di quantità in base al tipo di servizio
  const getQuantityPresets = () => {
    if (order.serviceType === "telegram" || order.serviceType === "whatsapp") {
      return [1, 2, 5, 10, 20]
    } else if (order.serviceType === "telegramMembers") {
      return [100, 250, 500, 1000, 2500, 5000]
    } else if (order.serviceType === "liveStream") {
      return [15, 30, 60, 90, 120, 180, 360]
    } else if ((order.serviceType === "followers" || order.serviceType === "likes") && order.platform === "instagram") {
      return [100, 250, 500, 1000, 2500, 5000, 10000, 50000]
    } else if (order.serviceType === "telegramViews") {
      return [100, 500, 1000, 2500, 5000, 10000]
    } else if (order.serviceType === "twitchServices") {
      return order.serviceSubtype === "followers" ? [100, 500, 1000, 2500, 5000] : [10, 20, 30, 40, 50, 60, 120]
    } else if (order.serviceType === "youtubeServices") {
      if (order.serviceSubtype === "comments") {
        return [10, 25, 50, 100]
      } else if (order.serviceSubtype === "subscribers") {
        return [100, 250, 500, 1000, 2000]
      } else if (order.serviceSubtype === "likes") {
        return [100, 250, 500, 1000, 2500]
      } else if (order.serviceSubtype?.includes("viewsHQ")) {
        if (order.serviceSubtype === "viewsHQ3k") {
          return [3000, 5000, 10000, 25000, 50000, 100000]
        } else if (order.serviceSubtype === "viewsHQ5kPremium") {
          return [5000, 10000, 25000, 50000, 100000]
        } else if (order.serviceSubtype === "viewsHQ10k") {
          return [10000, 25000, 50000, 100000]
        } else {
          return [1000, 3000, 5000, 10000, 25000, 50000, 100000]
        }
      } else {
        return [1000, 3000, 5000, 10000, 25000, 50000, 100000]
      }
    } else {
      return [100, 500, 1000, 2500, 5000, 10000]
    }
  }

  const quantityPresets = getQuantityPresets()

  // Calcola il prezzo in base alla quantità e al tipo di servizio
  const calculatePrice = (qty: number) => {
    if (order.serviceType === "telegram") {
      // Prezzo per numeri Telegram
      if (isRental) {
        // Prezzo per noleggio: 5€ al mese per numero
        return qty * 5 * rentalDuration
      } else {
        // Prezzo per acquisto: 40€ per numero
        return qty * 40
      }
    } else if (order.serviceType === "whatsapp") {
      // Prezzo per numeri WhatsApp
      if (isRental) {
        // Prezzo per noleggio: usa la funzione specifica
        return getWhatsAppRentalPrice(qty, rentalDuration)
      } else {
        // Prezzo per acquisto: usa i prezzi fissi o calcola in base alla quantità
        return getNearestPrice(qty, "purchase", "whatsapp")
      }
    } else if (order.serviceType === "liveStream") {
      // Per live stream, la quantità è fissa a 1000 e il prezzo dipende dalla durata
      return getNearestPrice(1000, "liveStream", order.platform)
    } else if (order.serviceType === "telegramMembers") {
      // Per membri Telegram, usa il tipo specifico
      const subtype = order.serviceSubtype || "members"
      return getNearestPrice(qty, subtype, "telegram")
    } else if (order.serviceType === "telegramViews") {
      // Per visualizzazioni Telegram, usa il tipo specifico
      const subtype = order.serviceSubtype || "views"
      return getNearestPrice(qty, subtype, "telegram")
    } else if (order.serviceType === "twitchServices") {
      // Per servizi Twitch, usa il tipo specifico
      const subtype = order.serviceSubtype || "followers"
      return getNearestPrice(qty, subtype, "twitch")
    } else if (order.serviceType === "youtubeServices") {
      // Per servizi YouTube, usa il tipo specifico
      const subtype = order.serviceSubtype || "viewsHQ"
      return getNearestPrice(qty, subtype, "youtube")
    } else if (order.serviceType === "websiteVisits") {
      // Per visite al sito web, usa il tipo specifico
      const subtype = order.serviceSubtype || "fromFacebook"
      return getNearestPrice(qty, subtype, "website")
    } else if (order.serviceType === "followers" && order.platform === "instagram") {
      // Prezzo fisso per followers di Instagram
      return getNearestPrice(qty, "followers", "instagram")
    } else if (order.serviceType === "likes" && order.platform === "instagram") {
      // Prezzo fisso per likes di Instagram
      return getNearestPrice(qty, "likes", "instagram")
    } else if (order.serviceType === "views" && order.platform === "instagram") {
      // Prezzo fisso per visualizzazioni di Instagram
      return getNearestPrice(qty, "views", "instagram")
    } else if (order.serviceType === "likes" && order.platform === "tiktok") {
      // Per likes di TikTok
      const subtype = order.serviceSubtype || "likes"
      return getNearestPrice(qty, subtype, "tiktok")
    } else if (order.serviceType === "views" && order.platform === "tiktok") {
      // Per visualizzazioni di TikTok
      return getNearestPrice(qty, "viewsCheap", "tiktok")
    } else if (order.serviceType === "shares" && (order.platform === "tiktok" || order.platform === "facebook")) {
      // Per condivisioni di TikTok o Facebook
      return getNearestPrice(qty, "shares", order.platform)
    } else if (order.serviceType === "followers" && order.platform === "tiktok") {
      // Per followers di TikTok
      return getNearestPrice(qty, "followers", "tiktok")
    } else if (order.serviceType === "likes" && order.platform === "facebook") {
      // Per likes di Facebook
      const subtype = order.serviceSubtype || "postLikes"
      return getNearestPrice(qty, subtype, "facebook")
    } else {
      // Per altri servizi, usa il calcolo dinamico originale
      const basePrice = order.price / (order.quantity || 1)

      // Non applicare più sconti per quantità
      return basePrice * qty
    }
  }

  // Aggiorna la quantità e il prezzo
  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
    updateOrder({
      quantity: newQuantity,
      price: calculatePrice(newQuantity),
      isRental: order.serviceType === "telegram" || order.serviceType === "whatsapp" ? isRental : undefined,
      rentalDuration:
        (order.serviceType === "telegram" || order.serviceType === "whatsapp") && isRental ? rentalDuration : undefined,
    })
  }

  // Aggiorna la durata per i live stream
  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration)
    updateOrder({
      duration: newDuration,
      price: getNearestPrice(1000, "liveStream", order.platform),
    })
  }

  // Aggiorna il numero di post per le visualizzazioni su più post
  const handlePostCountChange = (newPostCount: number) => {
    setPostCount(newPostCount)
    updateOrder({
      postCount: newPostCount,
      serviceSubtype: newPostCount === 5 ? "viewsFast5Posts" : newPostCount === 10 ? "viewsFast10Posts" : "viewsFast",
      price: getNearestPrice(
        quantity,
        newPostCount === 5 ? "viewsFast5Posts" : newPostCount === 10 ? "viewsFast10Posts" : "viewsFast",
        "telegram",
      ),
    })
  }

  // Aggiorna il tipo di acquisto per numeri Telegram o WhatsApp
  const handleRentalChange = (rental: boolean) => {
    setIsRental(rental)

    if (order.serviceType === "telegram") {
      updateOrder({
        isRental: rental,
        rentalDuration: rental ? rentalDuration : undefined,
        price: rental ? quantity * 5 * rentalDuration : quantity * 40,
      })
    } else if (order.serviceType === "whatsapp") {
      updateOrder({
        isRental: rental,
        rentalDuration: rental ? rentalDuration : undefined,
        price: rental
          ? getWhatsAppRentalPrice(quantity, rentalDuration)
          : getNearestPrice(quantity, "purchase", "whatsapp"),
      })
    }
  }

  // Aggiorna la durata del noleggio
  const handleRentalDurationChange = (duration: number) => {
    setRentalDuration(duration)

    if (order.serviceType === "telegram") {
      updateOrder({
        rentalDuration: duration,
        price: quantity * 5 * duration,
      })
    } else if (order.serviceType === "whatsapp") {
      updateOrder({
        rentalDuration: duration,
        price: getWhatsAppRentalPrice(quantity, duration),
      })
    }
  }

  // Aggiorna il sottotipo di servizio
  const handleServiceSubtypeChange = (subtype: string) => {
    let subtypeName = ""

    // Determina il nome del sottotipo in base al servizio
    if (order.serviceType === "telegramMembers") {
      if (subtype === "members") subtypeName = "Standard"
      else if (subtype === "membersHQ") subtypeName = "HQ"
      else if (subtype === "membersCentral") subtypeName = "Sede Centrale"
      else if (subtype === "membersCentralAlt") subtypeName = "Sede Centrale Alt"
      else if (subtype === "membersLifetime") subtypeName = "LifeTime"
      else if (subtype === "membersAvatar") subtypeName = "Con Avatar"
    } else if (order.serviceType === "telegramViews") {
      if (subtype === "views") subtypeName = "Standard"
      else if (subtype === "viewsStatic") subtypeName = "Inclusione statica"
      else if (subtype === "viewsFast") subtypeName = "Fast"
      else if (subtype === "viewsBest") subtypeName = "Miglior prezzo"
      else if (subtype === "viewsFastStar") subtypeName = "Fast Star"
      else if (subtype === "viewsStable") subtypeName = "Always Stable"
    } else if (order.serviceType === "twitchServices") {
      if (subtype === "followers") subtypeName = "Followers"
      else if (subtype === "livePlays") subtypeName = "Live Plays"
    } else if (order.serviceType === "youtubeServices") {
      if (subtype === "viewsHQ") subtypeName = "HQ Views"
      else if (subtype === "viewsHQ3k") subtypeName = "HQ Views (Min 3k)"
      else if (subtype === "viewsHQ5kPremium") subtypeName = "HQ Views (Min 5k) Premium"
      else if (subtype === "viewsHQ10k") subtypeName = "HQ Views (Min 10k)"
      else if (subtype === "likes") subtypeName = "Likes"
      else if (subtype === "comments") subtypeName = "Custom Comments"
      else if (subtype === "subscribers") subtypeName = "Subscribers"
    } else if (order.serviceType === "websiteVisits") {
      if (subtype === "fromFacebook") subtypeName = "Da Facebook"
      else if (subtype === "fromInstagram") subtypeName = "Da Instagram"
      else if (subtype === "fromQuora") subtypeName = "Da Quora"
      else if (subtype === "fromReddit") subtypeName = "Da Reddit"
      else if (subtype === "fromTwitter") subtypeName = "Da Twitter"
    }

    updateOrder({
      serviceSubtype: subtype,
      serviceSubtypeName: subtypeName,
      price: getNearestPrice(
        quantity,
        subtype,
        order.serviceType === "telegramMembers" || order.serviceType === "telegramViews"
          ? "telegram"
          : order.serviceType === "twitchServices"
            ? "twitch"
            : order.serviceType === "youtubeServices"
              ? "youtube"
              : order.serviceType === "websiteVisits"
                ? "website"
                : order.platform,
      ),
    })
  }

  // Incrementa la quantità
  const incrementQuantity = () => {
    const increment = order.serviceType === "telegram" || order.serviceType === "whatsapp" ? 1 : 100
    const newQuantity = quantity + increment
    handleQuantityChange(newQuantity)
  }

  // Decrementa la quantità
  const decrementQuantity = () => {
    const minQuantity = order.serviceType === "telegram" || order.serviceType === "whatsapp" ? 1 : 100
    const decrement = order.serviceType === "telegram" || order.serviceType === "whatsapp" ? 1 : 100

    if (quantity > minQuantity) {
      const newQuantity = quantity - decrement
      handleQuantityChange(newQuantity)
    }
  }

  // Effetto per inizializzare i valori corretti quando cambia il tipo di servizio
  useEffect(() => {
    if (order.serviceType === "telegram" || order.serviceType === "whatsapp") {
      if (quantity > 50) {
        handleQuantityChange(1)
      }
    } else if (order.serviceType === "liveStream") {
      // Per live stream, imposta la durata predefinita
      handleDurationChange(15)
    } else if (order.serviceType === "youtubeServices") {
      // Per YouTube, imposta il sottotipo predefinito se non è già impostato
      if (!order.serviceSubtype) {
        handleServiceSubtypeChange("viewsHQ")
      }

      // Imposta la quantità minima in base al sottotipo
      if (order.serviceSubtype === "viewsHQ3k" && quantity < 3000) {
        handleQuantityChange(3000)
      } else if (order.serviceSubtype === "viewsHQ5kPremium" && quantity < 5000) {
        handleQuantityChange(5000)
      } else if (order.serviceSubtype === "viewsHQ10k" && quantity < 10000) {
        handleQuantityChange(10000)
      } else if (quantity < 100) {
        handleQuantityChange(100)
      }
    } else {
      if (quantity < 100) {
        handleQuantityChange(100)
      }
    }
  }, [order.serviceType, order.serviceSubtype])

  // Renderizza l'interfaccia in base al tipo di servizio
  const renderServiceSpecificUI = () => {
    if (order.serviceType === "telegram" || order.serviceType === "whatsapp") {
      return (
        <div className="space-y-4 mb-4">
          <h4 className="text-sm font-medium text-white">Tipo di acquisto</h4>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className={`border-gray-700 transition-all duration-200 ${
                !isRental
                  ? "bg-gradient-to-r from-purple-700 to-indigo-700 border-purple-500 text-white shadow-md"
                  : "text-white bg-[#151a29] hover:bg-[#1e2a45]"
              }`}
              onClick={() => handleRentalChange(false)}
            >
              Acquisto {order.serviceType === "telegram" ? "(40€/numero)" : "(50€/numero)"}
            </Button>
            <Button
              variant="outline"
              className={`border-gray-700 transition-all duration-200 ${
                isRental
                  ? "bg-gradient-to-r from-purple-700 to-indigo-700 border-purple-500 text-white shadow-md"
                  : "text-white bg-[#151a29] hover:bg-[#1e2a45]"
              }`}
              onClick={() => handleRentalChange(true)}
            >
              Noleggio {order.serviceType === "telegram" ? "(5€/mese)" : "(7€/mese)"}
            </Button>
          </div>

          {isRental && (
            <div className="space-y-2 mt-4">
              <h4 className="text-sm font-medium text-white">Durata noleggio (mesi)</h4>
              <div className="grid grid-cols-4 gap-2">
                {[1, 3, 6, 12].map((months) => (
                  <Button
                    key={months}
                    variant="outline"
                    className={`border-gray-700 transition-all duration-200 ${
                      rentalDuration === months
                        ? "bg-gradient-to-r from-purple-700 to-indigo-700 border-purple-500 text-white shadow-md"
                        : "text-white bg-[#151a29] hover:bg-[#1e2a45]"
                    }`}
                    onClick={() => handleRentalDurationChange(months)}
                  >
                    {months} {months === 1 ? "mese" : "mesi"}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    } else if (order.serviceType === "liveStream") {
      return (
        <div className="space-y-4 mb-4">
          <h4 className="text-sm font-medium text-white">Durata dello streaming (minuti)</h4>
          <div className="grid grid-cols-3 gap-3">
            {[15, 30, 60, 90, 120, 180, 360, 720].map((mins) => (
              <Button
                key={mins}
                variant="outline"
                className={`border-gray-700 transition-all duration-200 ${
                  duration === mins
                    ? "bg-gradient-to-r from-purple-700 to-indigo-700 border-purple-500 text-white shadow-md"
                    : "text-white bg-[#151a29] hover:bg-[#1e2a45]"
                }`}
                onClick={() => handleDurationChange(mins)}
              >
                {mins} min
              </Button>
            ))}
          </div>
        </div>
      )
    } else if (order.serviceType === "telegramViews" && order.serviceSubtype === "viewsFast") {
      return (
        <div className="space-y-4 mb-4">
          <h4 className="text-sm font-medium text-white">Numero di post</h4>
          <div className="grid grid-cols-3 gap-3">
            {[1, 5, 10].map((count) => (
              <Button
                key={count}
                variant="outline"
                className={`border-gray-700 transition-all duration-200 ${
                  postCount === count
                    ? "bg-gradient-to-r from-purple-700 to-indigo-700 border-purple-500 text-white shadow-md"
                    : "text-white bg-[#151a29] hover:bg-[#1e2a45]"
                }`}
                onClick={() => handlePostCountChange(count)}
              >
                {count} {count === 1 ? "post" : "posts"}
              </Button>
            ))}
          </div>
        </div>
      )
    } else if (order.serviceType === "telegramMembers") {
      return (
        <div className="space-y-4 mb-4">
          <h4 className="text-sm font-medium text-white">Tipo di membri</h4>
          <Select value={order.serviceSubtype || "members"} onValueChange={handleServiceSubtypeChange}>
            <SelectTrigger className="bg-[#151a29] border-gray-700 text-white">
              <SelectValue placeholder="Seleziona tipo" />
            </SelectTrigger>
            <SelectContent className="bg-[#151a29] border-gray-700 text-white">
              <SelectItem value="members">Standard (100K/giorno)</SelectItem>
              <SelectItem value="membersCentral">Sede Centrale (50K/giorno)</SelectItem>
              <SelectItem value="membersCentralAlt">Sede Centrale Alt (50K/giorno)</SelectItem>
              <SelectItem value="membersHQ">HQ (100K/giorno)</SelectItem>
              <SelectItem value="membersLifetime">HQ - LifeTime Non Drop</SelectItem>
              <SelectItem value="membersAvatar">HQ - Con Avatar e Biografia</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
    } else if (order.serviceType === "telegramViews") {
      return (
        <div className="space-y-4 mb-4">
          <h4 className="text-sm font-medium text-white">Tipo di visualizzazioni</h4>
          <Select value={order.serviceSubtype || "views"} onValueChange={handleServiceSubtypeChange}>
            <SelectTrigger className="bg-[#151a29] border-gray-700 text-white">
              <SelectValue placeholder="Seleziona tipo" />
            </SelectTrigger>
            <SelectContent className="bg-[#151a29] border-gray-700 text-white">
              <SelectItem value="views">Standard (CHEAPEST)</SelectItem>
              <SelectItem value="viewsStatic">Inclusione statica (0-1 ora)</SelectItem>
              <SelectItem value="viewsFast">Fast (1 post)</SelectItem>
              <SelectItem value="viewsBest">Miglior prezzo</SelectItem>
              <SelectItem value="viewsFastStar">Fast Star (1 post)</SelectItem>
              <SelectItem value="viewsStable">Always Stable</SelectItem>
              <SelectItem value="viewsFast5Posts">Fast (Ultimi 5 post)</SelectItem>
              <SelectItem value="viewsFast10Posts">Fast (Ultimi 10 post)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
    } else if (order.serviceType === "twitchServices") {
      return (
        <div className="space-y-4 mb-4">
          <h4 className="text-sm font-medium text-white">Tipo di servizio</h4>
          <Select value={order.serviceSubtype || "followers"} onValueChange={handleServiceSubtypeChange}>
            <SelectTrigger className="bg-[#151a29] border-gray-700 text-white">
              <SelectValue placeholder="Seleziona tipo" />
            </SelectTrigger>
            <SelectContent className="bg-[#151a29] border-gray-700 text-white">
              <SelectItem value="followers">Followers</SelectItem>
              <SelectItem value="livePlays">Live Plays</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
    } else if (order.serviceType === "youtubeServices") {
      return (
        <div className="space-y-4 mb-4">
          <h4 className="text-sm font-medium text-white">Tipo di servizio</h4>
          <Select value={order.serviceSubtype || "viewsHQ"} onValueChange={handleServiceSubtypeChange}>
            <SelectTrigger className="bg-[#151a29] border-gray-700 text-white">
              <SelectValue placeholder="Seleziona tipo" />
            </SelectTrigger>
            <SelectContent className="bg-[#151a29] border-gray-700 text-white">
              <SelectItem value="viewsHQ">HQ Views</SelectItem>
              <SelectItem value="viewsHQ3k">HQ Views (Min 3k)</SelectItem>
              <SelectItem value="viewsHQ5kPremium">HQ Views (Min 5k) Premium</SelectItem>
              <SelectItem value="viewsHQ10k">HQ Views (Min 10k)</SelectItem>
              <SelectItem value="likes">Likes</SelectItem>
              <SelectItem value="comments">Custom Comments</SelectItem>
              <SelectItem value="subscribers">Subscribers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
    } else if (order.serviceType === "websiteVisits") {
      return (
        <div className="space-y-4 mb-4">
          <h4 className="text-sm font-medium text-white">Fonte delle visite</h4>
          <Select value={order.serviceSubtype || "fromFacebook"} onValueChange={handleServiceSubtypeChange}>
            <SelectTrigger className="bg-[#151a29] border-gray-700 text-white">
              <SelectValue placeholder="Seleziona fonte" />
            </SelectTrigger>
            <SelectContent className="bg-[#151a29] border-gray-700 text-white">
              <SelectItem value="fromFacebook">Facebook</SelectItem>
              <SelectItem value="fromInstagram">Instagram</SelectItem>
              <SelectItem value="fromQuora">Quora</SelectItem>
              <SelectItem value="fromReddit">Reddit</SelectItem>
              <SelectItem value="fromTwitter">Twitter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
    }

    return null
  }

  // Ottieni una descrizione appropriata per la quantità
  const getQuantityDescription = () => {
    if (order.serviceType === "telegram" || order.serviceType === "whatsapp") {
      return "Seleziona il numero di numeri"
    } else if (order.serviceType === "liveStream") {
      return "Seleziona la durata dello streaming"
    } else if (order.serviceType === "followers") {
      return "Seleziona il numero di follower"
    } else if (order.serviceType === "likes") {
      return "Seleziona il numero di like"
    } else if (order.serviceType === "views" || order.serviceType === "telegramViews") {
      return "Seleziona il numero di visualizzazioni"
    } else if (order.serviceType === "shares" && (order.platform === "tiktok" || order.platform === "facebook")) {
      return "Seleziona il numero di condivisioni"
    } else if (order.serviceType === "youtubeServices") {
      if (order.serviceSubtype === "subscribers") return "Seleziona il numero di iscritti"
      else if (order.serviceSubtype === "likes") return "Seleziona il numero di like"
      else if (order.serviceSubtype === "comments") return "Seleziona il numero di commenti"
      else return "Seleziona il numero di visualizzazioni"
    } else if (order.serviceType === "websiteVisits") {
      return "Seleziona il numero di visite"
    } else {
      return "Seleziona la quantità"
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center">
        <Sparkles className="h-5 w-5 text-purple-400 mr-2" />
        Seleziona la quantità
      </h2>

      <Card className="bg-gradient-to-br from-[#0c1220] to-[#131b30] border-gray-800 p-6 shadow-lg">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center mr-4 shadow-md">
            {order.serviceType === "telegram" || order.serviceType === "whatsapp" ? (
              <Phone className="h-6 w-6 text-white" />
            ) : order.serviceType === "liveStream" ? (
              <Clock className="h-6 w-6 text-white" />
            ) : order.serviceType === "youtubeServices" ? (
              <Youtube className="h-6 w-6 text-white" />
            ) : (
              <Users className="h-6 w-6 text-white" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">
              {order.serviceName} per {order.platformName}
              {order.serviceSubtypeName && ` - ${order.serviceSubtypeName}`}
            </h3>
            <p className="text-sm text-purple-300">{getQuantityDescription()}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Opzioni specifiche per il tipo di servizio */}
          {renderServiceSpecificUI()}

          {/* Presets di quantità - Design migliorato */}
          {order.serviceType !== "liveStream" && (
            <div className="grid grid-cols-3 gap-3">
              {quantityPresets.map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  className={`border-gray-700 transition-all duration-200 ${
                    quantity === preset
                      ? "bg-gradient-to-r from-purple-700 to-indigo-700 border-purple-500 text-white shadow-md"
                      : "text-white bg-[#151a29] hover:bg-[#1e2a45]"
                  }`}
                  onClick={() => handleQuantityChange(preset)}
                >
                  {preset.toLocaleString()}
                </Button>
              ))}
            </div>
          )}

          {/* Input personalizzato con design migliorato */}
          {order.serviceType !== "liveStream" && (
            <div className="flex items-center space-x-3 mt-4">
              <Button
                variant="outline"
                size="icon"
                className="border-gray-700 text-white bg-[#151a29] hover:bg-[#1e2a45] h-12 w-12 rounded-xl"
                onClick={decrementQuantity}
              >
                <Minus className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <Input
                  type="number"
                  min={order.serviceType === "telegram" || order.serviceType === "whatsapp" ? "1" : "100"}
                  max={order.serviceType === "telegram" || order.serviceType === "whatsapp" ? "100" : "100000"}
                  step={order.serviceType === "telegram" || order.serviceType === "whatsapp" ? "1" : "100"}
                  value={quantity}
                  onChange={(e) => {
                    const val =
                      Number.parseInt(e.target.value) ||
                      (order.serviceType === "telegram" || order.serviceType === "whatsapp" ? 1 : 100)
                    handleQuantityChange(val)
                  }}
                  className="bg-[#151a29] border-gray-700 text-white text-center h-12 text-lg font-bold rounded-xl"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="border-gray-700 text-white bg-[#151a29] hover:bg-[#1e2a45] h-12 w-12 rounded-xl"
                onClick={incrementQuantity}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Prezzo stimato con design migliorato */}
          <div className="p-6 bg-gradient-to-r from-[#151a29] to-[#1c2136] rounded-xl mt-6 shadow-inner">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 font-medium">Prezzo stimato:</span>
              <span className="font-bold text-2xl text-white bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                €{order.price.toFixed(2)}
              </span>
            </div>
            {/* Messaggio di sconto rimosso */}
            {order.serviceType === "telegram" && isRental && (
              <div className="mt-2 text-sm text-purple-300 flex items-center">
                <Sparkles className="h-4 w-4 mr-1" />
                Noleggio per {rentalDuration} {rentalDuration === 1 ? "mese" : "mesi"} a €5/mese per numero
              </div>
            )}
            {order.serviceType === "whatsapp" && isRental && (
              <div className="mt-2 text-sm text-purple-300 flex items-center">
                <Sparkles className="h-4 w-4 mr-1" />
                Noleggio per {rentalDuration} {rentalDuration === 1 ? "mese" : "mesi"}
              </div>
            )}
            {order.serviceType === "liveStream" && (
              <div className="mt-2 text-sm text-purple-300 flex items-center">
                <Sparkles className="h-4 w-4 mr-1" />
                Streaming live di {duration} minuti con 100% di spettatori simultanei
              </div>
            )}
          </div>

          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-medium text-lg shadow-lg transition-all duration-200 mt-4"
            onClick={onContinue}
          >
            Continua
          </Button>
        </div>
      </Card>
    </div>
  )
}
