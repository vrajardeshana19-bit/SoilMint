import { ArrowUpRight, BadgeCheck, Sparkles } from 'lucide-react';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';

const listings = [
  { name: 'Northfield Regenerative Co-op', location: 'Iowa, USA', credits: '8,400 credits', price: '$184,000', score: '96/100' },
  { name: 'Cedar Ridge Farm', location: 'Kentucky, USA', credits: '5,200 credits', price: '$112,000', score: '94/100' },
  { name: 'Riverbank Agroforestry', location: 'Oregon, USA', credits: '3,100 credits', price: '$71,000', score: '91/100' },
];

export function MarketplacePreviewSection() {
  return (
    <section className="bg-slate-950 py-24 text-white">
      <Container>
        <SectionHeading
          eyebrow="Marketplace preview"
          title="A premium marketplace for premium climate assets"
          description="Review curated opportunities, compare portfolios, and transact with confidence."
        />
        <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/8 p-6 shadow-[0_30px_100px_rgba(2,6,23,0.35)] backdrop-blur-xl sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Live listings</p>
                  <p className="mt-1 text-xl font-semibold text-white">12 opportunities currently open</p>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">+31% demand</div>
              </div>
              <div className="mt-6 space-y-3">
                {listings.map((listing) => (
                  <div key={listing.name} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">{listing.name}</p>
                        <BadgeCheck className="size-4 text-emerald-300" />
                      </div>
                      <p className="mt-1 text-sm text-slate-400">{listing.location}</p>
                    </div>
                    <div className="text-sm text-slate-300">
                      <p>{listing.credits}</p>
                      <p className="mt-1 font-medium text-white">{listing.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-emerald-400/20 bg-gradient-to-br from-emerald-500/15 to-teal-500/10 p-6">
              <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.24em] text-emerald-300">
                <Sparkles className="size-4" />
                Demand signal
              </div>
              <p className="mt-6 text-5xl font-semibold text-white">+31%</p>
              <p className="mt-4 text-lg leading-8 text-slate-300">Premium buyer appetite for verified soil carbon credits is accelerating in the next quarter.</p>
              <div className="mt-8 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
                <span>Carbon score</span>
                <span className="font-semibold text-white">96.4</span>
              </div>
              <button className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-200">
                Explore live marketplace
                <ArrowUpRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
