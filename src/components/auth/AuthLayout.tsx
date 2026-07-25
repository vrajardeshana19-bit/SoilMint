import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  backHref?: string;
};

export function AuthLayout({ title, subtitle, children, backHref = '/' }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_32%),linear-gradient(135deg,#020617,#0f172a_55%,#020617)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex items-center justify-between rounded-full border border-white/10 bg-slate-950/50 px-4 py-3 shadow-[0_12px_40px_rgba(2,6,23,0.25)] backdrop-blur-xl">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
              <Sparkles className="size-4" />
            </span>
            SoilMint
          </Link>
          <Link to={backHref} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid gap-6 rounded-[2rem] border border-white/10 bg-slate-950/60 p-4 shadow-[0_30px_120px_rgba(2,6,23,0.26)] backdrop-blur-2xl lg:grid-cols-[0.9fr_1.1fr] lg:p-8"
        >
          <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.16),rgba(15,23,42,0.72))] p-6">
            <p className="text-sm font-medium text-emerald-300">Premium onboarding</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">{title}</h1>
            <p className="mt-3 text-sm leading-7 text-slate-300">{subtitle}</p>
            <div className="mt-8 space-y-3">
              {[
                'AI-powered farm intelligence',
                'Verified carbon opportunity tracking',
                'Investor-ready sustainability reporting',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-300">
                  <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-white/10 bg-slate-900/70 p-4 sm:p-6">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
