import { Quote } from 'lucide-react';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';

const testimonials = [
  {
    quote: 'SoilMint gave us the speed and rigor we needed to build a credible climate portfolio without adding operational drag.',
    author: 'Mina Patel',
    role: 'Sustainability Lead, Northstar Foods',
  },
  {
    quote: 'We can now prove our impact to buyers and unlock new revenue while giving our field teams a much clearer operating model.',
    author: 'Daniel Cruz',
    role: 'Operations Director, Acre Labs',
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-white py-24">
      <Container>
        <SectionHeading eyebrow="Testimonials" title="Loved by sustainability teams and growers alike" description="A trusted experience from discovery to transaction, built for ambitious climate companies." />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <div key={testimonial.author} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                <Quote className="size-5" />
              </div>
              <p className="mt-6 text-lg leading-8 text-slate-700">“{testimonial.quote}”</p>
              <div className="mt-6">
                <p className="font-semibold text-slate-950">{testimonial.author}</p>
                <p className="mt-1 text-sm text-slate-600">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
