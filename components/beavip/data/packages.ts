import type { ServicePackage, SubscriptionPlan, FlashPromotion } from "../types"

// Pacchetti combinati di servizi complementari
export const combinedPackages: ServicePackage[] = [
  {
    id: "telegram-business",
    name: "Telegram Business Complete",
    description: "Negozio Telegram + Numero verificato + 1000 membri per il tuo canale",
    services: [
      {
        serviceType: "telegramShop",
        platform: "telegram",
        platformName: "Telegram",
        serviceSubtype: "shop",
        serviceSubtypeName: "Negozio Standard",
        quantity: 1, // 1 negozio
        duration: 3, // 3 mesi
        setupFee: true,
        logoDesign: true,
        categoriesSetup: true,
      },
      {
        serviceType: "telegram",
        platform: "telegram",
        platformName: "Telegram",
        quantity: 1, // 1 numero
        isRental: true,
        rentalDuration: 3, // 3 mesi
      },
      {
        serviceType: "telegramMembers",
        platform: "telegram",
        platformName: "Telegram",
        serviceSubtype: "members",
        serviceSubtypeName: "Standard",
        quantity: 1000, // 1000 membri per il canale
        targetType: "channel", // Specificato che è per un canale
      },
    ],
    regularPrice: 149.99,
    discountedPrice: 119.99,
    savings: 30,
    popularityBadge: "BESTSELLER",
    featured: true,
  },
  {
    id: "instagram-growth",
    name: "Instagram Growth Pack",
    description: "Followers + Likes + Visualizzazioni per far crescere il tuo profilo",
    services: [
      {
        serviceType: "followers",
        platform: "instagram",
        platformName: "Instagram",
        quantity: 1000,
      },
      {
        serviceType: "likes",
        platform: "instagram",
        platformName: "Instagram",
        quantity: 1000,
      },
      {
        serviceType: "views",
        platform: "instagram",
        platformName: "Instagram",
        quantity: 5000,
      },
    ],
    regularPrice: 24.98,
    discountedPrice: 19.99,
    savings: 20,
    popularityBadge: "POPOLARE",
    featured: true,
  },
  {
    id: "tiktok-viral",
    name: "TikTok Viral Pack",
    description: "Visualizzazioni + Likes + Condivisioni per far diventare virali i tuoi video",
    services: [
      {
        serviceType: "views",
        platform: "tiktok",
        platformName: "TikTok",
        serviceSubtype: "viewsCheap",
        serviceSubtypeName: "Economiche",
        quantity: 10000,
      },
      {
        serviceType: "likes",
        platform: "tiktok",
        platformName: "TikTok",
        serviceSubtype: "likes",
        serviceSubtypeName: "Standard",
        quantity: 1000,
      },
      {
        serviceType: "shares",
        platform: "tiktok",
        platformName: "TikTok",
        serviceSubtype: "shares",
        serviceSubtypeName: "Standard",
        quantity: 500,
      },
    ],
    regularPrice: 17.18,
    discountedPrice: 13.99,
    savings: 19,
    popularityBadge: "TRENDING",
    featured: true,
  },
  {
    id: "youtube-starter",
    name: "YouTube Starter Pack",
    description: "Visualizzazioni + Likes + Iscritti per lanciare il tuo canale",
    services: [
      {
        serviceType: "youtubeServices",
        platform: "youtube",
        platformName: "YouTube",
        serviceSubtype: "viewsHQ",
        serviceSubtypeName: "HQ Views",
        quantity: 5000,
      },
      {
        serviceType: "youtubeServices",
        platform: "youtube",
        platformName: "YouTube",
        serviceSubtype: "likes",
        serviceSubtypeName: "Likes",
        quantity: 500,
      },
      {
        serviceType: "youtubeServices",
        platform: "youtube",
        platformName: "YouTube",
        serviceSubtype: "subscribers",
        serviceSubtypeName: "Subscribers",
        quantity: 250,
      },
    ],
    regularPrice: 45.65,
    discountedPrice: 39.99,
    savings: 12,
    popularityBadge: "NUOVO",
    featured: false,
  },
  {
    id: "facebook-business",
    name: "Facebook Business Pack",
    description: "Likes + Reazioni + Condivisioni per la tua pagina aziendale",
    services: [
      {
        serviceType: "likes",
        platform: "facebook",
        platformName: "Facebook",
        serviceSubtype: "postLikes",
        serviceSubtypeName: "Post/Photo Likes",
        quantity: 1000,
      },
      {
        serviceType: "likes",
        platform: "facebook",
        platformName: "Facebook",
        serviceSubtype: "postReactions",
        serviceSubtypeName: "Post Reactions",
        quantity: 500,
      },
      {
        serviceType: "shares",
        platform: "facebook",
        platformName: "Facebook",
        quantity: 250,
      },
    ],
    regularPrice: 35.99,
    discountedPrice: 29.99,
    savings: 17,
    popularityBadge: "BUSINESS",
    featured: false,
  },
  {
    id: "twitch-streamer",
    name: "Twitch Streamer Pack",
    description: "Followers per aumentare la tua visibilità",
    services: [
      {
        serviceType: "twitchServices",
        platform: "twitch",
        platformName: "Twitch",
        serviceSubtype: "followers",
        serviceSubtypeName: "Followers",
        quantity: 1000,
      },
    ],
    regularPrice: 25.99,
    discountedPrice: 19.99,
    savings: 23,
    popularityBadge: "GAMER",
    featured: false,
  },
  {
    id: "website-traffic",
    name: "Website Traffic Pack",
    description: "Visite da diverse fonti social per il tuo sito web",
    services: [
      {
        serviceType: "websiteVisits",
        platform: "website",
        platformName: "Sito Web",
        serviceSubtype: "fromFacebook",
        serviceSubtypeName: "Da Facebook",
        quantity: 5000,
      },
      {
        serviceType: "websiteVisits",
        platform: "website",
        platformName: "Sito Web",
        serviceSubtype: "fromInstagram",
        serviceSubtypeName: "Da Instagram",
        quantity: 5000,
      },
    ],
    regularPrice: 13.69,
    discountedPrice: 11.99,
    savings: 12,
    popularityBadge: "SEO",
    featured: false,
  },
  {
    id: "software-bundle",
    name: "Software Essential Bundle",
    description: "Windows 11 Pro + Office 2021 con installazione remota",
    services: [
      {
        serviceType: "licenses",
        platform: "licenses",
        platformName: "Licenze Software",
        serviceSubtype: "win11ProRetail1PC",
        serviceSubtypeName: "[Retail] Windows 11 Pro",
        needsRemoteInstallation: true,
      },
      {
        serviceType: "licenses",
        platform: "licenses",
        platformName: "Licenze Software",
        serviceSubtype: "office2021ProPhone3PC",
        serviceSubtypeName: "[Phone] Office 2021 Pro Plus",
        needsRemoteInstallation: true,
      },
    ],
    regularPrice: 55.0,
    discountedPrice: 45.99,
    savings: 16,
    popularityBadge: "ESSENZIALE",
    featured: false,
  },
]

// Piani di abbonamento mensile
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "instagram-monthly",
    name: "Instagram Growth Monthly",
    description: "Crescita costante per il tuo profilo Instagram",
    services: [
      {
        serviceType: "followers",
        platform: "instagram",
        platformName: "Instagram",
        quantity: 500,
        frequency: "mensile",
      },
      {
        serviceType: "likes",
        platform: "instagram",
        platformName: "Instagram",
        quantity: 1000,
        frequency: "mensile",
        distributionType: "50 likes su 20 post",
      },
    ],
    price: 19.99,
    billingCycle: "mensile",
    minimumCommitment: 3,
    popularityBadge: "BESTSELLER",
    featured: true,
    regularPrice: 24.99, // Prezzo regolare per mostrare lo sconto
    savings: 20, // Percentuale di sconto
  },
  {
    id: "youtube-monthly",
    name: "YouTube Growth Monthly",
    description: "Crescita costante per il tuo canale YouTube",
    services: [
      {
        serviceType: "youtubeServices",
        platform: "youtube",
        platformName: "YouTube",
        serviceSubtype: "viewsHQ",
        serviceSubtypeName: "HQ Views",
        quantity: 5000,
        frequency: "mensile",
        distributionType: "1000 views su 5 video",
      },
      {
        serviceType: "youtubeServices",
        platform: "youtube",
        platformName: "YouTube",
        serviceSubtype: "likes",
        serviceSubtypeName: "Likes",
        quantity: 250,
        frequency: "mensile",
        distributionType: "50 likes su 5 video",
      },
    ],
    price: 29.99,
    billingCycle: "mensile",
    minimumCommitment: 3,
    popularityBadge: "POPOLARE",
    featured: true,
    regularPrice: 37.99, // Prezzo regolare per mostrare lo sconto
    savings: 21, // Percentuale di sconto
  },
  {
    id: "tiktok-monthly",
    name: "TikTok Viral Monthly",
    description: "Boost costante per i tuoi video TikTok",
    services: [
      {
        serviceType: "views",
        platform: "tiktok",
        platformName: "TikTok",
        serviceSubtype: "viewsCheap",
        serviceSubtypeName: "Economiche",
        quantity: 10000,
        frequency: "mensile",
        distributionType: "1000 views su 10 video",
      },
      {
        serviceType: "likes",
        platform: "tiktok",
        platformName: "TikTok",
        serviceSubtype: "likes",
        serviceSubtypeName: "Standard",
        quantity: 500,
        frequency: "mensile",
        distributionType: "50 likes su 10 video",
      },
    ],
    price: 14.99,
    billingCycle: "mensile",
    minimumCommitment: 2,
    popularityBadge: "TRENDING",
    featured: true,
    regularPrice: 19.99, // Prezzo regolare per mostrare lo sconto
    savings: 25, // Percentuale di sconto
  },
  {
    id: "telegram-monthly",
    name: "Telegram Channel Growth",
    description: "Crescita costante per il tuo canale Telegram",
    services: [
      {
        serviceType: "telegramMembers",
        platform: "telegram",
        platformName: "Telegram",
        serviceSubtype: "members",
        serviceSubtypeName: "Standard",
        quantity: 500,
        frequency: "mensile",
        targetType: "channel", // Specificato che è per un canale
      },
      {
        serviceType: "telegramViews",
        platform: "telegram",
        platformName: "Telegram",
        serviceSubtype: "views",
        serviceSubtypeName: "Standard",
        quantity: 5000,
        frequency: "mensile",
        distributionType: "500 views su 10 post",
      },
    ],
    price: 9.99,
    billingCycle: "mensile",
    minimumCommitment: 2,
    popularityBadge: "ECONOMICO",
    featured: false,
    regularPrice: 12.99, // Prezzo regolare per mostrare lo sconto
    savings: 23, // Percentuale di sconto
  },
]

// Suggerimenti di upselling basati sul servizio selezionato
export const upsellingRecommendations = {
  // Per servizi Telegram
  telegramShop: [
    {
      serviceType: "telegram",
      name: "Numero Telegram Verificato",
      description: "Aggiungi un numero verificato per gestire il tuo negozio",
      price: 40,
    },
    {
      serviceType: "telegramMembers",
      name: "1000 Membri per il tuo canale",
      description: "Aumenta la visibilità del tuo canale collegato al negozio",
      price: 10.37,
      targetType: "channel",
    },
  ],
  telegram: [
    {
      serviceType: "telegramShop",
      name: "Negozio Telegram",
      description: "Crea un negozio per vendere i tuoi prodotti",
      price: 9.99,
      duration: 1, // 1 mese
    },
  ],
  telegramMembers: [
    {
      serviceType: "telegramViews",
      name: "1000 Visualizzazioni",
      description: "Aumenta la visibilità dei tuoi post nel canale",
      price: 0.089,
    },
  ],

  // Per servizi Instagram
  followers: [
    {
      serviceType: "likes",
      name: "1000 Likes",
      description: "Aggiungi likes per aumentare l'engagement",
      price: 9.99,
    },
    {
      serviceType: "views",
      name: "5000 Visualizzazioni",
      description: "Aumenta la visibilità dei tuoi reels",
      price: 7.25,
    },
  ],
  likes: [
    {
      serviceType: "followers",
      name: "1000 Followers",
      description: "Aumenta la tua credibilità con più followers",
      price: 6.99,
    },
  ],
  views: [
    {
      serviceType: "likes",
      name: "500 Likes",
      description: "Aggiungi likes per aumentare l'engagement",
      price: 5.94,
    },
  ],

  // Per servizi YouTube
  youtubeServices: [
    {
      serviceType: "websiteVisits",
      name: "1000 Visite al tuo sito",
      description: "Converti i visualizzatori in visitatori del tuo sito",
      price: 2.13,
    },
  ],

  // Per servizi TikTok
  tiktokViews: [
    {
      serviceType: "likes",
      name: "500 Likes TikTok",
      description: "Aggiungi likes per aumentare l'engagement",
      price: 1.73,
    },
  ],

  // Per licenze software
  licenses: [
    {
      serviceType: "licenses",
      name: "Installazione Remota",
      description: "Lascia che un nostro tecnico installi il software per te",
      price: 15,
    },
  ],
}

// Promozioni flash a tempo limitato (con countdown in ore/minuti)
export const flashPromotions: FlashPromotion[] = [
  {
    id: "flash-telegram",
    name: "⚡ FLASH: Telegram Business",
    description: "Solo per le prossime ore! 40% di sconto sul pacchetto Telegram Business",
    packageId: "telegram-business",
    discountPercentage: 40,
    durationHours: 6, // Durata in ore
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // Iniziata 2 ore fa
  },
  {
    id: "flash-instagram",
    name: "⚡ FLASH: Instagram Growth",
    description: "Offerta lampo! 35% di sconto sul pacchetto Instagram Growth",
    packageId: "instagram-growth",
    discountPercentage: 35,
    durationHours: 4, // Durata in ore
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // Iniziata 1 ora fa
  },
  {
    id: "flash-tiktok",
    name: "⚡ FLASH: TikTok Viral",
    description: "Ultimi minuti! 30% di sconto sul pacchetto TikTok Viral",
    packageId: "tiktok-viral",
    discountPercentage: 30,
    durationHours: 3, // Durata in ore
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 2.5).toISOString(), // Iniziata 2.5 ore fa
  },
]

// Promozioni a tempo limitato (con countdown in giorni)
export const limitedTimeOffers = [
  {
    id: "summer-special",
    name: "Offerta Estate 2025",
    description: "50% di sconto su tutti i pacchetti Instagram",
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 giorni da ora
    discountPercentage: 50,
    applicablePackages: ["instagram-growth"],
    minimumPurchase: 0,
  },
  {
    id: "new-customer",
    name: "Benvenuto Nuovo Cliente",
    description: "20% di sconto sul primo acquisto",
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 giorni da ora
    discountPercentage: 20,
    applicablePackages: ["all"],
    minimumPurchase: 0,
    newCustomersOnly: true,
  },
  {
    id: "bulk-discount",
    name: "Sconto Quantità",
    description: "15% di sconto per ordini superiori a €100",
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 giorni da ora
    discountPercentage: 15,
    applicablePackages: ["all"],
    minimumPurchase: 100,
  },
]
