import Link from 'next/link'
import { TrendingUp, MessageCircle, ShieldCheck, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'

const FEATURES = [
  {
    icon: MessageCircle,
    title: 'Ngobrol santai',
    desc: 'Tanya soal keuangan pakai bahasa sehari-hari, tanpa istilah ribet.',
  },
  {
    icon: ShieldCheck,
    title: 'Konteks lokal',
    desc: 'Ngerti kondisi keuangan Indonesia — UMR, kos-kosan, THR, sampai harga mie ayam.',
  },
  {
    icon: Zap,
    title: 'Jawaban instan',
    desc: 'Streaming response real-time, tidak perlu nunggu lama.',
  },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium text-sm">DuitPintar</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link href="/chat">Mulai gratis</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs mb-6">
          <Zap className="w-3 h-3" />
          Didukung AI · Gratis
        </div>

        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground max-w-xl mb-4">
          Teman ngobrol soal{' '}
          <span className="text-emerald-600 dark:text-emerald-400">keuangan</span>{' '}
          kamu
        </h1>

        <p className="text-muted-foreground text-base max-w-md mb-8 leading-relaxed">
          Bingung ngatur gaji? Mau mulai nabung tapi ga tau caranya? DuitPintar siap bantu —
          santai, relate, dan ngerti kondisi anak muda Indonesia.
        </p>

        <div className="flex gap-3">
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white px-6">
            <Link href="/chat">Mulai ngobrol</Link>
          </Button>
          <Button asChild variant="outline" className="px-6">
            <Link href="/chat">Lihat contoh</Link>
          </Button>
        </div>

        {/* Fake chat preview */}
        <div className="mt-12 w-full max-w-sm bg-muted/50 border rounded-2xl p-4 text-left flex flex-col gap-3">
          <div className="flex gap-2 items-start">
            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="bg-background border rounded-2xl rounded-tl-sm px-3 py-2 text-xs text-foreground leading-relaxed">
              Halo! Mau tanya soal apa nih — budgeting, nabung, atau investasi? 👋
            </div>
          </div>
          <div className="flex gap-2 items-start flex-row-reverse">
            <div className="w-6 h-6 rounded-full bg-muted border flex items-center justify-center flex-shrink-0 text-[10px] font-medium">
              K
            </div>
            <div className="bg-emerald-600 rounded-2xl rounded-tr-sm px-3 py-2 text-xs text-white leading-relaxed">
              Gaji pertamaku 4 juta, gimana cara alokasinya?
            </div>
          </div>
          <div className="flex gap-2 items-start">
            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="bg-background border rounded-2xl rounded-tl-sm px-3 py-2 text-xs text-foreground leading-relaxed">
              Selamat gaji pertama! 🎉 Coba pakai metode 50/30/20 — 50% kebutuhan, 30% keinginan, 20% tabungan...
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t px-6 py-16">
        <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                <f.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-sm font-medium text-foreground">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          Saran bersifat edukatif — bukan nasihat keuangan profesional resmi.
        </p>
      </footer>
    </main>
  )
}