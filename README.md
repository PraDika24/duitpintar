# DuitPintar 💰

Asisten keuangan personal berbasis AI untuk anak muda Indonesia. Tanya soal budgeting, nabung, dana darurat, dan investasi — pakai bahasa sehari-hari.

**Live demo:** [duitpintar.vercel.app](https://duitpintar-fazw-mxckuxeup-pra-dika24-s-projects.vercel.app/)

---

## Features

- 🤖 **AI Chat** — Didukung Gemini dengan streaming response real-time
- 💾 **Persistent History** — Riwayat chat tersimpan di browser, tidak hilang saat refresh
- 🌙 **Dark / Light Mode** — Otomatis ikut preferensi sistem
- 📱 **PWA** — Bisa di-install di HP layaknya aplikasi native
- 🛡️ **Rate Limiting** — Proteksi dari spam dan abuse di sisi frontend & backend
- 📊 **Analytics** — Tracking penggunaan via Vercel Analytics

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 |
| Styling | Tailwind CSS + shadcn/ui |
| AI | Google Gemini API |
| Analytics | Vercel Analytics |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Google Gemini API key → [aistudio.google.com](https://aistudio.google.com)

### Installation

```bash
# Clone repo
git clone https://github.com/PraDika24/duitpintar
cd duitpintar

# Install dependencies
npm install

# Setup environment
touch .env.local
```

Isi `.env.local`:

```env
GEMINI_API_KEY=your_api_key_here
```

```bash
# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
duitpintar/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout + providers
│   └── chat/
│       └── page.tsx          # Halaman chat
├── components/
│   ├── ChatMessages.tsx      # Render pesan + Markdown
│   ├── ChatInput.tsx         # Input + quick chips + rate limit
│   ├── Sidebar.tsx           # Riwayat sesi
│   ├── ThemeToggle.tsx       # Dark/light mode toggle
│   └── PWAInstallBanner.tsx  # Banner install PWA
├── hooks/
│   ├── useChatSessions.ts    # State + localStorage persistence
│   └── useRateLimit.ts       # Client-side rate limiting
├── lib/
│   ├── system-prompt.ts      # Tuning persona AI
│   ├── validation.ts         # Validasi input & proteksi
│   ├── rate-limit.ts         # Server-side rate limiting
│   └── analytics.ts          # Custom event tracking
└── app/api/
    └── chat/
        └── route.ts          # Gemini API handler + fallback
```

---

## Security

- **Prompt Injection** — Filter regex pada pesan user
- **Rate Limiting** — 10 req/menit, 40 req/jam per IP
- **Token Bomb** — Maksimal 1000 karakter per pesan
- **Output Expansion** — Hard cap 4000 karakter output, `maxOutputTokens: 512`
- **Context Window** — Maksimal 20 pesan history per request
- **Model Fallback** — Otomatis ganti model jika 503/429/404

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ | Google Gemini API key |

---

