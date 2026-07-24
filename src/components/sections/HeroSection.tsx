import { motion } from 'framer-motion';
import { Container } from '../common/Container';
import { Button } from '../ui/button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.25),_transparent_35%),linear-gradient(135deg,_#07111f_0%,_#0f172a_45%,_#111827_100%)] py-20 sm:py-24 lg:py-32">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="max-w-2xl">
            <p className="mb-4 inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">
              AI-powered carbon credit infrastructure
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Turn regenerative farming into premium carbon value.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              SoilMint helps farmers verify impact, companies source verified credits, and AI recommends the best opportunities in real time.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg">Explore the marketplace</Button>
              <Button variant="outline" size="lg" className="text-white">
                Watch product tour
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-emerald-950/30 backdrop-blur-xl">
            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Projected impact</p>
                  <p className="mt-2 text-3xl font-semibold text-white">+184k tCO₂e</p>
                </div>
                <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">Live</div>
              </div>
              <div className="mt-8 space-y-4">
                {['Verified farm data', 'AI matching engine', 'Instant buyer requests'].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                    <span>{item}</span>
                    <span className="text-emerald-300">✓</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
