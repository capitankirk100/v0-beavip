"use client"

import { useState, useEffect } from "react"

export const useProAccess = () => {
  // Stato per l'accesso PRO
  const [isPro, setIsPro] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("driver4you_is_pro")
      return saved ? JSON.parse(saved) : false
    }
    return false
  })

  // Salva lo stato PRO nel localStorage quando cambia
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("driver4you_is_pro", JSON.stringify(isPro))
    }
  }, [isPro])

  // Funzione per verificare la password PRO
  const verifyProPassword = (password: string) => {
    // In un'applicazione reale, questa verifica dovrebbe essere fatta sul server
    const isValid = password.toLowerCase() === "sharing"
    if (isValid) {
      setIsPro(true)
    }
    return isValid
  }

  return {
    isPro,
    verifyProPassword,
  }
}
