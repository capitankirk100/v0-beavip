"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ShoppingCart, Clock, Check, Sparkles, Info, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { calculateTelegramShopPrice, telegramShopPrices } from "../data/all-services-prices"
import type { OrderState } from "../types"

interface TelegramShopSelectionProps {
  order: OrderState
  updateOrder: (updates: Partial<OrderState>) => void
  onContinue: () => void
}

export function TelegramShopSelection({ order, updateOrder, onContinue }: TelegramShopSelectionProps) {
  const [duration, setDuration] = useState<number>(1)
  const [isAssisted, setIsAssisted] = useState<boolean>(false)
  const [hasEcommerce, setHasEcommerce] = useState<boolean>(false)
  const [ecommerceUrl, setEcommerceUrl] = useState<string>("")
  const [setupFee, setSetupFee] = useState<boolean>(false)
  const [productsCount, setProductsCount] = useState<number>(0)
  const [logoDesign, setLogoDesign] = useState<boolean>(false)
  const [welcomeMessage, setWelcomeMessage] = useState<boolean>(false)
  const [categoriesSetup, setCategoriesSetup] = useState<boolean>(false)
  const [businessDescription, setBusinessDescription] = useState<string>("")

  // Calcola il prezzo totale
  const calculateTotalPrice = () => {
    return calculateTelegramShopPrice(duration, isAssisted, {
      setupFee,
      productsCount: productsCount > 0 ? productsCount : undefined,
      logoDesign,
      welcomeMessage,
      categoriesSetup,
    })
  }

  // Gestisce il cambio di durata
  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration)
    updateOrder({
      duration: newDuration,
      price: calculateTelegramShopPrice(newDuration, isAssisted, {
        setupFee,
        productsCount: productsCount > 0 ? productsCount : undefined,
        logoDesign,
        welcomeMessage,
        categoriesSetup,
      }),
      serviceSubtype: isAssisted ? "shopAssisted" : "shop",
      serviceSubtypeName: isAssisted ? "Negozio con Assistenza" : "Negozio Standard",
    })
  }

  // Gestisce il cambio di tipo di servizio (assistito o no)
  const handleServiceTypeChange = (assisted: boolean) => {
    setIsAssisted(assisted)
    updateOrder({
      serviceSubtype: assisted ? "shopAssisted" : "shop",
      serviceSubtypeName: assisted ? "Negozio con Assistenza" : "Negozio Standard",
      price: calculateTelegramShopPrice(duration, assisted, {
        setupFee,
        productsCount: productsCount > 0 ? productsCount : undefined,
        logoDesign,
        welcomeMessage,
        categoriesSetup,
      }),
    })
  }

  // Gestisce il cambio degli extra
  const handleExtrasChange = () => {
    updateOrder({
      price: calculateTelegramShopPrice(duration, isAssisted, {
        setupFee,
        productsCount: productsCount > 0 ? productsCount : undefined,
        logoDesign,
        welcomeMessage,
        categoriesSetup,
      }),
      hasEcommerce,
      ecommerceUrl,
      businessDescription,
    })
  }

  // Gestisce la continuazione
  const handleContinue = () => {
    updateOrder({
      quantity: duration,
      price: calculateTotalPrice(),
      serviceSubtype: isAssisted ? "shopAssisted" : "shop",
      serviceSubtypeName: isAssisted ? "Negozio con Assistenza" : "Negozio Standard",
      hasEcommerce,
      ecommerceUrl,
      setupFee,
      productsCount,
      logoDesign,
      welcomeMessage,
      categoriesSetup,
      businessDescription,
    })
    onContinue()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center">
        <Sparkles className="h-5 w-5 text-purple-400 mr-2" />
        Configura il tuo Negozio Telegram
      </h2>

      <Card className="bg-gradient-to-br from-[#0c1220] to-[#131b30] border-gray-800 p-6 shadow-lg">
        <div className="space-y-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center mr-4 shadow-md">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Negozio Telegram</h3>
              <p className="text-sm text-purple-300">
                Crea o acquista un negozio su Telegram per vendere i tuoi prodotti
              </p>
            </div>
          </div>

          {/* Selezione del tipo di servizio */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white">Tipo di servizio</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Card
                className={`bg-[#151a29] border-gray-800 hover:border-purple-500/50 transition-all duration-300 cursor-pointer ${
                  !isAssisted ? "border-purple-500 ring-1 ring-purple-500/20" : ""
                }`}
                onClick={() => handleServiceTypeChange(false)}
              >
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center mr-3 shadow-md">
                      <ShoppingCart className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-medium text-white">Negozio Standard</h3>
                  </div>
                  <p className="text-xs text-gray-300 mb-2">
                    Ricevi l'accesso al tuo negozio Telegram e configuralo autonomamente.
                  </p>
                  <div className="flex items-center text-green-400 text-xs">
                    <Check className="h-3 w-3 mr-1" />
                    <span>Accesso immediato</span>
                  </div>
                </div>
              </Card>

              <Card
                className={`bg-[#151a29] border-gray-800 hover:border-purple-500/50 transition-all duration-300 cursor-pointer ${
                  isAssisted ? "border-purple-500 ring-1 ring-purple-500/20" : ""
                }`}
                onClick={() => handleServiceTypeChange(true)}
              >
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center mr-3 shadow-md">
                      <HelpCircle className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-medium text-white">Negozio con Assistenza</h3>
                    <Badge className="ml-2 bg-purple-600">CONSIGLIATO</Badge>
                  </div>
                  <p className="text-xs text-gray-300 mb-2">
                    Ricevi assistenza completa per la configurazione del tuo negozio Telegram.
                  </p>
                  <div className="flex items-center text-green-400 text-xs">
                    <Check className="h-3 w-3 mr-1" />
                    <span>Supporto dedicato</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Selezione della durata */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white">Durata</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[1, 3, 6, 12, 24, 36, 60].map((months) => (
                <Card
                  key={months}
                  className={`bg-[#151a29] border-gray-800 hover:border-purple-500/50 transition-all duration-300 cursor-pointer ${
                    duration === months ? "border-purple-500 ring-1 ring-purple-500/20" : ""
                  }`}
                  onClick={() => handleDurationChange(months)}
                >
                  <div className="p-4 flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center mb-2 shadow-md">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-medium text-white text-sm">
                      {months === 12
                        ? "1 Anno"
                        : months === 24
                          ? "2 Anni"
                          : months === 36
                            ? "3 Anni"
                            : months === 60
                              ? "5 Anni"
                              : `${months} ${months === 1 ? "Mese" : "Mesi"}`}
                    </h3>
                    {months >= 12 && <div className="text-xs text-purple-400 mt-1">+ Funzioni Pro</div>}
                    <div className="text-xs text-green-400 mt-1">
                      {months >= 12 ? "Miglior valore" : months >= 6 ? "Buon valore" : ""}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Opzioni aggiuntive (solo per servizio assistito) */}
          {isAssisted && (
            <div className="space-y-4 mt-6">
              <h4 className="text-sm font-medium text-white">Informazioni sul tuo business</h4>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has-ecommerce"
                    checked={hasEcommerce}
                    onCheckedChange={(checked) => {
                      setHasEcommerce(!!checked)
                      handleExtrasChange()
                    }}
                  />
                  <Label htmlFor="has-ecommerce" className="text-white">
                    Ho già un sito e-commerce
                  </Label>
                </div>
              </div>

              {hasEcommerce && (
                <div className="space-y-2">
                  <Label htmlFor="ecommerce-url" className="text-sm text-gray-300">
                    URL del tuo e-commerce
                  </Label>
                  <Input
                    id="ecommerce-url"
                    placeholder="https://mio-ecommerce.com"
                    className="bg-[#151a29] border-gray-700 text-white"
                    value={ecommerceUrl}
                    onChange={(e) => {
                      setEcommerceUrl(e.target.value)
                      handleExtrasChange()
                    }}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="business-description" className="text-sm text-gray-300">
                  Descrivi brevemente il tuo business
                </Label>
                <Textarea
                  id="business-description"
                  placeholder="Cosa vendi? Qual è il tuo target? Quali sono i tuoi prodotti principali?"
                  className="bg-[#151a29] border-gray-700 text-white min-h-[100px]"
                  value={businessDescription}
                  onChange={(e) => {
                    setBusinessDescription(e.target.value)
                    handleExtrasChange()
                  }}
                />
              </div>

              <h4 className="text-sm font-medium text-white mt-6">Servizi aggiuntivi</h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#151a29] border border-gray-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="setup-fee"
                      checked={setupFee}
                      onCheckedChange={(checked) => {
                        setSetupFee(!!checked)
                        handleExtrasChange()
                      }}
                    />
                    <div>
                      <Label htmlFor="setup-fee" className="text-white">
                        Setup iniziale
                      </Label>
                      <p className="text-xs text-gray-400">Configurazione completa del negozio</p>
                    </div>
                  </div>
                  <div className="text-purple-400 font-medium">€{telegramShopPrices.extras.setupFee.toFixed(2)}</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#151a29] border border-gray-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="logo-design"
                      checked={logoDesign}
                      onCheckedChange={(checked) => {
                        setLogoDesign(!!checked)
                        handleExtrasChange()
                      }}
                    />
                    <div>
                      <Label htmlFor="logo-design" className="text-white">
                        Design del logo
                      </Label>
                      <p className="text-xs text-gray-400">Creazione di un logo professionale</p>
                    </div>
                  </div>
                  <div className="text-purple-400 font-medium">€{telegramShopPrices.extras.logoDesign.toFixed(2)}</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#151a29] border border-gray-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="welcome-message"
                      checked={welcomeMessage}
                      onCheckedChange={(checked) => {
                        setWelcomeMessage(!!checked)
                        handleExtrasChange()
                      }}
                    />
                    <div>
                      <Label htmlFor="welcome-message" className="text-white">
                        Messaggio di benvenuto
                      </Label>
                      <p className="text-xs text-gray-400">Creazione di un messaggio di benvenuto personalizzato</p>
                    </div>
                  </div>
                  <div className="text-purple-400 font-medium">
                    €{telegramShopPrices.extras.welcomeMessage.toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#151a29] border border-gray-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="categories-setup"
                      checked={categoriesSetup}
                      onCheckedChange={(checked) => {
                        setCategoriesSetup(!!checked)
                        handleExtrasChange()
                      }}
                    />
                    <div>
                      <Label htmlFor="categories-setup" className="text-white">
                        Setup categorie
                      </Label>
                      <p className="text-xs text-gray-400">Configurazione delle categorie di prodotti</p>
                    </div>
                  </div>
                  <div className="text-purple-400 font-medium">
                    €{telegramShopPrices.extras.categoriesSetup.toFixed(2)}
                  </div>
                </div>

                <div className="p-3 bg-[#151a29] border border-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <Label className="text-white flex items-center">
                        Configurazione prodotti
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3 w-3 ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs max-w-xs">
                                Inserimento dei tuoi prodotti nel negozio Telegram con immagini, descrizioni e prezzi.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <p className="text-xs text-gray-400">Quanti prodotti vuoi configurare?</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 10, 25, 50, 100].map((count) => (
                      <Button
                        key={count}
                        variant="outline"
                        className={`border-gray-700 transition-all duration-200 ${
                          productsCount === count
                            ? "bg-gradient-to-r from-purple-700 to-indigo-700 border-purple-500 text-white shadow-md"
                            : "text-white bg-[#151a29] hover:bg-[#1e2a45]"
                        }`}
                        onClick={() => {
                          setProductsCount(count)
                          handleExtrasChange()
                        }}
                      >
                        {count === 0 ? "Nessuno" : count}
                      </Button>
                    ))}
                  </div>
                  {productsCount > 0 && (
                    <div className="mt-2 text-right text-purple-400 font-medium">
                      €
                      {productsCount <= 10
                        ? telegramShopPrices.extras.productsSetup[10].toFixed(2)
                        : productsCount <= 25
                          ? telegramShopPrices.extras.productsSetup[25].toFixed(2)
                          : productsCount <= 50
                            ? telegramShopPrices.extras.productsSetup[50].toFixed(2)
                            : telegramShopPrices.extras.productsSetup[100].toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Prezzo stimato */}
          <div className="p-6 bg-gradient-to-r from-[#151a29] to-[#1c2136] rounded-xl mt-6 shadow-inner">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 font-medium">Prezzo totale:</span>
              <span className="font-bold text-2xl text-white bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                €{calculateTotalPrice().toFixed(2)}
              </span>
            </div>
            <div className="mt-2 text-sm text-purple-300 flex items-center">
              <Sparkles className="h-4 w-4 mr-1" />
              {duration >= 12 ? "Include funzionalità PRO avanzate" : "Aggiungi più mesi per ottenere funzionalità PRO"}
            </div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-medium text-lg shadow-lg transition-all duration-200 mt-4"
            onClick={handleContinue}
          >
            Continua
          </Button>
        </div>
      </Card>
    </div>
  )
}
