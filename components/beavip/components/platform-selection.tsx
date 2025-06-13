"use client"

import { platforms } from "../data/platforms"
import { Sparkles } from "lucide-react"

interface PlatformSelectionProps {
  onSelectPlatform: (platformId: string, platformName: string, basePrice: number) => void
}

// Funzione per ottenere i servizi disponibili per piattaforma
const getAvailableServices = (platform: string): string[] => {
  switch (platform) {
    case "instagram":
      return ["followers", "likes", "views", "comments"]
    case "tiktok":
      return ["followers", "likes", "views", "shares"]
    case "facebook":
      return ["likes", "followers", "shares"]
    case "twitter":
      return ["followers"]
    case "youtube":
      return ["youtubeServices"]
    case "twitch":
      return ["twitchServices"]
    case "telegram":
      return ["telegramMembers", "telegramViews", "telegram", "telegramShop"]
    case "whatsapp":
      return ["whatsapp"]
    case "website":
      return ["websiteVisits"]
    case "windows":
      return ["licenses"]
    default:
      return []
  }
}

export function PlatformSelection({ onSelectPlatform }: PlatformSelectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center">
        <Sparkles className="h-5 w-5 text-purple-400 mr-2" />
        Seleziona la piattaforma
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className="bg-gradient-to-br from-[#0c1220] to-[#131b30] rounded-xl p-6 cursor-pointer hover:shadow-lg hover:shadow-purple-900/20 transition-all duration-300 border border-gray-800 hover:border-purple-500/50"
            onClick={() => onSelectPlatform(platform.id, platform.name, platform.basePrice)}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center mb-4 shadow-md">
                <div className="text-white">{platform.icon}</div>
              </div>
              <h3 className="font-medium text-white text-lg">{platform.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
