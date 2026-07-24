import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';

export function AiRecommendationsSection() {
  return (
    <section className="bg-slate-50/80 py-20">
      <Container>
        <SectionHeading eyebrow="AI recommendations" title="Smart suggestions that improve outcomes" description="Machine learning highlights the highest-value actions, projects, and buyers." />
        <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-950">Recommended next move</h3>
            <p className="mt-4 text-slate-600">Prioritize a regenerative barley program that aligns with buyers seeking high-integrity credits.</p>
          </div>
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 shadow-sm">
            <div className="space-y-4">
              {['Improve soil sampling cadence', 'Increase evidence completeness', 'Match to enterprise buyers'].map((item) => (
                <div key={item} className="rounded-2xl border border-emerald-200 bg-white/70 px-4 py-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
