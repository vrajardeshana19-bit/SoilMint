import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';

const steps = [
  { title: 'Verify impact', description: 'Farmers capture field-level data and proof of regenerative practices.' },
  { title: 'Match demand', description: 'AI identifies buyers and aligns credits with their sustainability goals.' },
  { title: 'Trade confidently', description: 'Every transaction is trackable, transparent, and market-ready.' },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-slate-50/70 py-20">
      <Container>
        <SectionHeading eyebrow="How it works" title="From field data to market-ready credits" description="A simple operating model that scales across supply chains and geographies." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                0{index + 1}
              </div>
              <h3 className="text-xl font-semibold text-slate-950">{step.title}</h3>
              <p className="mt-3 text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
