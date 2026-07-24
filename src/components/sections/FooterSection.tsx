import { Link } from 'react-router-dom';
import { Container } from '../common/Container';

export function FooterSection() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10">
      <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-slate-950">SoilMint</p>
          <p className="mt-1 text-sm text-slate-600">Climate infrastructure for regenerative commerce.</p>
        </div>
        <div className="flex gap-4 text-sm text-slate-600">
          <Link to="/" className="transition hover:text-slate-950">
            Privacy
          </Link>
          <Link to="/about" className="transition hover:text-slate-950">
            Terms
          </Link>
          <Link to="/marketplace" className="transition hover:text-slate-950">
            Contact
          </Link>
        </div>
      </Container>
    </footer>
  );
}
