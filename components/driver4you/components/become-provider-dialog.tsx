"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { useState } from "react"

interface BecomeProviderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BecomeProviderDialog({ open, onOpenChange }: BecomeProviderDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    carModel: "",
    licenseNumber: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Crea il messaggio per Telegram
    const message = `
🚗 *RICHIESTA CAR SHARING DRIVER4YOU* 🚗

*Nome e Cognome:* ${formData.name}
*Telefono:* ${formData.phone}
*Email:* ${formData.email}
*Modello Auto:* ${formData.carModel}
*Numero Patente:* ${formData.licenseNumber}

Richiedo di entrare a far parte della community di Driver4You come fornitore di servizi di trasporto.
`

    // Codifica il messaggio per l'URL
    const encodedMessage = encodeURIComponent(message)

    // Apri Telegram con il messaggio
    window.open(`https://t.me/VTeasy?text=${encodedMessage}`, "_blank")

    // Chiudi il dialog
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0a0d14] text-white border-gray-800 max-w-lg p-0">
        <DialogHeader className="p-6 pb-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Diventa Car Sharing</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-gray-400 mt-2">
            Compila il modulo per unirti alla community di Driver4You come fornitore di servizi di trasporto.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm text-gray-300">
              Nome e Cognome
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-[#151a29] border-gray-700 text-white"
              placeholder="Inserisci il tuo nome completo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm text-gray-300">
              Numero di Telefono
            </Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="bg-[#151a29] border-gray-700 text-white"
              placeholder="Es. 333 1234567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-[#151a29] border-gray-700 text-white"
              placeholder="La tua email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="carModel" className="text-sm text-gray-300">
              Modello Auto
            </Label>
            <Input
              id="carModel"
              name="carModel"
              value={formData.carModel}
              onChange={handleChange}
              required
              className="bg-[#151a29] border-gray-700 text-white"
              placeholder="Es. Fiat Panda"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="licenseNumber" className="text-sm text-gray-300">
              Numero Patente
            </Label>
            <Input
              id="licenseNumber"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
              className="bg-[#151a29] border-gray-700 text-white"
              placeholder="Numero della tua patente"
            />
          </div>

          <div className="pt-4 flex flex-col space-y-2">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Invia Richiesta
            </Button>
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className="w-full bg-[#1e293b] hover:bg-[#283548] text-white"
            >
              Annulla
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
