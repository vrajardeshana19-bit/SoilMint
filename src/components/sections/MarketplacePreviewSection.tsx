import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';

export function MarketplacePreviewSection() {
  return (
    <section className="bg-slate-950 py-20 text-white">
      <Container>
        <SectionHeading eyebrow="Marketplace preview" title="A premium marketplace for premium climate assets" description="Review curated opportunities, compare portfolios, and transact with confidence." />
        <div className="mt-12 rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-emerald-950/30 backdrop-blur-xl">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Open opportunities</h3>
                <span className="text-sm text-emerald-300">12 live listings</span>
              </div>
              <div className="mt-6 space-y-4">
                {['Regenerative maize • 8,400 credits', 'Soil restoration • 5,200 credits', 'Agroforestry • 3,100 credits'].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-6">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">Demand signal</p>
              <p className="mt-4 text-4xl font-semibold">+31%</p>
              <p className="mt-3 text-slate-300">Premium buyer appetite for verified soil carbon credits in the next quarter.</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
