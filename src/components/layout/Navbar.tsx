import { Link } from 'react-router-dom';
import { navigation } from '../../constants/navigation';
import { Button } from '../ui/button';

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" aria-label="Primary navigation">
        <Link to="/" className="text-lg font-semibold text-white">
          SoilMint
        </Link>
        <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          {navigation.map((link) => (
            <Link key={link.to} to={link.to} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
        <Button variant="outline" size="sm" className="text-white">
          Book a demo
        </Button>
      </nav>
    </header>
  );
}
