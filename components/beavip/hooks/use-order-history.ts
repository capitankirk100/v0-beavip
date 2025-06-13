"use client"

import { useState, useEffect } from "react"
import type { OrderState, ComplementaryService } from "../types"

export interface SavedOrder extends OrderState {
  id: string
  date: string
  status: "pending" | "completed" | "canceled"
  estimatedCompletionTime: string
  trackingUrl: string
  complementaryServices?: ComplementaryService[]
}

export const useOrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState<SavedOrder[]>([])

  // Carica lo storico degli ordini dal localStorage all'avvio
  useEffect(() => {
    const savedHistory = localStorage.getItem("beavip_order_history")
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory)
        setOrderHistory(parsedHistory)

        // Controlla se ci sono ordini in attesa che dovrebbero essere completati
        const now = new Date().getTime()
        const updatedHistory = parsedHistory.map((order: SavedOrder) => {
          if (order.status === "pending" && order.estimatedCompletionTime) {
            const completionTime = new Date(order.estimatedCompletionTime).getTime()
            if (now >= completionTime) {
              return { ...order, status: "completed" }
            }
          }
          return order
        })

        // Se ci sono stati aggiornamenti, salva lo storico aggiornato
        if (JSON.stringify(parsedHistory) !== JSON.stringify(updatedHistory)) {
          setOrderHistory(updatedHistory)
          localStorage.setItem("beavip_order_history", JSON.stringify(updatedHistory))
        }
      } catch (error) {
        console.error("Errore nel parsing dello storico ordini:", error)
      }
    }
  }, [])

  // Funzione per aggiungere un nuovo ordine allo storico
  const addOrder = (order: OrderState): { orderId: string; trackingUrl: string } => {
    // Genera un ID univoco per l'ordine
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`

    // Calcola il tempo stimato di completamento (4 ore dal momento dell'ordine)
    const now = new Date()
    const estimatedCompletionTime = new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString()

    // Crea l'URL di tracciamento
    const trackingUrl = `https://beavip.vercel.app/track/${orderId}`

    // Crea il nuovo ordine
    const newOrder: SavedOrder = {
      ...order,
      id: orderId,
      date: now.toISOString(),
      status: "pending",
      estimatedCompletionTime,
      trackingUrl,
    }

    // Aggiorna lo storico degli ordini
    const updatedHistory = [newOrder, ...orderHistory]
    setOrderHistory(updatedHistory)

    // Salva lo storico aggiornato nel localStorage
    localStorage.setItem("beavip_order_history", JSON.stringify(updatedHistory))

    return { orderId, trackingUrl }
  }

  // Funzione per aggiornare lo stato di un ordine
  const updateOrderStatus = (orderId: string, status: "pending" | "completed" | "canceled") => {
    const updatedHistory = orderHistory.map((order) => {
      if (order.id === orderId) {
        return { ...order, status }
      }
      return order
    })

    setOrderHistory(updatedHistory)
    localStorage.setItem("beavip_order_history", JSON.stringify(updatedHistory))
  }

  // Funzione per eliminare un ordine
  const deleteOrder = (orderId: string) => {
    const updatedHistory = orderHistory.filter((order) => order.id !== orderId)
    setOrderHistory(updatedHistory)
    localStorage.setItem("beavip_order_history", JSON.stringify(updatedHistory))
  }

  // Funzione per ottenere un ordine specifico per ID
  const getOrderById = (orderId: string): SavedOrder | null => {
    return orderHistory.find((order) => order.id === orderId) || null
  }

  return {
    orderHistory,
    addOrder,
    updateOrderStatus,
    deleteOrder,
    getOrderById,
  }
}
