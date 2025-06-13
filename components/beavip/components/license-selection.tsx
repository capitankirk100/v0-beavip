"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Key, Info, Sparkles, HelpCircle, Download, Monitor } from "lucide-react"
import { softwareLicenses } from "../data/all-services-prices"
import type { OrderState } from "../types"

interface LicenseSelectionProps {
  order: OrderState
  updateOrder: (updates: Partial<OrderState>) => void
  onContinue: () => void
}

export function LicenseSelection({ order, updateOrder, onContinue }: LicenseSelectionProps) {
  const [selectedTab, setSelectedTab] = useState<string>("windows")
  const [selectedLicense, setSelectedLicense] = useState<string>("")
  const [remoteInstallation, setRemoteInstallation] = useState<boolean>(false)
  const [anyDeskId, setAnyDeskId] = useState<string>("")
  const [anyDeskError, setAnyDeskError] = useState<boolean>(false)

  // Inizializza lo stato in base all'ordine corrente
  useEffect(() => {
    if (order.serviceSubtype) {
      setSelectedLicense(order.serviceSubtype)

      if (order.needsRemoteInstallation) {
        setRemoteInstallation(true)
        if (order.anyDeskId) {
          setAnyDeskId(order.anyDeskId)
        }
      }
    }
  }, [order])

  // Funzione per ottenere la descrizione del tipo di licenza
  const getLicenseTypeDescription = (type: string): string => {
    switch (type) {
      case "retail":
        return "Le licenze Retail sono trasferibili e possono essere reinstallate su un nuovo PC in caso di sostituzione dell'hardware. Sono la soluzione più flessibile."
      case "oem":
        return "Le licenze OEM sono legate all'hardware su cui vengono attivate inizialmente. Sono più economiche ma non trasferibili ad un nuovo PC."
      case "phone":
        return "Le licenze Phone richiedono l'attivazione telefonica e possono essere utilizzate offline. Ideali per PC senza connessione internet."
      default:
        return ""
    }
  }

  // Funzione per gestire la selezione della licenza
  const handleLicenseSelect = (licenseId: string) => {
    setSelectedLicense(licenseId)

    // Determina il prezzo totale
    let totalPrice = 0

    // Prezzo della licenza
    if (licenseId.startsWith("win")) {
      totalPrice = softwareLicenses.windows[licenseId].price
    } else if (licenseId.startsWith("office")) {
      totalPrice = softwareLicenses.office[licenseId].price
    }

    // Aggiungi il prezzo dell'installazione remota se selezionata
    if (remoteInstallation) {
      totalPrice += softwareLicenses.installation.remote.price
    }

    // Aggiorna lo stato dell'ordine
    updateOrder({
      serviceSubtype: licenseId,
      price: totalPrice,
      needsRemoteInstallation: remoteInstallation,
      anyDeskId: remoteInstallation ? anyDeskId : undefined,
    })
  }

  // Funzione per gestire il cambio dell'opzione di installazione remota
  const handleRemoteInstallationChange = (checked: boolean) => {
    setRemoteInstallation(checked)

    // Se disattiva l'installazione remota, resetta l'errore dell'ID AnyDesk
    if (!checked) {
      setAnyDeskError(false)
    }

    // Aggiorna il prezzo
    let totalPrice = 0

    // Prezzo della licenza
    if (selectedLicense.startsWith("win")) {
      totalPrice = softwareLicenses.windows[selectedLicense].price
    } else if (selectedLicense.startsWith("office")) {
      totalPrice = softwareLicenses.office[selectedLicense].price
    }

    // Aggiungi il prezzo dell'installazione remota se selezionata
    if (checked) {
      totalPrice += softwareLicenses.installation.remote.price
    }

    // Aggiorna lo stato dell'ordine
    updateOrder({
      price: totalPrice,
      needsRemoteInstallation: checked,
      anyDeskId: checked ? anyDeskId : undefined,
    })
  }

  // Funzione per gestire il cambio dell'ID AnyDesk
  const handleAnyDeskIdChange = (value: string) => {
    setAnyDeskId(value)
    setAnyDeskError(false)

    // Aggiorna lo stato dell'ordine
    updateOrder({
      anyDeskId: value,
    })
  }

  // Funzione per gestire la continuazione
  const handleContinue = () => {
    // Verifica che sia stata selezionata una licenza
    if (!selectedLicense) {
      return
    }

    // Verifica che sia stato inserito l'ID AnyDesk se è stata selezionata l'installazione remota
    if (remoteInstallation && !anyDeskId.trim()) {
      setAnyDeskError(true)
      return
    }

    // Determina i dettagli della licenza
    let licenseDetails = null
    if (selectedLicense.startsWith("win")) {
      licenseDetails = softwareLicenses.windows[selectedLicense]
    } else if (selectedLicense.startsWith("office")) {
      licenseDetails = softwareLicenses.office[selectedLicense]
    }

    // Aggiorna lo stato dell'ordine con tutti i dettagli
    updateOrder({
      serviceSubtype: selectedLicense,
      serviceSubtypeName: licenseDetails ? `${licenseDetails.name} - ${licenseDetails.description}` : "",
      needsRemoteInstallation: remoteInstallation,
      anyDeskId: remoteInstallation ? anyDeskId : undefined,
      // Imposta username e url a valori vuoti per evitare che vengano richiesti successivamente
      username: "N/A",
      url: "N/A",
    })

    onContinue()
  }

  // Calcola il prezzo totale
  const calculateTotalPrice = () => {
    if (!selectedLicense) return 0

    let basePrice = 0
    if (selectedLicense.startsWith("win")) {
      basePrice = softwareLicenses.windows[selectedLicense].price
    } else if (selectedLicense.startsWith("office")) {
      basePrice = softwareLicenses.office[selectedLicense].price
    }

    return remoteInstallation ? basePrice + softwareLicenses.installation.remote.price : basePrice
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center">
        <Sparkles className="h-5 w-5 text-purple-400 mr-2" />
        Seleziona la tua licenza software
      </h2>

      <Card className="bg-gradient-to-br from-[#0c1220] to-[#131b30] border-gray-800 p-6 shadow-lg">
        <div className="space-y-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center mr-4 shadow-md">
              <Key className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Licenze Software Originali</h3>
              <p className="text-sm text-purple-300">
                Acquista licenze originali per Windows e Office a prezzi vantaggiosi
              </p>
            </div>
          </div>

          <Tabs defaultValue="windows" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#151a29]">
              <TabsTrigger value="windows" className="text-white data-[state=active]:bg-purple-700">
                Windows
              </TabsTrigger>
              <TabsTrigger value="office" className="text-white data-[state=active]:bg-purple-700">
                Office
              </TabsTrigger>
            </TabsList>

            <TabsContent value="windows" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(softwareLicenses.windows).map(([licenseId, license]) => (
                  <Card
                    key={licenseId}
                    className={`bg-[#151a29] border-gray-800 hover:border-purple-500/50 transition-all duration-300 cursor-pointer ${
                      selectedLicense === licenseId ? "border-purple-500 ring-1 ring-purple-500/20" : ""
                    }`}
                    onClick={() => handleLicenseSelect(licenseId)}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center mr-3 shadow-md">
                            <Monitor className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium text-white">{license.name}</h3>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 ml-2 text-purple-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs max-w-xs">{getLicenseTypeDescription(license.type)}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <p className="text-xs text-gray-300">{license.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-medium bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                            €{license.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="office" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(softwareLicenses.office).map(([licenseId, license]) => (
                  <Card
                    key={licenseId}
                    className={`bg-[#151a29] border-gray-800 hover:border-purple-500/50 transition-all duration-300 cursor-pointer ${
                      selectedLicense === licenseId ? "border-purple-500 ring-1 ring-purple-500/20" : ""
                    }`}
                    onClick={() => handleLicenseSelect(licenseId)}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center mr-3 shadow-md">
                            <Download className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium text-white">{license.name}</h3>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 ml-2 text-purple-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs max-w-xs">{getLicenseTypeDescription(license.type)}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <p className="text-xs text-gray-300">{license.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-medium bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                            €{license.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {selectedLicense && (
            <div className="space-y-4 mt-6 p-4 bg-[#151a29] border border-gray-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remote-installation"
                  checked={remoteInstallation}
                  onCheckedChange={(checked) => handleRemoteInstallationChange(!!checked)}
                  className="h-5 w-5 border-2 border-purple-400 text-purple-600 bg-[#151a29]"
                />
                <div>
                  <Label htmlFor="remote-installation" className="text-white cursor-pointer">
                    Installazione da remoto (+€{softwareLicenses.installation.remote.price.toFixed(2)})
                  </Label>
                  <p className="text-xs text-gray-300">
                    Un nostro tecnico si collegherà al tuo PC tramite AnyDesk per installare e attivare il software
                  </p>
                </div>
              </div>

              {remoteInstallation && (
                <div className="space-y-2 mt-4">
                  <Label htmlFor="anydesk-id" className="text-white">
                    ID AnyDesk <span className="text-red-500">*</span>
                  </Label>
                  <div className="space-y-1">
                    <Input
                      id="anydesk-id"
                      placeholder="Inserisci il tuo ID AnyDesk"
                      className={`bg-[#151a29] border-gray-700 text-white ${anyDeskError ? "border-red-500" : ""}`}
                      value={anyDeskId}
                      onChange={(e) => handleAnyDeskIdChange(e.target.value)}
                    />
                    {anyDeskError && <p className="text-xs text-red-500">Inserisci il tuo ID AnyDesk per continuare</p>}
                    <p className="text-xs text-gray-300">
                      Non hai AnyDesk? Scaricalo gratuitamente da{" "}
                      <a
                        href="https://anydesk.com/it/downloads"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 underline"
                      >
                        anydesk.com/it/downloads
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="p-5 bg-gradient-to-r from-[#151a29] to-[#1c2136] rounded-xl shadow-inner">
            <div className="flex items-center mb-1">
              <Info className="h-4 w-4 text-purple-400 mr-2" />
              <h4 className="text-sm font-medium text-white">Tipi di licenze</h4>
            </div>
            <p className="text-xs text-gray-300 mb-2">
              <span className="font-medium text-white">[Retail]:</span> Licenze trasferibili, possono essere
              reinstallate su un nuovo PC in caso di sostituzione dell'hardware.
            </p>
            <p className="text-xs text-gray-300 mb-2">
              <span className="font-medium text-white">[OEM]:</span> Licenze legate all'hardware su cui vengono attivate
              inizialmente, non trasferibili ad un nuovo PC.
            </p>
            <p className="text-xs text-gray-300">
              <span className="font-medium text-white">[Phone]:</span> Licenze che richiedono l'attivazione telefonica,
              possono essere utilizzate offline.
            </p>
          </div>

          {selectedLicense && (
            <div className="p-6 bg-gradient-to-r from-[#151a29] to-[#1c2136] rounded-xl mt-6 shadow-inner">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-medium">Prezzo totale:</span>
                <span className="font-bold text-2xl text-white bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  €{calculateTotalPrice().toFixed(2)}
                </span>
              </div>
              {remoteInstallation && (
                <div className="mt-2 text-sm text-purple-300 flex items-center">
                  <Sparkles className="h-4 w-4 mr-1" />
                  Include installazione e attivazione da remoto
                </div>
              )}
            </div>
          )}

          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-medium text-lg shadow-lg transition-all duration-200 mt-4"
            onClick={handleContinue}
            disabled={!selectedLicense}
          >
            Continua
          </Button>
        </div>
      </Card>
    </div>
  )
}
