"use client"

import { useState, useEffect } from "react"

export interface BeavipUserProfile {
  name: string
  photo?: string
  affiliateNickname?: string
  email?: string
}

export const useUserProfile = () => {
  // Stato per il profilo utente
  const [userProfile, setUserProfile] = useState<BeavipUserProfile>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("beavip_user_profile")
      return saved
        ? JSON.parse(saved)
        : {
            name: "Utente",
            photo: "",
            affiliateNickname: "",
            email: "",
          }
    }
    return {
      name: "Utente",
      photo: "",
      affiliateNickname: "",
      email: "",
    }
  })

  // Salva il profilo utente nel localStorage quando cambia
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("beavip_user_profile", JSON.stringify(userProfile))
    }
  }, [userProfile])

  // Funzione per aggiornare il profilo utente
  const updateUserProfile = (profile: Partial<BeavipUserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profile }))
  }

  return {
    userProfile,
    updateUserProfile,
  }
}
