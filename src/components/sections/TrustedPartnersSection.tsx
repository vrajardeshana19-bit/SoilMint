import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';

const partners = ['Acre Labs', 'Northstar Foods', 'BlueRiver Capital', 'TerraGrid', 'EcoLedger'];

export function TrustedPartnersSection() {
  return (
    <section className="border-b border-slate-200 bg-white/70 py-16">
      <Container>
        <SectionHeading eyebrow="Trusted by" title="Forward-thinking climate leaders" description="Built for organizations that need evidence, speed, and trust." />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {partners.map((partner) => (
            <div key={partner} className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-6 text-center text-sm font-semibold text-slate-700 shadow-sm">
              {partner}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
