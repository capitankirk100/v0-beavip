"use client"

import { Card } from "@/components/ui/card"
import { paymentMethods } from "../data/payment-methods"
import { Sparkles } from "lucide-react"
import type { OrderState } from "../types"

interface PaymentSelectionProps {
  order: OrderState
  updateOrder: (updates: Partial<OrderState>) => void
  onContinue: () => void
}

export function PaymentSelection({ order, updateOrder, onContinue }: PaymentSelectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center">
        <Sparkles className="h-5 w-5 text-purple-400 mr-2" />
        Seleziona il metodo di pagamento
      </h2>

      <div className="grid grid-cols-4 gap-3">
        {paymentMethods.map((method) => (
          <Card
            key={method.id}
            className="bg-gradient-to-br from-[#0c1220] to-[#131b30] border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20 cursor-pointer"
            onClick={() => {
              updateOrder({ paymentMethod: method.id })
              onContinue()
            }}
          >
            <div className="p-4 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center mb-3 shadow-md">
                <div className="text-white">{method.icon}</div>
              </div>
              <h3 className="font-medium text-white text-lg">{method.name}</h3>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
