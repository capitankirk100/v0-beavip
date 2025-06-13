"use client"

import { useState, useEffect } from "react"
import type { UserProfile } from "../types"

export const useUserProfile = () => {
  // Stato per il profilo utente
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("driver4you_user_profile")
      return saved
        ? JSON.parse(saved)
        : {
            name: "Utente",
            photo: "",
          }
    }
    return {
      name: "Utente",
      photo: "",
    }
  })

  // Stato per il genere dell'utente (per personalizzazione)
  const [userGender, setUserGender] = useState<"male" | "female">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("driver4you_user_gender")
      return saved ? (saved as "male" | "female") : "male"
    }
    return "male"
  })

  // Salva il profilo utente nel localStorage quando cambia
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("driver4you_user_profile", JSON.stringify(userProfile))
    }
  }, [userProfile])

  // Salva il genere dell'utente nel localStorage quando cambia
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("driver4you_user_gender", userGender)
    }
  }, [userGender])

  // Funzione per aggiornare il profilo utente
  const updateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile)
  }

  // Funzione per cambiare il genere dell'utente
  const toggleUserGender = () => {
    setUserGender((prev) => (prev === "male" ? "female" : "male"))
  }

  return {
    userProfile,
    updateUserProfile,
    userGender,
    toggleUserGender,
  }
}
