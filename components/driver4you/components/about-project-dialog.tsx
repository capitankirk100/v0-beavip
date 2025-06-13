"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Info, Mail, MessageSquare, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AboutProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AboutProjectDialog({ open, onOpenChange }: AboutProjectDialogProps) {
  const handleTelegramClick = () => {
    window.open("https://t.me/VTeasy", "_blank")
  }

  const handleEmailClick = () => {
    window.open("https://mail.google.com/mail/?view=cm&fs=1&to=nobeliumlab@protonmail.com", "_blank")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0a0d14] text-white border-gray-800 max-w-3xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Driver4You - Il Progetto</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-gray-400 mt-2">
            Scopri di più sul progetto Driver4You, la nostra visione e i piani futuri
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="p-6 max-h-[60vh]">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white flex items-center">
                <Info className="h-5 w-5 text-blue-400 mr-2" />
                Cos'è Driver4You
              </h3>
              <p className="text-gray-300">
                Driver4You è una piattaforma innovativa che connette passeggeri con fornitori di servizi di trasporto
                privato nella Vallecamonica e nelle aree circostanti. Il nostro obiettivo è semplificare gli spostamenti
                in zone dove i trasporti pubblici sono limitati, offrendo un'alternativa affidabile e conveniente.
              </p>

              <div className="p-4 bg-[#151a29] border border-gray-800 rounded-lg">
                <h4 className="font-medium text-blue-400 mb-2">Disclaimer legale:</h4>
                <p className="text-gray-300 text-sm">
                  Driver4You non è un servizio di NCC o Taxi. Funziona come piattaforma di intermediazione che mette in
                  contatto passeggeri con fornitori di servizi di trasporto privato già esistenti e regolarmente
                  autorizzati.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Stato attuale del progetto</h3>

              <div className="flex items-center mb-4">
                <div className="bg-green-600 text-white text-xs px-3 py-1 rounded-full mr-2">Fase MVP</div>
                <p className="text-gray-300">
                  Attualmente stiamo testando il servizio in Vallecamonica con un numero limitato di fornitori di
                  trasporto. L'app è funzionante e permette di prenotare corse verso diverse destinazioni.
                </p>
              </div>

              <div className="flex items-center">
                <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full mr-2">In sviluppo</div>
                <p className="text-gray-300">
                  Stiamo lavorando all'espansione del servizio, all'aggiunta di nuove funzionalità come il tracking in
                  tempo reale, le recensioni verificate e un sistema di fidelizzazione.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Modello di business</h3>
              <p className="text-gray-300">
                Il nostro focus è sviluppare una soluzione replicabile che possa essere implementata in diverse aree
                geografiche, adattandosi alle esigenze specifiche di ogni territorio. Offriamo la piattaforma come
                soluzione completa per operatori locali che vogliono digitalizzare i servizi di trasporto.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-white">Per gli utenti</h4>
                  <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                    <li>Utilizzo gratuito della piattaforma</li>
                    <li>Nessuna commissione sulle prenotazioni</li>
                    <li>Accesso PRO con funzionalità avanzate a €4.99/mese</li>
                    <li>Pagamento diretto al fornitore del servizio</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-white">Per i partner locali</h4>
                  <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                    <li>Licenza della piattaforma personalizzabile</li>
                    <li>Supporto tecnico e formazione</li>
                    <li>Analisi dati e ottimizzazione del servizio</li>
                    <li>Integrazione con sistemi locali esistenti</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Copertura geografica</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-2 text-gray-400">Tipo di servizio</th>
                      <th className="text-left py-2 text-gray-400">Destinazioni</th>
                      <th className="text-left py-2 text-gray-400">Aree coperte</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-800">
                      <td className="py-2 text-white">Standard</td>
                      <td className="py-2 text-gray-300">Tutte le località della Vallecamonica</td>
                      <td className="py-2 text-gray-300">Vallecamonica, Lago d'Iseo</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-2 text-white">Aeroporti</td>
                      <td className="py-2 text-gray-300">Orio al Serio, Linate, Malpensa, Verona</td>
                      <td className="py-2 text-gray-300">Lombardia, Veneto</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-2 text-white">Discoteche</td>
                      <td className="py-2 text-gray-300">Number One, Art Club, Sesto Senso, ecc.</td>
                      <td className="py-2 text-gray-300">Brescia, Bergamo, Lago di Garda</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-white">Eventi speciali</td>
                      <td className="py-2 text-gray-300">Concerti, matrimoni, eventi sportivi</td>
                      <td className="py-2 text-gray-300">Nord Italia</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Tecnologie utilizzate</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-[#151a29] border border-gray-800 rounded-lg text-center">
                  <h4 className="font-medium text-white">Next.js</h4>
                  <p className="text-xs text-gray-400">Framework React</p>
                </div>
                <div className="p-3 bg-[#151a29] border border-gray-800 rounded-lg text-center">
                  <h4 className="font-medium text-white">Tailwind CSS</h4>
                  <p className="text-xs text-gray-400">Framework CSS</p>
                </div>
                <div className="p-3 bg-[#151a29] border border-gray-800 rounded-lg text-center">
                  <h4 className="font-medium text-white">React</h4>
                  <p className="text-xs text-gray-400">Libreria UI</p>
                </div>
                <div className="p-3 bg-[#151a29] border border-gray-800 rounded-lg text-center">
                  <h4 className="font-medium text-white">Redux</h4>
                  <p className="text-xs text-gray-400">Gestione stato</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Soluzione replicabile</h3>
              <p className="text-gray-300">
                Driver4You è progettato come una soluzione white-label che può essere facilmente adattata e implementata
                in diverse aree geografiche. Il nostro approccio modulare consente di:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Personalizzare l'interfaccia e le funzionalità in base alle esigenze locali</li>
                <li>Integrare servizi di trasporto specifici per ogni territorio</li>
                <li>Adattare il modello di business alle condizioni economiche della zona</li>
                <li>Scalare gradualmente l'implementazione in base alla domanda</li>
              </ul>

              <div className="p-4 bg-[#151a29] border border-gray-800 rounded-lg mt-4">
                <h4 className="font-medium text-white mb-2">Pacchetto per partner locali</h4>
                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                  <li>Piattaforma web e mobile personalizzabile</li>
                  <li>Dashboard amministrativa per gestione operativa</li>
                  <li>Formazione e supporto tecnico</li>
                  <li>Strumenti di marketing e acquisizione clienti</li>
                  <li>Aggiornamenti e nuove funzionalità</li>
                </ul>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-6 pt-4 border-t border-gray-800 flex flex-col sm:flex-row gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700 flex-1" onClick={handleEmailClick}>
            <Mail className="h-4 w-4 mr-2" />
            Contattaci
          </Button>
          <Button className="bg-[#1c64f2] hover:bg-blue-700 flex-1" onClick={handleTelegramClick}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Telegram
          </Button>
          <Button className="bg-[#1e293b] hover:bg-gray-700 flex-1" onClick={() => onOpenChange(false)}>
            Chiudi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
