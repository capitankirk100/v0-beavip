"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Package, Calendar, Check, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { combinedPackages, subscriptionPlans } from "../data/packages"
import type { OrderState, ServicePackage, SubscriptionPlan } from "../types"

interface PackagesSelectionProps {
  order: OrderState
  updateOrder: (updates: Partial<OrderState>) => void
  onContinue: () => void
}

export function PackagesSelection({ order, updateOrder, onContinue }: PackagesSelectionProps) {
  const [activeTab, setActiveTab] = useState<string>("packages")
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null)

  // Funzione per selezionare un pacchetto
  const handleSelectPackage = (pkg: ServicePackage) => {
    setSelectedPackage(pkg.id)

    // Calcola il prezzo totale del pacchetto
    updateOrder({
      isPackage: true,
      packageId: pkg.id,
      packageItems: pkg.services,
      price: pkg.discountedPrice,
      serviceType: "package",
      serviceName: pkg.name,
      platform: "multiple",
      platformName: "Pacchetto Combinato",
      quantity: 1,
    })
  }

  // Funzione per selezionare un abbonamento
  const handleSelectSubscription = (sub: SubscriptionPlan) => {
    setSelectedSubscription(sub.id)

    // Calcola il prezzo totale dell'abbonamento
    updateOrder({
      isSubscription: true,
      subscriptionId: sub.id,
      packageItems: sub.services,
      price: sub.price,
      serviceType: "subscription",
      serviceName: sub.name,
      platform: "multiple",
      platformName: "Abbonamento Mensile",
      quantity: 1,
      billingCycle: sub.billingCycle,
      minimumCommitment: sub.minimumCommitment,
    })
  }

  // Funzione per continuare con il pacchetto o abbonamento selezionato
  const handleContinue = () => {
    if ((activeTab === "packages" && selectedPackage) || (activeTab === "subscriptions" && selectedSubscription)) {
      onContinue()
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center">
        <Sparkles className="h-5 w-5 text-purple-400 mr-2" />
        Pacchetti e Abbonamenti
      </h2>

      <Tabs defaultValue="packages" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6 bg-[#151a29]">
          <TabsTrigger
            value="packages"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-700 data-[state=active]:to-indigo-700 data-[state=active]:text-white"
          >
            <Package className="h-4 w-4 mr-2" />
            Pacchetti Combinati
          </TabsTrigger>
          <TabsTrigger
            value="subscriptions"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-700 data-[state=active]:to-indigo-700 data-[state=active]:text-white"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Abbonamenti Mensili
          </TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {combinedPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`bg-gradient-to-br from-[#0c1220] to-[#131b30] border ${
                  selectedPackage === pkg.id
                    ? "border-purple-500 shadow-lg shadow-purple-500/20"
                    : "border-gray-800 hover:border-purple-500/50"
                } cursor-pointer transition-all duration-300`}
                onClick={() => handleSelectPackage(pkg)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-white text-lg">{pkg.name}</h3>
                      <p className="text-sm text-purple-300">{pkg.description}</p>
                    </div>
                    {pkg.popularityBadge && (
                      <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600">{pkg.popularityBadge}</Badge>
                    )}
                  </div>

                  <div className="space-y-3 mt-4">
                    {pkg.services.map((service, index) => (
                      <div key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-400 mt-1 mr-2 flex-shrink-0" />
                        <div className="text-sm text-gray-300">
                          {service.quantity && service.quantity > 1 ? `${service.quantity.toLocaleString()} ` : ""}
                          {service.serviceSubtypeName ? `${service.serviceSubtypeName} ` : ""}
                          {service.serviceName || service.serviceType}
                          {service.platformName && ` per ${service.platformName}`}
                          {service.isRental && service.rentalDuration && ` (${service.rentalDuration} mesi)`}
                          {service.setupFee && " + Setup iniziale"}
                          {service.logoDesign && " + Logo design"}
                          {service.categoriesSetup && " + Setup categorie"}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-gray-400 line-through text-sm mr-2">€{pkg.regularPrice.toFixed(2)}</span>
                        <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                          €{pkg.discountedPrice.toFixed(2)}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-green-400 border-green-400/30">
                        Risparmi {pkg.savings}%
                      </Badge>
                    </div>
                  </div>

                  {selectedPackage === pkg.id && (
                    <div className="mt-4 flex items-center text-green-400 text-sm">
                      <Check className="h-4 w-4 mr-1" />
                      Pacchetto selezionato
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subscriptions" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subscriptionPlans.map((sub) => (
              <Card
                key={sub.id}
                className={`bg-gradient-to-br from-[#0c1220] to-[#131b30] border ${
                  selectedSubscription === sub.id
                    ? "border-purple-500 shadow-lg shadow-purple-500/20"
                    : "border-gray-800 hover:border-purple-500/50"
                } cursor-pointer transition-all duration-300`}
                onClick={() => handleSelectSubscription(sub)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-white text-lg">{sub.name}</h3>
                      <p className="text-sm text-purple-300">{sub.description}</p>
                    </div>
                    {sub.popularityBadge && (
                      <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600">{sub.popularityBadge}</Badge>
                    )}
                  </div>

                  <div className="space-y-3 mt-4">
                    {sub.services.map((service, index) => (
                      <div key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-400 mt-1 mr-2 flex-shrink-0" />
                        <div className="text-sm text-gray-300">
                          {service.quantity && service.quantity > 1 ? `${service.quantity.toLocaleString()} ` : ""}
                          {service.serviceSubtypeName ? `${service.serviceSubtypeName} ` : ""}
                          {service.serviceName || service.serviceType}
                          {service.platformName && ` per ${service.platformName}`}
                          {service.frequency && ` (${service.frequency})`}
                          {service.distributionType && ` - ${service.distributionType}`}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                          €{sub.price.toFixed(2)}/{sub.billingCycle}
                        </span>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center text-purple-300 text-sm">
                              <span>Min. {sub.minimumCommitment} mesi</span>
                              <Info className="h-4 w-4 ml-1" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">
                              Questo abbonamento richiede un impegno minimo di {sub.minimumCommitment} mesi. Puoi
                              disdire in qualsiasi momento dopo questo periodo.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  {selectedSubscription === sub.id && (
                    <div className="mt-4 flex items-center text-green-400 text-sm">
                      <Check className="h-4 w-4 mr-1" />
                      Abbonamento selezionato
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button
          className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-medium text-lg shadow-lg transition-all duration-200 ${
            (activeTab === "packages" && !selectedPackage) || (activeTab === "subscriptions" && !selectedSubscription)
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          onClick={handleContinue}
          disabled={
            (activeTab === "packages" && !selectedPackage) || (activeTab === "subscriptions" && !selectedSubscription)
          }
        >
          Continua
        </Button>
      </div>
    </div>
  )
}
