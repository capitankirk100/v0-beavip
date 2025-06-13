"use client"

import { Card } from "@/components/ui/card"
import type { BookingState } from "../types"

interface PaymentSelectionProps {
  booking: BookingState
  updateBooking: (updates: Partial<BookingState>) => void
  onContinue: () => void
}

export function PaymentSelection({ booking, updateBooking, onContinue }: PaymentSelectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Seleziona il metodo di pagamento</h2>

      <div className="grid grid-cols-3 gap-3">
        <Card
          className="bg-[#151a29] border-gray-800 hover:border-blue-500 transition-all cursor-pointer"
          onClick={() => {
            updateBooking({ paymentMethod: "Cash" })
            onContinue()
          }}
        >
          <div className="p-4 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-400"
              >
                <rect width="20" height="12" x="2" y="6" rx="2" />
                <circle cx="12" cy="12" r="2" />
                <path d="M6 12h.01M18 12h.01" />
              </svg>
            </div>
            <h3 className="font-medium text-white text-sm">Contanti</h3>
          </div>
        </Card>

        <Card
          className="bg-[#151a29] border-gray-800 hover:border-blue-500 transition-all cursor-pointer"
          onClick={() => {
            updateBooking({ paymentMethod: "Card" })
            onContinue()
          }}
        >
          <div className="p-4 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-400"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
            </div>
            <h3 className="font-medium text-white text-sm">Carta</h3>
          </div>
        </Card>

        <Card
          className="bg-[#151a29] border-gray-800 hover:border-blue-500 transition-all cursor-pointer"
          onClick={() => {
            updateBooking({ paymentMethod: "PayPal" })
            onContinue()
          }}
        >
          <div className="p-4 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-400"
              >
                <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                <path d="M15 12V8a5 5 0 0 0-9.9-1" />
                <rect width="10" height="14" x="2" y="5" rx="2" />
                <path d="M12 19h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              </svg>
            </div>
            <h3 className="font-medium text-white text-sm">PayPal</h3>
          </div>
        </Card>
      </div>
    </div>
  )
}
