import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';

const testimonials = [
  {
    quote: 'SoilMint gave us the speed and rigor we needed to build a credible climate portfolio.',
    author: 'Mina Patel',
    role: 'Sustainability Lead, Northstar Foods',
  },
  {
    quote: 'We can now prove our impact to buyers and unlock new revenue without extra admin overhead.',
    author: 'Daniel Cruz',
    role: 'Operations Director, Acre Labs',
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-white py-20">
      <Container>
        <SectionHeading eyebrow="Testimonials" title="Loved by sustainability teams and growers alike" description="A trusted experience from discovery to transaction." />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <div key={testimonial.author} className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
              <p className="text-lg leading-8 text-slate-700">“{testimonial.quote}”</p>
              <div className="mt-6">
                <p className="font-semibold text-slate-950">{testimonial.author}</p>
                <p className="text-sm text-slate-600">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
