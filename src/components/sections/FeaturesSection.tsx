import { BarChart3, Leaf, ShieldCheck, Sparkles, Waves } from 'lucide-react';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';

const features = [
  {
    title: 'AI Carbon Estimation',
    description: 'Model field-level carbon outcomes with transparent assumptions and forecast confidence.',
    icon: Sparkles,
  },
  {
    title: 'Marketplace Intelligence',
    description: 'Match every credit to the right buyer with real-time demand signals and pricing guidance.',
    icon: BarChart3,
  },
  {
    title: 'Weather & Soil Signals',
    description: 'Blend environmental conditions with farm data to improve accuracy and timing.',
    icon: Waves,
  },
  {
    title: 'Verification & Trust',
    description: 'Generate audit-ready evidence, provenance, and compliance records at the click of a button.',
    icon: ShieldCheck,
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-slate-950 py-24 text-white">
      <Container>
        <SectionHeading
          eyebrow="Platform features"
          title="Premium infrastructure for verified climate commerce"
          description="Every capability is designed to remove friction between producers, buyers, and the teams validating impact."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-[1.5rem] border border-white/10 bg-white/8 p-7 shadow-[0_20px_60px_rgba(2,6,23,0.25)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{feature.description}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-300">
                  <Leaf className="size-4" />
                  {index + 1}/4 capabilities
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
