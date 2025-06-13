"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Clock, CheckCircle, AlertCircle, ArrowLeft, Share2, Plus, Link, AtSign } from "lucide-react"
import type { SavedOrder } from "../hooks/use-order-history"

interface OrderTrackingProps {
  order: SavedOrder
  onBack: () => void
}

export function OrderTracking({ order, onBack }: OrderTrackingProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [progress, setProgress] = useState<number>(0)
  const [isCompleted, setIsCompleted] = useState<boolean>(order.status === "completed")
  const [isCanceled, setIsCanceled] = useState<boolean>(order.status === "canceled")
  const [showCopiedMessage, setShowCopiedMessage] = useState<boolean>(false)

  useEffect(() => {
    if (order.status === "completed") {
      setIsCompleted(true)
      setProgress(100)
      return
    }

    if (order.status === "canceled") {
      setIsCanceled(true)
      return
    }

    if (!order.estimatedCompletionTime) return

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const estimatedTime = new Date(order.estimatedCompletionTime).getTime()
      const orderTime = new Date(order.date).getTime()

      const totalDuration = estimatedTime - orderTime
      const elapsed = now - orderTime

      // Se il tempo stimato è passato, considera l'ordine completato
      if (now >= estimatedTime) {
        setIsCompleted(true)
        setProgress(100)
        setTimeLeft(0)
        return
      }

      // Calcola il tempo rimanente in minuti
      const remaining = Math.max(0, Math.floor((estimatedTime - now) / (1000 * 60)))
      setTimeLeft(remaining)

      // Calcola la percentuale di progresso
      const progressPercentage = Math.min(100, Math.floor((elapsed / totalDuration) * 100))
      setProgress(progressPercentage)
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [order])

  const formatTimeLeft = () => {
    if (timeLeft <= 0) return "Completamento imminente"

    const hours = Math.floor(timeLeft / 60)
    const minutes = timeLeft % 60

    if (hours > 0) {
      return `${hours} ${hours === 1 ? "ora" : "ore"} e ${minutes} ${minutes === 1 ? "minuto" : "minuti"}`
    }

    return `${minutes} ${minutes === 1 ? "minuto" : "minuti"}`
  }

  const getStatusBadge = () => {
    if (isCompleted) {
      return <Badge className="bg-green-600">Completato</Badge>
    }

    if (isCanceled) {
      return <Badge className="bg-gray-600">Annullato</Badge>
    }

    return <Badge className="bg-yellow-600 animate-pulse">In elaborazione</Badge>
  }

  const getServiceDescription = () => {
    if (order.isPackage) {
      return `Pacchetto: ${order.packageId}`
    }

    if (order.isSubscription) {
      return `Abbonamento: ${order.subscriptionId}`
    }

    return `${order.serviceName} - ${order.platformName}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const copyTrackingUrl = () => {
    if (order.trackingUrl) {
      navigator.clipboard.writeText(order.trackingUrl)
      setShowCopiedMessage(true)
      setTimeout(() => setShowCopiedMessage(false), 3000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="text-white hover:bg-purple-900/20">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Torna indietro
        </Button>
        <Button variant="outline" onClick={copyTrackingUrl} className="text-white border-gray-700 hover:bg-gray-800">
          <Share2 className="h-4 w-4 mr-2" />
          {showCopiedMessage ? "URL copiato!" : "Condividi"}
        </Button>
      </div>

      <Card className="bg-gradient-to-br from-[#0c1220] to-[#131b30] border-gray-800 text-white">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl flex items-center">
              <Sparkles className="h-5 w-5 text-purple-400 mr-2" />
              Tracciamento Ordine
            </CardTitle>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">ID Ordine:</span>
              <span className="font-medium">{order.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Servizio:</span>
              <span className="font-medium">{getServiceDescription()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Data ordine:</span>
              <span className="font-medium">{formatDate(order.date)}</span>
            </div>

            {/* Servizi complementari - se presenti */}
            {order.complementaryServices && order.complementaryServices.length > 0 && (
              <div className="pt-2">
                <span className="text-gray-400 block mb-1">Servizi complementari:</span>
                <div className="space-y-2 pl-2 border-l-2 border-purple-500/30">
                  {order.complementaryServices.map((service, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Plus className="h-3 w-3 text-purple-400 mr-2" />
                          <span className="text-purple-200 text-sm">{service.name}</span>
                        </div>
                        <span className="font-medium text-purple-300 text-sm">€{service.price.toFixed(2)}</span>
                      </div>
                      {service.username && (
                        <div className="flex items-center ml-5 text-xs text-purple-200/70">
                          <AtSign className="h-3 w-3 mr-1 text-purple-400/70" />
                          <span>{service.username}</span>
                        </div>
                      )}
                      {service.url && (
                        <div className="flex items-center ml-5 text-xs text-purple-200/70">
                          <Link className="h-3 w-3 mr-1 text-purple-400/70" />
                          <span className="truncate max-w-[200px]">{service.url}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {order.affiliateNickname && (
              <div className="flex justify-between text-sm">
                <span className="text-purple-400">Affiliazione:</span>
                <span className="font-medium text-purple-300">{order.affiliateNickname}</span>
              </div>
            )}
          </div>

          {!isCanceled && (
            <div className="space-y-3 pt-3">
              {isCompleted ? (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                  <div>
                    <h4 className="font-medium text-green-300">Servizio completato</h4>
                    <p className="text-sm text-green-200/70">
                      Il tuo ordine è stato elaborato e completato con successo.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center text-yellow-300">
                        <Clock className="h-4 w-4 mr-1" />
                        Tempo stimato rimanente:
                      </span>
                      <span className="font-medium text-yellow-200">{formatTimeLeft()}</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-gray-700" />
                  </div>

                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="font-medium text-blue-300 mb-2">Stato elaborazione</h4>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-3 text-xs">
                          ✓
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Ordine ricevuto</p>
                          <p className="text-xs text-gray-400">Il tuo ordine è stato ricevuto e registrato</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs ${
                            progress > 30 ? "bg-green-500" : "bg-blue-600 animate-pulse"
                          }`}
                        >
                          {progress > 30 ? "✓" : "⋯"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">In elaborazione</p>
                          <p className="text-xs text-gray-400">
                            {progress > 30 ? "L'ordine è stato elaborato" : "Stiamo elaborando il tuo ordine"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs ${
                            progress > 70 ? "bg-green-500" : "bg-gray-600"
                          }`}
                        >
                          {progress > 70 ? "✓" : "⋯"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Erogazione servizio</p>
                          <p className="text-xs text-gray-400">
                            {progress > 70 ? "Il servizio è in fase di erogazione" : "In attesa di erogazione"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs ${
                            isCompleted ? "bg-green-500" : "bg-gray-600"
                          }`}
                        >
                          {isCompleted ? "✓" : "⋯"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Completato</p>
                          <p className="text-xs text-gray-400">
                            {isCompleted ? "Il servizio è stato completato con successo" : "In attesa di completamento"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-lg p-4 flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0" />
                    <p className="text-sm text-yellow-200/70">
                      I tempi di elaborazione possono variare in base al carico di lavoro. In alcuni casi, potrebbe
                      essere necessario più tempo del previsto. Grazie per la pazienza!
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {isCanceled && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-center">
              <AlertCircle className="h-6 w-6 text-red-400 mr-3" />
              <div>
                <h4 className="font-medium text-red-300">Ordine annullato</h4>
                <p className="text-sm text-red-200/70">
                  Questo ordine è stato annullato. Contattaci per maggiori informazioni.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
