import { ArrowRight, Sparkles } from 'lucide-react';
import { Container } from '../common/Container';
import { Button } from '../ui/button';

export function CtaSection() {
  return (
    <section className="bg-[linear-gradient(135deg,_#020617_0%,_#07111f_35%,_#0f172a_100%)] py-24 text-white">
      <Container>
        <div className="rounded-[2rem] border border-emerald-400/20 bg-gradient-to-br from-emerald-500/12 via-slate-900/80 to-teal-500/10 p-8 text-center shadow-[0_30px_90px_rgba(2,6,23,0.35)] sm:p-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
            <Sparkles className="size-5" />
          </div>
          <h2 className="mt-6 text-3xl font-semibold sm:text-4xl">Join SoilMint and turn regenerative practices into verified income.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Launch faster with a premium experience for farmers, buyers, and the teams that connect them.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" className="gap-2">
              Get started
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="outline" size="lg" className="border-white/15 bg-white/10 text-white hover:bg-white/15">
              Talk to sales
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
