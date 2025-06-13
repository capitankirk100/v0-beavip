"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Shield, Cookie, X, ChevronDown, ChevronUp } from "lucide-react"

interface CookieBannerProps {
  onAccept: () => void
  onReject: () => void
}

export function CookieBanner({ onAccept, onReject }: CookieBannerProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0d14] border-t border-gray-800 p-4 md:p-6 shadow-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center">
            <Cookie className="h-6 w-6 text-blue-400 mr-3" />
            <h3 className="text-lg font-medium text-white">Utilizziamo i cookie</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="border-gray-700 text-gray-300" onClick={onReject}>
              Rifiuta
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={onAccept}>
              Accetta tutti
            </Button>
          </div>
        </div>

        <p className="text-gray-300 text-sm mt-3">
          Utilizziamo cookie e tecnologie simili per migliorare la tua esperienza, analizzare il traffico e
          personalizzare i contenuti. Cliccando "Accetta tutti", acconsenti all'uso di tutti i cookie. Per maggiori
          informazioni o per gestire le tue preferenze, consulta la nostra{" "}
          <button className="text-blue-400 underline hover:text-blue-300" onClick={() => setShowPrivacyPolicy(true)}>
            Informativa sulla Privacy
          </button>
          .
        </p>

        <button
          className="flex items-center text-blue-400 text-sm mt-3 hover:text-blue-300"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" /> Nascondi dettagli
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" /> Mostra dettagli
            </>
          )}
        </button>

        {showDetails && (
          <div className="mt-4 bg-[#151a29] border border-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-white mb-3">Tipi di cookie che utilizziamo</h4>
            <div className="space-y-3">
              <div>
                <h5 className="text-sm font-medium text-white">Cookie necessari</h5>
                <p className="text-xs text-gray-300">
                  Questi cookie sono essenziali per il funzionamento del sito web e non possono essere disattivati.
                  Supportano funzionalità come l'autenticazione e la navigazione.
                </p>
              </div>
              <div>
                <h5 className="text-sm font-medium text-white">Cookie analitici</h5>
                <p className="text-xs text-gray-300">
                  Ci aiutano a capire come gli utenti interagiscono con il nostro sito, permettendoci di migliorare
                  l'esperienza utente e le prestazioni.
                </p>
              </div>
              <div>
                <h5 className="text-sm font-medium text-white">Cookie di marketing</h5>
                <p className="text-xs text-gray-300">
                  Utilizzati per tracciare i visitatori attraverso i siti web e mostrare annunci pertinenti in base alle
                  preferenze dell'utente.
                </p>
              </div>
              <div>
                <h5 className="text-sm font-medium text-white">Cookie di preferenza</h5>
                <p className="text-xs text-gray-300">
                  Consentono al sito web di ricordare le scelte fatte dall'utente (come la lingua o la regione) e
                  fornire funzionalità avanzate e personalizzate.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showPrivacyPolicy} onOpenChange={setShowPrivacyPolicy}>
        <DialogContent className="bg-[#0a0d14] text-white border-gray-800 max-w-4xl max-h-[80vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl flex items-center">
                <Shield className="h-5 w-5 text-blue-400 mr-2" />
                Informativa sulla Privacy e GDPR
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPrivacyPolicy(false)}
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription className="text-gray-400 mt-2">Ultima modifica: 30 Aprile 2025</DialogDescription>
          </DialogHeader>

          <ScrollArea className="p-6 max-h-[60vh]">
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-medium text-white mb-3">1. Introduzione</h3>
                <p className="text-gray-300 text-sm">
                  La presente Informativa sulla Privacy descrive come Driver4You ("noi", "nostro" o "ci") raccoglie,
                  utilizza e condivide i tuoi dati personali quando utilizzi la nostra applicazione mobile, il nostro
                  sito web o qualsiasi altro servizio offerto da Driver4You (collettivamente, i "Servizi").
                </p>
                <p className="text-gray-300 text-sm mt-2">
                  Questa Informativa è conforme al Regolamento Generale sulla Protezione dei Dati (GDPR) dell'Unione
                  Europea e ad altre leggi sulla privacy applicabili.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-medium text-white mb-3">2. Dati che raccogliamo</h3>
                <p className="text-gray-300 text-sm">Possiamo raccogliere i seguenti tipi di dati personali:</p>
                <ul className="list-disc list-inside text-gray-300 text-sm mt-2 space-y-1">
                  <li>
                    <span className="font-medium text-white">Dati di identificazione:</span> nome, indirizzo email,
                    numero di telefono
                  </li>
                  <li>
                    <span className="font-medium text-white">Dati di localizzazione:</span> posizione geografica quando
                    utilizzi i nostri servizi
                  </li>
                  <li>
                    <span className="font-medium text-white">Dati di utilizzo:</span> informazioni su come interagisci
                    con i nostri Servizi
                  </li>
                  <li>
                    <span className="font-medium text-white">Dati delle transazioni:</span> dettagli sui pagamenti e
                    sulle prenotazioni effettuate
                  </li>
                  <li>
                    <span className="font-medium text-white">Dati del dispositivo:</span> informazioni sul dispositivo
                    utilizzato per accedere ai nostri Servizi
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-medium text-white mb-3">3. Come utilizziamo i tuoi dati</h3>
                <p className="text-gray-300 text-sm">Utilizziamo i tuoi dati personali per:</p>
                <ul className="list-disc list-inside text-gray-300 text-sm mt-2 space-y-1">
                  <li>Fornire, mantenere e migliorare i nostri Servizi</li>
                  <li>Elaborare le tue prenotazioni e i pagamenti</li>
                  <li>Comunicare con te riguardo ai nostri Servizi</li>
                  <li>Personalizzare la tua esperienza</li>
                  <li>Analizzare come vengono utilizzati i nostri Servizi</li>
                  <li>Prevenire frodi e attività illegali</li>
                  <li>Rispettare i nostri obblighi legali</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-medium text-white mb-3">4. Condivisione dei dati</h3>
                <p className="text-gray-300 text-sm">Possiamo condividere i tuoi dati personali con:</p>
                <ul className="list-disc list-inside text-gray-300 text-sm mt-2 space-y-1">
                  <li>
                    <span className="font-medium text-white">Fornitori di servizi:</span> aziende che ci aiutano a
                    fornire i nostri Servizi (come fornitori di pagamento, servizi cloud, ecc.)
                  </li>
                  <li>
                    <span className="font-medium text-white">Partner di trasporto:</span> i fornitori di servizi di
                    trasporto che effettuano le corse
                  </li>
                  <li>
                    <span className="font-medium text-white">Autorità legali:</span> quando richiesto dalla legge o
                    necessario per proteggere i nostri diritti
                  </li>
                </ul>
                <p className="text-gray-300 text-sm mt-2">
                  Non vendiamo i tuoi dati personali a terze parti per scopi di marketing.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-medium text-white mb-3">5. Cookie e tecnologie simili</h3>
                <p className="text-gray-300 text-sm">
                  Utilizziamo cookie e tecnologie simili per raccogliere informazioni sul tuo utilizzo dei nostri
                  Servizi. I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo quando visiti
                  il nostro sito web.
                </p>
                <p className="text-gray-300 text-sm mt-2">Utilizziamo i seguenti tipi di cookie:</p>
                <ul className="list-disc list-inside text-gray-300 text-sm mt-2 space-y-1">
                  <li>
                    <span className="font-medium text-white">Cookie necessari:</span> essenziali per il funzionamento
                    del sito
                  </li>
                  <li>
                    <span className="font-medium text-white">Cookie analitici:</span> ci aiutano a capire come gli
                    utenti utilizzano il nostro sito
                  </li>
                  <li>
                    <span className="font-medium text-white">Cookie di marketing:</span> utilizzati per mostrarti
                    annunci pertinenti
                  </li>
                  <li>
                    <span className="font-medium text-white">Cookie di preferenza:</span> memorizzano le tue preferenze
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-medium text-white mb-3">6. I tuoi diritti</h3>
                <p className="text-gray-300 text-sm">
                  Ai sensi del GDPR e di altre leggi sulla privacy applicabili, hai i seguenti diritti:
                </p>
                <ul className="list-disc list-inside text-gray-300 text-sm mt-2 space-y-1">
                  <li>Diritto di accesso ai tuoi dati personali</li>
                  <li>Diritto di rettifica dei dati inesatti</li>
                  <li>Diritto alla cancellazione dei tuoi dati (diritto all'oblio)</li>
                  <li>Diritto alla limitazione del trattamento</li>
                  <li>Diritto alla portabilità dei dati</li>
                  <li>Diritto di opposizione al trattamento</li>
                  <li>Diritto di non essere sottoposto a decisioni automatizzate</li>
                </ul>
                <p className="text-gray-300 text-sm mt-2">
                  Per esercitare questi diritti, contattaci all'indirizzo email{" "}
                  <a href="mailto:nobeliumlab@protonmail.com" className="text-blue-400 hover:text-blue-300">
                    nobeliumlab@protonmail.com
                  </a>
                  .
                </p>
              </section>

              <section>
                <h3 className="text-lg font-medium text-white mb-3">7. Sicurezza dei dati</h3>
                <p className="text-gray-300 text-sm">
                  Adottiamo misure di sicurezza tecniche e organizzative appropriate per proteggere i tuoi dati
                  personali da perdita, uso improprio, accesso non autorizzato, divulgazione, alterazione e distruzione.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-medium text-white mb-3">8. Conservazione dei dati</h3>
                <p className="text-gray-300 text-sm">
                  Conserviamo i tuoi dati personali solo per il tempo necessario a fornire i nostri Servizi e per le
                  finalità descritte in questa Informativa sulla Privacy. Quando non abbiamo più bisogno di utilizzare i
                  tuoi dati, li eliminiamo o li rendiamo anonimi.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-medium text-white mb-3">9. Trasferimenti internazionali</h3>
                <p className="text-gray-300 text-sm">
                  I tuoi dati personali possono essere trasferiti e trattati in paesi diversi da quello in cui risiedi.
                  Questi paesi potrebbero avere leggi sulla protezione dei dati diverse dalle leggi del tuo paese.
                </p>
                <p className="text-gray-300 text-sm mt-2">
                  Quando trasferiamo i tuoi dati personali al di fuori dell'UE/SEE, garantiamo un livello adeguato di
                  protezione implementando garanzie appropriate, come le clausole contrattuali standard approvate dalla
                  Commissione Europea.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-medium text-white mb-3">10. Modifiche a questa Informativa</h3>
                <p className="text-gray-300 text-sm">
                  Possiamo aggiornare questa Informativa sulla Privacy di tanto in tanto. La versione più recente sarà
                  sempre disponibile sul nostro sito web. Ti informeremo di eventuali modifiche sostanziali tramite
                  email o un avviso sui nostri Servizi.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-medium text-white mb-3">11. Contattaci</h3>
                <p className="text-gray-300 text-sm">
                  Se hai domande o dubbi riguardo a questa Informativa sulla Privacy o al trattamento dei tuoi dati
                  personali, contattaci all'indirizzo email:{" "}
                  <a href="mailto:nobeliumlab@protonmail.com" className="text-blue-400 hover:text-blue-300">
                    nobeliumlab@protonmail.com
                  </a>
                </p>
              </section>
            </div>
          </ScrollArea>

          <div className="p-6 pt-4 border-t border-gray-800">
            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setShowPrivacyPolicy(false)}>
              Ho capito
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
