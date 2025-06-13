"use client"

import { useState, useEffect } from "react"

export const useCookieConsent = () => {
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Carica lo stato del consenso dai cookie al caricamento della pagina
  useEffect(() => {
    const storedConsent = localStorage.getItem("driver4you_cookie_consent")
    if (storedConsent !== null) {
      setCookieConsent(storedConsent === "true")
    }
    setIsLoading(false)
  }, [])

  // Funzione per accettare i cookie
  const acceptCookies = () => {
    localStorage.setItem("driver4you_cookie_consent", "true")
    setCookieConsent(true)
  }

  // Funzione per rifiutare i cookie
  const rejectCookies = () => {
    localStorage.setItem("driver4you_cookie_consent", "false")
    setCookieConsent(false)
  }

  // Funzione per resettare il consenso ai cookie
  const resetCookieConsent = () => {
    localStorage.removeItem("driver4you_cookie_consent")
    setCookieConsent(null)
  }

  return {
    cookieConsent,
    isLoading,
    acceptCookies,
    rejectCookies,
    resetCookieConsent,
  }
}
