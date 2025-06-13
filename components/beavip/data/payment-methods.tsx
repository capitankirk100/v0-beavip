import type { PaymentMethod, CryptoAddress } from "../types"

// Aggiungi gli indirizzi delle criptovalute
export const cryptoAddresses: CryptoAddress[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    address: "bc1qfn9wspynx0ru7vf4dh6u5uqtvf8xxvtvnsqc9p",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-yellow-500"
      >
        <path d="M11.767 19.089c4.924.868 9.593-2.535 10.461-7.593.868-5.058-2.535-9.727-7.593-10.595-5.058-.868-9.727 2.535-10.595 7.593-.868 5.058 2.535 9.727 7.727 10.595z" />
        <path d="M15.641 7.647c.154 1.57-1.189 2.147-3.208 2.647l.654-2.647 2.554 0z" />
        <path d="M14.128 15.39c1.432-.076 2.7-.802 2.849-2.333.193-1.95-1.529-2.585-3.771-3.178l-.76 3.07c0 0 .38 2.44 1.682 2.44z" />
        <path d="M10.334 7.219l-.654 2.646c.873-.191 3.523-.929 3.208-2.646h-2.554z" />
        <path d="M10.8 12.414l-.76 3.07c.596.146 2.4.391 2.442-2.494-1.055-.237-1.682-.576-1.682-.576z" />
      </svg>
    ),
  },
  {
    id: "bitcoincash",
    name: "Bitcoin Cash",
    address: "qryer508n485qv7fh5wee9af4uku7x44gqztzr4flf",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-green-500"
      >
        <rect width="18" height="12" x="3" y="6" rx="2" />
        <path d="M3 10h18" />
        <circle cx="7" cy="16" r="1" />
        <path d="M15 8v1" />
        <path d="M15 15v1" />
        <path d="M9 12h6" />
        <path d="M13 10v4" />
      </svg>
    ),
  },
  {
    id: "monero",
    name: "Monero",
    address: "48hXdxhXHiDashYViavuB9TwVaa9jNhmHF1RMixn6wS2f9newUpDQNvDT2rjtMiyLHjZBRVrg4PhF5LyBGXsQUnPGoXYrxx",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-orange-500"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 16V8h8" />
        <path d="m4 9 8 8 8-8" />
      </svg>
    ),
  },
]

export const paymentMethods: PaymentMethod[] = [
  {
    id: "crypto",
    name: "Crypto",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-yellow-400"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.5 9.5h5c.28 0 .5.22.5.5v4c0 .28-.22.5-.5.5h-5c-.28 0-.5-.22-.5-.5v-4c0-.28.22-.5.5-.5z" />
        <path d="M9.5 14.5V17a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-2.5" />
        <path d="M9.5 9.5V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2.5" />
      </svg>
    ),
    description: "Paga con Bitcoin, Bitcoin Cash o Monero",
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-400"
      >
        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
        <path d="M15 12V8a5 5 0 0 0-9.9-1" />
        <rect width="10" height="14" x="2" y="5" rx="2" />
        <path d="M12 19h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      </svg>
    ),
    paymentUrl: "https://paypal.me/",
    description: "Invia denaro a Marco Pacchiotti",
  },
  {
    id: "revolut",
    name: "Revolut",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-pink-400"
      >
        <path d="M5.5 8.5 9 12l-3.5 3.5" />
        <path d="m12 8 4 8" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    paymentUrl: "https://revolut.me/marco5jfb",
    description: "Paga istantaneamente con Revolut",
  },
]
