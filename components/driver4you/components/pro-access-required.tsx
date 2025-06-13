"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, CheckCircle, X } from "lucide-react"

interface ProAccessRequiredProps {
  onVerifyPassword: (password: string) => boolean
  onSuccess: () => void
}

export function ProAccessRequired({ onVerifyPassword, onSuccess }: ProAccessRequiredProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleVerify = () => {
    const result = onVerifyPassword(password)
    if (result) {
      setSuccess(true)
      setError(false)
      setTimeout(() => {
        onSuccess()
      }, 1500)
    } else {
      setError(true)
      setSuccess(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Accesso PRO richiesto</h2>
      <p className="text-sm text-gray-400">
        Per continuare con la prenotazione, è necessario un accesso PRO. Inserisci la password per sbloccare tutte le
        funzionalità.
      </p>

      <Card className="bg-[#0c1220] border-gray-800">
        <div className="p-6 space-y-4">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-[#111c36] flex items-center justify-center mr-4">
              <Lock className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Driver4You PRO</h3>
              <p className="text-sm text-gray-400">Sblocca tutte le funzionalità premium</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="pro-password" className="text-sm text-gray-400 mb-1 block">
                Password PRO
              </label>
              <Input
                id="pro-password"
                type="password"
                placeholder="Inserisci la password"
                className="bg-gray-800 border-gray-700 text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-2 bg-red-900/30 border border-red-800 rounded-md text-red-400 text-sm flex items-center">
                <X className="h-4 w-4 mr-2" />
                Password non valida. Riprova.
              </div>
            )}

            {success && (
              <div className="p-2 bg-green-900/30 border border-green-800 rounded-md text-green-400 text-sm flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Accesso PRO sbloccato con successo!
              </div>
            )}

            <Button className="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white" onClick={handleVerify}>
              Verifica
            </Button>
          </div>
        </div>
      </Card>

      <div className="p-3 bg-[#111c36] border border-[#1e2c4a] rounded-lg">
        <p className="text-xs text-gray-300">
          <span className="font-medium">Suggerimento:</span> La password PRO è "sharing". Questo è solo un esempio
          dimostrativo.
        </p>
      </div>
    </div>
  )
}
