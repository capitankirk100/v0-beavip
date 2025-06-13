"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle, Info, Sparkles, Check, Copy, User, Plus, Link, AtSign } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { deliveryOptions } from "../data/delivery-options"
import { paymentMethods, cryptoAddresses } from "../data/payment-methods"
import type { OrderState } from "../types"
import type { BeavipUserProfile } from "../hooks/use-user-profile"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface OrderSummaryProps {
  order: OrderState
  userProfile: BeavipUserProfile
  onSubmitOrder: () => void
  trackingInfo?: { orderId: string; trackingUrl: string }
}

export function OrderSummary({ order, userProfile, onSubmitOrder, trackingInfo }: OrderSummaryProps) {
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)
  const [showCryptoDialog, setShowCryptoDialog] = useState(false)
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null)
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  // Funzione per ottenere la descrizione del servizio in base al tipo
  const getServiceTypeDescription = () => {
    switch (order.serviceType) {
      case "followers":
        return `Incremento followers su ${order.platformName}`
      case "likes":
        return `Incremento likes su ${order.platformName}`
      case "views":
        return `Incremento visualizzazioni su ${order.platformName}`
      case "comments":
        return `Incremento commenti su ${order.platformName}`
      case "shares":
        return `Incremento condivisioni su ${order.platformName}`
      case "telegram":
        return order.isRental ? `Noleggio numeri Telegram` : `Acquisto numeri Telegram`
      case "whatsapp":
        return order.isRental ? `Noleggio numeri WhatsApp` : `Acquisto numeri WhatsApp`
      case "telegramShop":
        return `Creazione negozio Telegram`
      case "telegramMembers":
        return `Incremento membri canale Telegram`
      case "telegramViews":
        return `Incremento visualizzazioni post Telegram`
      case "liveStream":
        return `Servizio live streaming YouTube`
      case "twitchServices":
        return order.serviceSubtype === "followers" ? `Incremento followers Twitch` : `Live plays Twitch`
      case "youtubeServices":
        if (order.serviceSubtype === "viewsHQ") return `Incremento visualizzazioni video YouTube`
        if (order.serviceSubtype === "likes") return `Incremento likes video YouTube`
        if (order.serviceSubtype === "comments") return `Incremento commenti video YouTube`
        if (order.serviceSubtype === "subscribers") return `Incremento iscritti canale YouTube`
        return `Servizio YouTube`
      case "websiteVisits":
        return `Incremento visite sito web`
      case "licenses":
        return `Licenza software ${order.serviceSubtypeName}`
      case "package":
        return `Pacchetto combinato: ${order.packageId}`
      case "subscription":
        return `Abbonamento: ${order.subscriptionId}`
      default:
        return `Servizio ${order.serviceName}`
    }
  }

  // Funzione per determinare se mostrare il campo username
  const shouldShowUsername = () => {
    // Non mostrare username per questi servizi
    if (
      order.serviceType === "telegram" ||
      order.serviceType === "whatsapp" ||
      order.serviceType === "telegramShop" ||
      order.serviceType === "licenses"
    ) {
      return false
    }

    // Per tutti gli altri servizi, mostra username se esiste
    return order.username && order.username !== "N/A"
  }

  // Funzione per determinare se mostrare il campo URL
  const shouldShowUrl = () => {
    // Non mostrare URL per questi servizi
    if (
      order.serviceType === "telegram" ||
      order.serviceType === "whatsapp" ||
      order.serviceType === "telegramShop" ||
      order.serviceType === "licenses"
    ) {
      return false
    }

    // Per tutti gli altri servizi, mostra URL se esiste
    return order.url && order.url !== "N/A"
  }

  // Funzione per creare il messaggio Telegram
  const createTelegramMessage = () => {
    let message = `
🚀 *RICHIESTA BEAVIP* 🚀

*Servizio:* ${order.serviceName}
*Tipo servizio:* ${getServiceTypeDescription()}
`

    // Aggiungi informazioni specifiche per ogni tipo di servizio
    if (order.serviceType === "telegram" || order.serviceType === "whatsapp") {
      message += `*Quantità:* ${order.quantity.toLocaleString()}
*Tipo:* ${order.isRental ? "Noleggio" : "Acquisto"}
${order.isRental ? `*Durata noleggio:* ${order.rentalDuration} ${order.rentalDuration === 1 ? "mese" : "mesi"}` : ""}
`
    } else if (order.serviceType === "licenses") {
      message += `*Licenza:* ${order.serviceSubtypeName}
*Installazione remota:* ${order.needsRemoteInstallation ? "Sì" : "No"}
${order.needsRemoteInstallation ? `*ID AnyDesk:* ${order.anyDeskId}` : ""}
`
    } else if (order.serviceType === "telegramShop") {
      message += `*Tipo:* ${order.serviceSubtypeName}
*Durata:* ${order.quantity} ${order.quantity === 1 ? "mese" : "mesi"}
`
      if (order.setupFee) message += "*Setup iniziale:* Sì\n"
      if (order.logoDesign) message += "*Design del logo:* Sì\n"
      if (order.welcomeMessage) message += "*Messaggio di benvenuto:* Sì\n"
      if (order.categoriesSetup) message += "*Setup categorie:* Sì\n"
      if (order.productsCount && order.productsCount > 0)
        message += `*Configurazione prodotti:* ${order.productsCount}\n`
      if (order.businessDescription) message += `*Descrizione business:* ${order.businessDescription}\n`
    } else if (order.serviceType === "package") {
      message += `*Pacchetto:* ${order.packageId}\n`
      if (order.discountCode) message += `*Codice sconto:* ${order.discountCode}\n`
      if (order.discountPercentage) message += `*Sconto applicato:* ${order.discountPercentage}%\n`
    } else if (order.serviceType === "subscription") {
      message += `*Abbonamento:* ${order.subscriptionId}\n`
      message += `*Ciclo di fatturazione:* ${order.billingCycle}\n`
      message += `*Impegno minimo:* ${order.minimumCommitment} mesi\n`
    } else {
      // Per tutti gli altri servizi
      message += `*Piattaforma:* ${order.platformName}
*Quantità:* ${order.quantity.toLocaleString()}
`
      // Aggiungi username e URL solo se sono stati forniti e sono rilevanti
      if (shouldShowUsername()) {
        message += `*Username:* @${order.username}\n`
      }

      if (shouldShowUrl()) {
        message += `*URL:* ${order.url}\n`
      }

      // Aggiungi informazioni specifiche per i servizi
      if (order.serviceSubtype && order.serviceType !== "licenses") {
        message += `*Tipo:* ${order.serviceSubtypeName}\n`
      }

      if (order.duration) {
        message += `*Durata:* ${order.duration} minuti\n`
      }

      if (order.postCount) {
        message += `*Numero post:* ${order.postCount}\n`
      }
    }

    // Aggiungi servizi complementari se presenti
    if (order.complementaryServices && order.complementaryServices.length > 0) {
      message += `\n*Servizi complementari:*\n`
      order.complementaryServices.forEach((service, index) => {
        message += `${index + 1}. ${service.name} - €${service.price.toFixed(2)}\n`
        if (service.username) message += `   Username: @${service.username}\n`
        if (service.url) message += `   URL: ${service.url}\n`
      })
      message += `\n`
    }

    message += `*Consegna:* ${order.deliveryName} (${order.deliveryTimeDescription})
*Pagamento:* ${selectedPaymentMethod === "crypto" && selectedCrypto ? `Crypto (${selectedCrypto})` : selectedPaymentMethod || "Non selezionato"}
*Prezzo:* €${order.price.toFixed(2)}
*Pagamento completato:* ${paymentCompleted ? "Sì" : "No"}
`

    // Aggiungi informazioni di affiliazione se presenti
    if (userProfile.affiliateNickname) {
      message += `*Affiliazione:* ${userProfile.affiliateNickname}\n`
    }

    // Aggiungi URL di tracciamento se disponibile
    if (trackingInfo?.trackingUrl) {
      message += `\n*Traccia ordine:* ${trackingInfo.trackingUrl}\n`
    }

    message += `\nConfermi la richiesta?`

    // Codifica il messaggio per l'URL
    return encodeURIComponent(message)
  }

  // Funzione per aprire Telegram con il messaggio
  const openTelegram = () => {
    if (!selectedPaymentMethod) {
      alert("Seleziona un metodo di pagamento prima di inviare la richiesta")
      return
    }

    const message = createTelegramMessage()
    window.open(`https://t.me/VTeasy?text=${message}`, "_blank")
    onSubmitOrder()
  }

  // Funzione per gestire la selezione del metodo di pagamento
  const handleSelectPaymentMethod = (paymentId: string) => {
    setSelectedPaymentMethod(paymentId)

    if (paymentId === "crypto") {
      setShowCryptoDialog(true)
    } else {
      const method = paymentMethods.find((m) => m.id === paymentId)
      if (method?.paymentUrl) {
        window.open(method.paymentUrl, "_blank")
        setPaymentCompleted(true)
      }
    }
  }

  // Funzione per copiare l'indirizzo crypto
  const copyToClipboard = (address: string, cryptoId: string) => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(cryptoId)
    setSelectedCrypto(cryptoId)

    // Reset copied status after 3 seconds
    setTimeout(() => {
      setCopiedAddress(null)
    }, 3000)

    setPaymentCompleted(true)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center">
        <Sparkles className="h-5 w-5 text-purple-400 mr-2" />
        Riepilogo dell'ordine
      </h2>

      <div className="bg-gradient-to-br from-[#0c1220] to-[#131b30] rounded-xl shadow-lg border border-gray-800">
        <div className="p-6 space-y-4">
          {/* Servizio */}
          <div className="flex justify-between items-center pb-3 border-b border-[#1e2c4a]">
            <span className="text-gray-400">Servizio</span>
            <span className="font-medium text-white text-lg">{order.serviceName}</span>
          </div>

          {/* Tipo di servizio */}
          <div className="flex justify-between items-center pb-3 border-b border-[#1e2c4a]">
            <span className="text-gray-400">Tipo servizio</span>
            <span className="font-medium text-white text-lg">{getServiceTypeDescription()}</span>
          </div>

          {/* Piattaforma - solo se non è telegram, whatsapp o licenze */}
          {order.serviceType !== "telegram" && order.serviceType !== "whatsapp" && order.serviceType !== "licenses" && (
            <div className="flex justify-between items-center pb-3 border-b border-[#1e2c4a]">
              <span className="text-gray-400">Piattaforma</span>
              <span className="font-medium text-white text-lg">{order.platformName}</span>
            </div>
          )}

          {/* Username - solo se necessario */}
          {shouldShowUsername() && (
            <div className="flex justify-between items-center pb-3 border-b border-[#1e2c4a]">
              <span className="text-gray-400">Username</span>
              <span className="font-medium text-white text-lg">@{order.username}</span>
            </div>
          )}

          {/* URL - solo se necessario */}
          {shouldShowUrl() && (
            <div className="flex justify-between items-center pb-3 border-b border-[#1e2c4a]">
              <span className="text-gray-400">URL</span>
              <span className="font-medium text-white text-lg truncate max-w-[200px]">{order.url}</span>
            </div>
          )}

          {/* Informazioni specifiche per le licenze */}
          {order.serviceType === "licenses" && (
            <>
              <div className="flex justify-between items-center pb-3 border-b border-[#1e2c4a]">
                <span className="text-gray-400">Licenza</span>
                <span className="font-medium text-white text-lg">{order.serviceSubtypeName}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-[#1e2c4a]">
                <span className="text-gray-400">Installazione remota</span>
                <span className="font-medium text-white text-lg">{order.needsRemoteInstallation ? "Sì" : "No"}</span>
              </div>

              {order.needsRemoteInstallation && order.anyDeskId && (
                <div className="flex justify-between items-center pb-3 border-b border-[#1e2c4a]">
                  <span className="text-gray-400">ID AnyDesk</span>
                  <span className="font-medium text-white text-lg">{order.anyDeskId}</span>
                </div>
              )}
            </>
          )}

          {/* Informazioni specifiche per il negozio Telegram */}
          {order.serviceType === "telegramShop" && (
            <>
              <div className="flex justify-between items-center pb-3 border-b border-[#1e2c4a]">
                <span className="text-gray-400">Tipo</span>
                <span className="font-medium text-white text-lg">{order.serviceSubtypeName}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-[#1e2c4a]">
                <span className="text-gray-400">Durata</span>
                <span className="font-medium text-white text-lg">
                  {order.quantity} {order.quantity === 1 ? "mese" : "mesi"}
                </span>
              </div>

              {order.setupFee && (
                <div className="flex justify-between items-center pb-3 border-b border-[#1e2c4a]">
                  <span className="text-gray-400">Setup iniziale</span>
                  <span className="font-medium text-white text-lg">Sì</span>
                </div>
              )}

              {order.logoDesign && (
                <div className="flex justify-between items-center pb-3 border-b border-[#1e2c4a]">
                  <span className="text-gray-400">Design del logo</span>
                  <span className="font-medium text-white text-lg">Sì</span>
                </div>
              )}

              {order.welcomeMessage && (
                <div className="flex justify-between items-center pb-3 border-b border-[#1e2c4a]">
                  <span className="text-gray-400">Messaggio di benvenuto</span>
                  <span className="font-medium text-white text-lg">Sì</span>
                </div>
              )}

              {order.categoriesSetup && (
                <div className="flex justify-between items-center pb-3 border-b border-[#1e2c4a]">
                  <span className="text-gray-400">Setup categorie</span>
                  <span className="font-medium text-white text-lg">Sì</span>
                </div>
              )}

              {order.productsCount && order.productsCount > 0 && (
                <div className="flex justify-between items-center pb-3 border-b border-[#1e2c4a]">
                  <span className="text-gray-400">Configurazione prodotti</span>
                  <span className="font-medium text-white text-lg">{order.productsCount}</span>
                </div>
              )}
            </>
          )}

          {/* Quantità - per tutti tranne telegramShop e licenses */}
          {order.serviceType !== "telegramShop" && order.serviceType !== "licenses" && (
            <div className="flex justify-between items-center pb-3 border-b border-[#1e2c4a]">
              <span className="text-gray-400">Quantità</span>
              <span className="font-medium text-white text-lg">{order.quantity.toLocaleString()}</span>
            </div>
          )}

          {/* Tipo di noleggio/acquisto - solo per telegram e whatsapp */}
          {(order.serviceType === "telegram" || order.serviceType === "whatsapp") && (
            <div className="flex justify-between items-center pb-3 border-b border-[#1e2c4a]">
              <span className="text-gray-400">Tipo</span>
              <span className="font-medium text-white text-lg">
                {order.isRental ? "Noleggio" : "Acquisto"}
                {order.isRental && ` (${order.rentalDuration} ${order.rentalDuration === 1 ? "mese" : "mesi"})`}
              </span>
            </div>
          )}

          {/* Sottotipo di servizio - per servizi specifici */}
          {order.serviceSubtype && order.serviceType !== "licenses" && order.serviceType !== "telegramShop" && (
            <div className="flex justify-between items-center pb-3 border-b border-[#1e2c4a]">
              <span className="text-gray-400">Tipo</span>
              <span className="font-medium text-white text-lg">{order.serviceSubtypeName}</span>
            </div>
          )}

          {/* Durata - solo per servizi che la richiedono */}
          {order.duration && order.serviceType !== "telegramShop" && (
            <div className="flex justify-between items-center pb-3 border-b border-[#1e2c4a]">
              <span className="text-gray-400">Durata</span>
              <span className="font-medium text-white text-lg">{order.duration} minuti</span>
            </div>
          )}

          {/* Numero di post - solo se specificato */}
          {order.postCount && (
            <div className="flex justify-between items-center pb-3 border-b border-[#1e2c4a]">
              <span className="text-gray-400">Numero post</span>
              <span className="font-medium text-white text-lg">{order.postCount}</span>
            </div>
          )}

          {/* Servizi complementari - se presenti */}
          {order.complementaryServices && order.complementaryServices.length > 0 && (
            <div className="pb-3 border-b border-[#1e2c4a]">
              <span className="text-gray-400 block mb-2">Servizi complementari</span>
              <div className="space-y-3 pl-2 border-l-2 border-purple-500/30">
                {order.complementaryServices.map((service, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Plus className="h-3 w-3 text-purple-400 mr-2" />
                        <span className="text-purple-200">{service.name}</span>
                      </div>
                      <span className="font-medium text-purple-300">€{service.price.toFixed(2)}</span>
                    </div>
                    {service.username && (
                      <div className="flex items-center ml-5 text-sm text-purple-200/70">
                        <AtSign className="h-3 w-3 mr-1 text-purple-400/70" />
                        <span>{service.username}</span>
                      </div>
                    )}
                    {service.url && (
                      <div className="flex items-center ml-5 text-sm text-purple-200/70">
                        <Link className="h-3 w-3 mr-1 text-purple-400/70" />
                        <span className="truncate max-w-[200px]">{service.url}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Informazioni di affiliazione - se presenti */}
          {userProfile.affiliateNickname && (
            <div className="flex justify-between items-center pb-3 border-b border-[#1e2c4a] bg-purple-900/10">
              <span className="text-purple-300 flex items-center">
                <User className="h-4 w-4 mr-1" />
                Affiliazione
              </span>
              <span className="font-medium text-purple-300 text-lg">{userProfile.affiliateNickname}</span>
            </div>
          )}

          {/* URL di tracciamento - se disponibile */}
          {trackingInfo?.trackingUrl && (
            <div className="flex justify-between items-center pb-3 border-b border-[#1e2c4a] bg-blue-900/10">
              <span className="text-blue-300">URL Tracciamento</span>
              <a
                href={trackingInfo.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-300 text-lg hover:underline"
              >
                Traccia ordine
              </a>
            </div>
          )}

          {/* Consegna - per tutti i servizi */}
          <div className="flex justify-between items-center pb-3 border-b border-[#1e2c4a]">
            <span className="text-gray-400">Tempo di consegna</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <span className="font-medium text-white text-lg">{order.deliveryName}</span>
                    <Info className="h-4 w-4 ml-1 text-purple-400" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">
                    {deliveryOptions.find((opt) => opt.id === order.deliveryOption)?.description}
                  </p>
                  <p className="text-xs text-purple-400 mt-1">{order.deliveryTimeDescription}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Prezzo totale - per tutti i servizi */}
          <div className="flex justify-between items-center pt-3 pb-3 border-b border-[#1e2c4a]">
            <span className="text-gray-400">Prezzo totale</span>
            <span className="font-bold text-2xl bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              €{order.price.toFixed(2)}
            </span>
          </div>

          {/* Metodi di pagamento integrati nel riepilogo */}
          <div className="pt-3">
            <span className="text-gray-400 block mb-3">Seleziona metodo di pagamento:</span>
            <div className="grid grid-cols-3 gap-2">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => handleSelectPaymentMethod(method.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedPaymentMethod === method.id
                      ? "bg-gradient-to-br from-green-600/20 to-green-700/20 border border-green-500/50"
                      : "bg-gradient-to-br from-[#151a29] to-[#1c2136] border border-gray-700 hover:border-purple-500/50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center mb-2">
                    {method.icon}
                  </div>
                  <span className="text-white text-sm">{method.name}</span>
                  {selectedPaymentMethod === method.id && (
                    <div className="flex items-center mt-1 text-green-400 text-xs">
                      <Check className="h-3 w-3 mr-1" />
                      <span>Selezionato</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {selectedPaymentMethod && (
              <div className="mt-3 p-3 bg-gradient-to-br from-[#151a29] to-[#1c2136] rounded-lg border border-gray-700">
                <p className="text-sm text-gray-300">
                  {paymentMethods.find((m) => m.id === selectedPaymentMethod)?.description}
                  {selectedPaymentMethod === "crypto" && selectedCrypto && (
                    <span className="block mt-1 text-green-400">
                      Pagamento con {cryptoAddresses.find((c) => c.id === selectedCrypto)?.name} selezionato
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          className={`w-full py-4 px-4 rounded-xl text-white flex items-center justify-center transition-all duration-200 ${
            paymentCompleted
              ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          } shadow-lg`}
          onClick={openTelegram}
        >
          <div className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            <span className="text-lg font-medium">
              {paymentCompleted ? "Invia richiesta (Pagamento completato)" : "Invia richiesta"}
            </span>
            <Badge className="ml-2 bg-blue-500 py-1">SICURO</Badge>
          </div>
        </Button>

        <div className="p-5 bg-gradient-to-r from-[#151a29] to-[#1c2136] rounded-xl shadow-inner">
          <p className="text-sm text-gray-300">
            <span className="font-medium text-purple-400">Nota:</span> Seleziona un metodo di pagamento per completare
            il pagamento, quindi clicca su "Invia richiesta" per finalizzare l'ordine. Verrai reindirizzato a Telegram
            per confermare i dettagli.
          </p>
        </div>
      </div>

      {/* Dialog per la selezione della criptovaluta */}
      <Dialog open={showCryptoDialog} onOpenChange={setShowCryptoDialog}>
        <DialogContent className="bg-gradient-to-br from-[#0c1220] to-[#131b30] border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Seleziona Criptovaluta</DialogTitle>
            <DialogDescription className="text-gray-300">
              Scegli la criptovaluta che preferisci utilizzare per il pagamento
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {cryptoAddresses.map((crypto) => (
              <div
                key={crypto.id}
                className="p-4 bg-gradient-to-br from-[#151a29] to-[#1c2136] rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center mr-3">
                      {crypto.icon}
                    </div>
                    <span className="font-medium">{crypto.name}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-gray-600 hover:bg-gray-800 hover:text-white"
                    onClick={() => copyToClipboard(crypto.address, crypto.id)}
                  >
                    {copiedAddress === crypto.id ? (
                      <Check className="h-4 w-4 mr-1 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4 mr-1" />
                    )}
                    {copiedAddress === crypto.id ? "Copiato!" : "Copia"}
                  </Button>
                </div>
                <div className="mt-2 p-2 bg-[#0a0f1e] rounded border border-gray-700 overflow-x-auto">
                  <code className="text-xs text-gray-300 break-all">{crypto.address}</code>
                </div>
                {copiedAddress === crypto.id && (
                  <p className="text-green-400 text-sm mt-2">
                    Indirizzo copiato! Incolla questo indirizzo nel tuo wallet e completa il pagamento.
                  </p>
                )}
              </div>
            ))}

            <Button
              className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              onClick={() => setShowCryptoDialog(false)}
            >
              Chiudi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
