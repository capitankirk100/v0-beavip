"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, X, ShoppingBag, Check, ExternalLink } from "lucide-react"
import type { BeavipUserProfile } from "../hooks/use-user-profile"
import type { SavedOrder } from "../hooks/use-order-history"

interface UserProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userProfile: BeavipUserProfile
  updateUserProfile: (profile: Partial<BeavipUserProfile>) => void
  orderHistory: SavedOrder[]
  updateOrderStatus: (orderId: string, status: "pending" | "completed" | "canceled") => void
  deleteOrder: (orderId: string) => void
  onOrderAgain: (order: SavedOrder) => void
  onTrackOrder: (orderId: string) => void
}

export function UserProfileDialog({
  open,
  onOpenChange,
  userProfile,
  updateUserProfile,
  orderHistory,
  updateOrderStatus,
  deleteOrder,
  onOrderAgain,
  onTrackOrder,
}: UserProfileDialogProps) {
  const [editMode, setEditMode] = useState(false)
  const [tempProfile, setTempProfile] = useState<BeavipUserProfile>(userProfile)

  const handleSaveProfile = () => {
    updateUserProfile(tempProfile)
    setEditMode(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <div className="flex flex-col items-end">
            <Badge className="bg-yellow-600">In attesa</Badge>
          </div>
        )
      case "completed":
        return <Badge className="bg-green-600">Completato</Badge>
      case "canceled":
        return <Badge className="bg-gray-600">Annullato</Badge>
      default:
        return <Badge className="bg-blue-600">Sconosciuto</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getServiceDescription = (order: SavedOrder) => {
    if (order.isPackage) {
      return `Pacchetto: ${order.packageId}`
    }

    if (order.isSubscription) {
      return `Abbonamento: ${order.subscriptionId}`
    }

    return `${order.serviceName} - ${order.platformName}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0a0d14] text-white border-gray-800 max-w-3xl max-h-[80vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Il Mio Profilo</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 rounded-full border border-purple-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-gray-400 mt-2">
            Gestisci il tuo profilo e visualizza lo storico dei tuoi ordini
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          {!editMode ? (
            <div className="flex flex-col items-center justify-center mb-6">
              <Avatar className="h-24 w-24 mb-4 bg-[#151a29]">
                {userProfile.photo ? (
                  <AvatarImage src={userProfile.photo || "/placeholder.svg"} alt={userProfile.name} />
                ) : (
                  <AvatarFallback className="bg-[#151a29] text-purple-400">
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                )}
              </Avatar>
              <h3 className="text-xl font-bold">{userProfile.name}</h3>
              <p className="text-sm text-gray-400 mt-1">Membro dal {formatDate(new Date().toISOString())}</p>

              {userProfile.affiliateNickname && (
                <div className="mt-2">
                  <Badge className="bg-purple-600">Consigliato da: {userProfile.affiliateNickname}</Badge>
                </div>
              )}

              <div className="w-full grid grid-cols-1 gap-2 mt-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Ordini completati:</span>
                  <span className="font-medium">{orderHistory.filter((r) => r.status === "completed").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ordini in attesa:</span>
                  <span className="font-medium">{orderHistory.filter((r) => r.status === "pending").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ordini annullati:</span>
                  <span className="font-medium">{orderHistory.filter((r) => r.status === "canceled").length}</span>
                </div>
              </div>

              <Button
                className="w-full mt-6 bg-[#151a29] hover:bg-[#1a2035] border border-gray-800"
                onClick={() => setEditMode(true)}
              >
                Modifica Profilo
              </Button>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-bold text-center mb-4">Modifica Profilo</h3>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm text-gray-300">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={tempProfile.name}
                  onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                  className="bg-[#151a29] border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={tempProfile.email || ""}
                  onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                  className="bg-[#151a29] border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="affiliateNickname" className="text-sm text-gray-300">
                  Nickname di chi ti ha consigliato
                </Label>
                <Input
                  id="affiliateNickname"
                  value={tempProfile.affiliateNickname || ""}
                  onChange={(e) => setTempProfile({ ...tempProfile, affiliateNickname: e.target.value })}
                  className="bg-[#151a29] border-gray-700 text-white"
                  placeholder="Inserisci il nickname di chi ti ha consigliato"
                />
                <p className="text-xs text-gray-400">
                  Se qualcuno ti ha consigliato Beavip, inserisci il suo nickname per supportarlo
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo" className="text-sm text-gray-300">
                  Foto Profilo
                </Label>
                <p className="text-xs text-gray-400 mb-2">Carica una foto, video o GIF per il tuo profilo</p>
                <div className="flex justify-center mb-4">
                  <label className="cursor-pointer bg-[#1c2d4a] hover:bg-[#243b63] text-white py-2 px-4 rounded-md flex items-center">
                    <span>Carica file</span>
                    <input
                      type="file"
                      accept="image/*,video/*,.gif"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0]
                          const reader = new FileReader()
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setTempProfile({ ...tempProfile, photo: event.target.result as string })
                            }
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </label>
                </div>
                {tempProfile.photo && (
                  <div className="flex justify-center">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={tempProfile.photo || "/placeholder.svg"} alt={tempProfile.name} />
                      <AvatarFallback className="bg-[#151a29] text-purple-400">
                        <User className="h-10 w-10" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 mt-6">
                <Button className="flex-1 bg-[#1e293b] hover:bg-gray-700" onClick={() => setEditMode(false)}>
                  Annulla
                </Button>
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={handleSaveProfile}>
                  Salva
                </Button>
              </div>
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Storico Ordini</h3>

            {orderHistory.length === 0 ? (
              <div className="p-6 text-center bg-[#151a29] border border-gray-800 rounded-lg">
                <p className="text-gray-400">Non hai ancora effettuato nessun ordine.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orderHistory.map((order) => (
                  <div key={order.id} className="p-4 bg-[#151a29] border border-gray-800 rounded-lg">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center mr-3">
                        <ShoppingBag className="h-4 w-4 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-white">{getServiceDescription(order)}</h4>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-gray-400">{formatDate(order.date)}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-sm font-medium">Prezzo:</span>
                          <span className="font-bold">€{order.price.toFixed(2)}</span>
                        </div>
                        {order.affiliateNickname && (
                          <div className="mt-2 text-xs text-purple-400 flex items-center">
                            <Check className="h-3 w-3 mr-1" />
                            Ordine con affiliazione: {order.affiliateNickname}
                          </div>
                        )}
                        {order.trackingUrl && (
                          <div className="mt-2 text-xs text-blue-400 flex items-center">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            <button className="underline hover:text-blue-300" onClick={() => onTrackOrder(order.id)}>
                              Traccia ordine
                            </button>
                          </div>
                        )}
                        <div className="mt-3 flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-gray-700 hover:bg-gray-800"
                            onClick={() => deleteOrder(order.id)}
                          >
                            Elimina
                          </Button>
                          {order.trackingUrl && (
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-xs"
                              onClick={() => onTrackOrder(order.id)}
                            >
                              Traccia
                            </Button>
                          )}
                          <Button
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700 text-xs"
                            onClick={() => onOrderAgain(order)}
                          >
                            Ordina di nuovo
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
