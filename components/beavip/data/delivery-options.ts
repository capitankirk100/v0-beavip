// Opzioni di consegna
export const deliveryOptions = [
  {
    id: "instant",
    name: "Istantanea",
    description: "Consegna immediata, elaborazione prioritaria inclusa",
    multiplier: 1.0,
    timeDescription: "Entro 1-2 ore",
    price: 0.0, // Prezzo incluso (gratuito)
  },
  {
    id: "express",
    name: "Express",
    description: "Consegna veloce ma non immediata, buon compromesso tra velocità e naturalezza",
    multiplier: 1.2,
    timeDescription: "Entro 12-24 ore",
    price: 5.0,
  },
  {
    id: "standard",
    name: "Standard",
    description: "Consegna standard, velocità normale",
    multiplier: 1.0,
    timeDescription: "Entro 1-3 giorni",
    price: 0.0,
  },
  {
    id: "scheduled",
    name: "Programmato",
    description: "Consegna programmata in base alle tue esigenze",
    multiplier: 1.1,
    timeDescription: "Data e ora specificate",
    price: 5.0,
  },
  {
    id: "dripfeed",
    name: "Drip Feed",
    description: "Consegna graduale per un aspetto più naturale",
    multiplier: 1.2,
    timeDescription: "Distribuito in 5-7 giorni",
    price: 10.0,
  },
  {
    id: "slow",
    name: "Lenta",
    description: "Consegna lenta per un aspetto più naturale e organico",
    multiplier: 1.1,
    timeDescription: "Entro 7-14 giorni",
    price: 3.0,
  },
]
