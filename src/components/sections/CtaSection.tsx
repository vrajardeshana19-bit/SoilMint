import { Container } from '../common/Container';
import { Button } from '../ui/button';

export function CtaSection() {
  return (
    <section className="bg-[linear-gradient(135deg,_#0f172a_0%,_#111827_100%)] py-20 text-white">
      <Container>
        <div className="rounded-3xl border border-white/10 bg-white/10 p-10 text-center shadow-2xl shadow-emerald-950/30 backdrop-blur-xl">
          <h2 className="text-3xl font-semibold sm:text-4xl">Ready to build your climate marketplace?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Launch faster with a premium experience for farmers, buyers, and the teams that connect them.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg">Get started</Button>
            <Button variant="outline" size="lg" className="text-white">
              Talk to sales
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
