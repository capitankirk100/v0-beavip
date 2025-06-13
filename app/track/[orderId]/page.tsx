"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useOrderHistory } from "@/components/beavip/hooks/use-order-history"
import { OrderTracking } from "@/components/beavip/components/order-tracking"
import { Button } from "@/components/ui/button"
import { Zap, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TrackOrderPage() {
  const params = useParams()
  const orderId = params.orderId as string
  const { getOrderById } = useOrderHistory()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      const foundOrder = getOrderById(orderId)
      setOrder(foundOrder)
      setLoading(false)
    }
  }, [orderId, getOrderById])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#050914] to-[#0a0f1e] p-4 md:p-8 flex items-center justify-center">
        <div className="animate-pulse text-white text-center">
          <div className="w-12 h-12 rounded-full bg-purple-600 mx-auto mb-4 flex items-center justify-center">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <p>Caricamento in corso...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#050914] to-[#0a0f1e] p-4 md:p-8">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-600/20 mx-auto mb-4 flex items-center justify-center">
            <Zap className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Ordine non trovato</h1>
          <p className="text-gray-400">L'ordine che stai cercando non esiste o potrebbe essere stato eliminato.</p>
          <Link href="/beavip">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna a Beavip
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050914] to-[#0a0f1e] p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <OrderTracking order={order} onBack={() => (window.location.href = "/beavip")} />
      </div>
    </div>
  )
}
