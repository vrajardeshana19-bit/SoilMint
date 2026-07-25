import { ArrowRight, Bot, ClipboardCheck, HandCoins } from 'lucide-react';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';

const steps = [
  {
    title: 'Register your farm',
    description: 'Create a verified profile with property, practice, and impact data in minutes.',
    icon: ClipboardCheck,
  },
  {
    title: 'AI estimate',
    description: 'Generate an evidence-backed carbon outlook with recommended actions for higher value.',
    icon: Bot,
  },
  {
    title: 'Sell credits',
    description: 'List verified credits to buyers and close transactions through a trusted marketplace.',
    icon: HandCoins,
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-slate-50 py-24">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="From field evidence to market-ready carbon credits"
          description="A streamlined workflow that turns regenerative practices into transparent, tradable value."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="group rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                    <Icon className="size-5" />
                  </div>
                  <span className="text-sm font-medium text-slate-400">0{index + 1}</span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-950">{step.title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{step.description}</p>
                {index < steps.length - 1 ? <div className="mt-6 flex items-center gap-2 text-sm font-medium text-emerald-600"><ArrowRight className="size-4" /> Continue to the next step</div> : null}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
