// Prezzi fissi per followers e likes di Instagram
export const instagramPrices = {
  followers: {
    100: 2.0,
    250: 4.0,
    500: 5.0,
    1000: 6.99,
    2500: 13.99,
    5000: 25.0,
    7000: 36.0,
    10000: 55.0,
    15000: 80.0,
    20000: 110.0,
    30000: 165.0,
    40000: 220.0,
    50000: 275.0,
    100000: 550.0,
  },
  likes: {
    100: 0.99,
    250: 2.97,
    500: 5.94,
    1000: 9.99,
    2500: 25.0,
    5000: 50.0,
    7000: 75.0,
    10000: 100.0,
    15000: 150.0,
    20000: 200.0,
    30000: 300.0,
    40000: 400.0,
    50000: 500.0,
    100000: 1000.0,
  },
}

// Funzione per ottenere il prezzo più vicino in base alla quantità
export function getNearestPrice(quantity: number, type: "followers" | "likes"): number {
  const prices = instagramPrices[type]
  const quantities = Object.keys(prices)
    .map(Number)
    .sort((a, b) => a - b)

  // Se la quantità è esattamente una delle quantità predefinite, restituisci il prezzo corrispondente
  if (prices[quantity]) {
    return prices[quantity]
  }

  // Trova la quantità predefinita più vicina
  let nearestQuantity = quantities[0]
  for (const q of quantities) {
    if (Math.abs(q - quantity) < Math.abs(nearestQuantity - quantity)) {
      nearestQuantity = q
    }
  }

  // Calcola il prezzo proporzionale
  const pricePerUnit = prices[nearestQuantity] / nearestQuantity
  return Number.parseFloat((quantity * pricePerUnit).toFixed(2))
}
