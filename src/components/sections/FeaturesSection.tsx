import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';

const features = [
  { title: 'Live impact analytics', description: 'See verified carbon and biodiversity metrics as they evolve.' },
  { title: 'Automated compliance', description: 'Prepare audit-ready evidence without manual document wrangling.' },
  { title: 'Dynamic pricing', description: 'Use AI signals to optimize credit portfolio value and timing.' },
  { title: 'Buyer intelligence', description: 'Learn which company demand profiles fit your farm’s outcomes best.' },
];

export function FeaturesSection() {
  return (
    <section className="bg-white py-20">
      <Container>
        <SectionHeading eyebrow="Platform features" title="Purpose-built for climate-first commerce" description="Every capability is designed to remove friction between producers and buyers." />
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-950">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
