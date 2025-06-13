"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Clock, ArrowRight } from "lucide-react"
import { flashPromotions } from "../data/packages"
import type { FlashPromotion } from "../types"

interface FlashPromotionsProps {
  onSelectPromotion: (packageId: string) => void
}

export function FlashPromotions({ onSelectPromotion }: FlashPromotionsProps) {
  const [activePromotions, setActivePromotions] = useState<
    (FlashPromotion & { timeLeft: string; percentComplete: number })[]
  >([])
  const [now, setNow] = useState(new Date())

  // Aggiorna il tempo ogni secondo
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Calcola il tempo rimanente per ogni promozione
  useEffect(() => {
    const updatedPromotions = flashPromotions
      .map((promo) => {
        const startTime = new Date(promo.startTime)
        const endTime = new Date(startTime.getTime() + promo.durationHours * 60 * 60 * 1000)
        const totalDurationMs = promo.durationHours * 60 * 60 * 1000
        const elapsedMs = now.getTime() - startTime.getTime()
        const remainingMs = endTime.getTime() - now.getTime()
        const percentComplete = Math.min(100, Math.max(0, (elapsedMs / totalDurationMs) * 100))

        // Se la promozione è scaduta, non includerla
        if (remainingMs <= 0) {
          return null
        }

        // Formatta il tempo rimanente
        const hours = Math.floor(remainingMs / (1000 * 60 * 60))
        const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000)

        let timeLeft = ""
        if (hours > 0) {
          timeLeft = `${hours}h ${minutes}m ${seconds}s`
        } else if (minutes > 0) {
          timeLeft = `${minutes}m ${seconds}s`
        } else {
          timeLeft = `${seconds}s`
        }

        return {
          ...promo,
          timeLeft,
          percentComplete,
        }
      })
      .filter(Boolean) as (FlashPromotion & { timeLeft: string; percentComplete: number })[]

    setActivePromotions(updatedPromotions)
  }, [now])

  // Se non ci sono promozioni attive, non mostrare nulla
  if (activePromotions.length === 0) {
    return null
  }

  return (
    <div className="space-y-4 mb-8">
      <h3 className="text-lg font-bold text-white flex items-center">
        <Zap className="h-5 w-5 text-yellow-400 mr-2" />
        Offerte Flash
      </h3>

      <div className="grid grid-cols-1 gap-4">
        {activePromotions.map((promo) => (
          <Card
            key={promo.id}
            className="bg-gradient-to-br from-[#0c1220] to-[#131b30] border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 overflow-hidden"
          >
            <div className="h-1 bg-gray-700 w-full">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-amber-500"
                style={{ width: `${promo.percentComplete}%` }}
              ></div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-white">{promo.name}</h4>
                  <p className="text-sm text-yellow-300">{promo.description}</p>
                </div>
                <Badge className="bg-gradient-to-r from-yellow-600 to-amber-600 animate-pulse">
                  -{promo.discountPercentage}%
                </Badge>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center text-amber-400 text-sm font-medium">
                  <Clock className="h-4 w-4 mr-1" />
                  {promo.timeLeft}
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white"
                  onClick={() => onSelectPromotion(promo.packageId)}
                >
                  Approfitta ora <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
