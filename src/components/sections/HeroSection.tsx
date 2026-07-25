import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Play, Sparkles, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

type StatItem = {
  value: string;
  label: string;
  caption: string;
};

type DashboardCardProps = {
  title: string;
  children: React.ReactNode;
};

const navItems = [
  { label: 'Platform', sectionId: 'platform' },
  { label: 'Solutions', sectionId: 'solutions' },
  { label: 'Marketplace', sectionId: 'marketplace' },
  { label: 'About', sectionId: 'about' },
  { label: 'Pricing', sectionId: 'pricing' },
];

const stats: StatItem[] = [
  { value: '18K+', label: 'Estimated Credits', caption: 'Projected across active farms' },
  { value: '320+', label: 'Demo Farms', caption: 'Tracked through SoilMint' },
  { value: '92%', label: 'AI Confidence', caption: 'Matching and forecasting accuracy' },
  { value: '₹2.4Cr', label: 'Potential Income', caption: 'Available to verified growers' },
];

const trustSignals = ['Farmers', 'Climate Organizations', 'ESG Teams', 'Verification Partners'];

function DashboardCard({ title, children }: DashboardCardProps) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-slate-900/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur">
      <p className="text-sm font-medium text-slate-400">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function ProgressRing() {
  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[conic-gradient(#10b981_0_92%,_rgba(255,255,255,0.08)_92%_100%)] p-2">
      <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950 text-center">
        <div>
          <p className="text-2xl font-semibold text-white">92</p>
          <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Score</p>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        setMouse({ x, y });
      }}
      onMouseLeave={() => setMouse({ x: 0, y: 0 })}
      className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_32%),radial-gradient(circle_at_80%_15%,_rgba(59,130,246,0.16),_transparent_24%),linear-gradient(135deg,_#020617_0%,_#040b1d_35%,_#07111f_100%)] px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-8%] h-72 w-72 rounded-full bg-emerald-500/20 blur-[140px]" />
        <div className="absolute bottom-[-6%] right-[-6%] h-72 w-72 rounded-full bg-sky-500/15 blur-[140px]" />
        <div className="absolute left-1/2 top-1/4 h-40 w-40 -translate-x-1/2 rounded-full border border-white/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.06)_1px,_transparent_1px)] [background-size:18px_18px] opacity-20" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1400px] flex-col">
        <header className="sticky top-4 z-20 rounded-full border border-white/10 bg-slate-950/40 px-3 py-3 shadow-[0_12px_40px_rgba(2,6,23,0.25)] backdrop-blur-xl sm:px-4">
          <div className="flex items-center justify-between gap-4">
            <button type="button" onClick={() => navigate('/')} className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                <Sparkles className="size-4" />
              </span>
              SoilMint
            </button>
            <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
              {navItems.map((item) => (
                <button key={item.label} type="button" onClick={() => scrollToSection(item.sectionId)} className="transition hover:text-white">
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button size="sm" variant="outline" className="border-white/15 bg-white/10 text-white hover:bg-white/15" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button size="sm" className="hidden sm:inline-flex" onClick={() => navigate('/signup')}>
                Get Started
              </Button>
            </div>
          </div>
        </header>

        <div className="flex flex-1 items-center py-12 sm:py-16 lg:py-24">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 xl:gap-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="max-w-2xl"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3.5 py-2 text-sm font-medium text-emerald-300"
              >
                <Sparkles className="size-4" />
                AI Powered Carbon Marketplace
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.7 }}
                className="mt-7 text-5xl font-semibold leading-[0.9] tracking-[-0.04em] text-white sm:text-6xl lg:mt-8 lg:text-7xl xl:text-[5rem]"
              >
                Turn Sustainable Farming Into{' '}
                <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Verified Carbon Income
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26, duration: 0.6 }}
                className="mt-7 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl"
              >
                Estimate carbon credits using AI, receive intelligent farming recommendations, and sell verified credits directly to companies.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34, duration: 0.6 }}
                className="mt-9 flex flex-col gap-3 sm:flex-row"
              >
                <Button size="lg" className="gap-2 px-6" onClick={() => navigate('/signup')}>
                  Get Started
                  <ArrowRight className="size-4" />
                </Button>
                <Button variant="outline" size="lg" className="gap-2 border-white/15 bg-white/10 px-6 text-slate-100 hover:bg-white/15" onClick={() => navigate('/login')}>
                  <Play className="size-4 fill-current" />
                  Login
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.6 }}
                className="mt-10 flex flex-wrap items-center gap-3 text-sm text-slate-400"
              >
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, index) => (
                    <span key={index}>★</span>
                  ))}
                </div>
                <span className="font-medium text-slate-300">Trusted by</span>
                <div className="flex flex-wrap gap-2">
                  {trustSignals.map((signal) => (
                    <span key={signal} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300">
                      {signal}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48, duration: 0.65 }}
                className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
              >
                {stats.map((stat) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.52 + Number(stat.value.length) * 0.01, duration: 0.45 }}
                    whileHover={{ y: -5, scale: 1.01 }}
                    className="rounded-[1.25rem] border border-white/10 bg-white/8 p-4 shadow-[0_20px_45px_rgba(2,6,23,0.24)] backdrop-blur"
                  >
                    <p className="text-2xl font-semibold text-white">{stat.value}</p>
                    <p className="mt-1 text-sm font-medium text-slate-200">{stat.label}</p>
                    <p className="mt-1 text-xs text-slate-400">{stat.caption}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mx-auto mt-6 w-full max-w-xl lg:mt-0"
            >
              <motion.div
                animate={{ x: mouse.x * 10, y: mouse.y * 8, rotate: mouse.x * 2.5 }}
                transition={{ type: 'spring', stiffness: 70, damping: 18 }}
                className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-3 shadow-[0_35px_140px_rgba(16,185,129,0.16),0_30px_120px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-4"
              >
                <div className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(2,6,23,0.96))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Farm Sustainability Score</p>
                      <p className="mt-1 text-2xl font-semibold text-white">92 / 100</p>
                    </div>
                    <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">
                      Healthy
                    </div>
                  </div>

                  <div className="grid gap-3 lg:grid-cols-[0.7fr_1.3fr]">
                    <DashboardCard title="Soil Health">
                      <div className="flex flex-col items-center gap-3 rounded-[1.2rem] border border-white/10 bg-slate-950/70 p-3">
                        <ProgressRing />
                        <div className="text-center">
                          <p className="text-lg font-semibold text-white">Excellent</p>
                          <p className="text-sm text-slate-400">Soil vitality trending upward</p>
                        </div>
                      </div>
                    </DashboardCard>

                    <div className="space-y-3">
                      <DashboardCard title="Estimated earnings">
                        <div className="rounded-[1.2rem] border border-emerald-400/20 bg-emerald-500/10 p-4">
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-3xl font-semibold text-white">₹42,500</p>
                              <p className="mt-1 text-sm text-slate-400">Estimated Monthly Income</p>
                            </div>
                            <div className="inline-flex items-center gap-1 rounded-full bg-slate-950/70 px-2.5 py-1 text-sm text-emerald-300">
                              <TrendingUp className="size-3.5" />
                              +18%
                            </div>
                          </div>
                          <div className="mt-4 flex h-14 items-end gap-2">
                            {[34, 49, 41, 65, 58, 78].map((height, index) => (
                              <div
                                key={height}
                                className="flex-1 rounded-t-full bg-gradient-to-t from-emerald-500 to-cyan-400"
                                style={{ height: `${height}%`, opacity: index === 5 ? 1 : 0.86 }}
                              />
                            ))}
                          </div>
                        </div>
                      </DashboardCard>

                      <DashboardCard title="Interested Buyers">
                        <div className="rounded-[1.2rem] border border-white/10 bg-slate-950/70 p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-lg font-semibold text-white">18 buyers interested</p>
                              <p className="mt-1 text-sm text-slate-400">Premium demand signals active</p>
                            </div>
                            <div className="flex -space-x-2">
                              {['A', 'M', 'S'].map((letter) => (
                                <div key={letter} className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-800 bg-slate-700 text-xs font-semibold text-white">
                                  {letter}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DashboardCard>
                    </div>
                  </div>

                  <div className="mt-3 rounded-[1.4rem] border border-white/10 bg-slate-950/70 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm text-slate-400">AI recommendation</p>
                        <p className="mt-1 text-lg font-semibold text-white">Switch to cover crops</p>
                      </div>
                      <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">
                        +14 credits
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Expected income</p>
                        <p className="mt-1 text-sm font-semibold text-white">₹16,500</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Confidence</p>
                        <p className="mt-1 text-sm font-semibold text-white">96%</p>
                      </div>
                      <div className="ml-auto flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-2 text-sm font-medium text-sky-300">
                        <BarChart3 className="size-4" />
                        Live insight
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
