import { motion } from 'framer-motion';
import { ArrowRight, Building2, ShieldCheck, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthLayout } from '../components/auth/AuthLayout';

type CardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  badge?: string;
  disabled?: boolean;
  onSelect: () => void;
};

function SelectionCard({ icon, title, description, features, badge, disabled, onSelect }: CardProps) {
  return (
    <motion.button
      type="button"
      whileHover={!disabled ? { y: -4, scale: 1.01 } : undefined}
      onClick={onSelect}
      disabled={disabled}
      className={`rounded-[1.4rem] border p-5 text-left transition ${disabled ? 'border-white/10 bg-white/5 opacity-60' : 'border-emerald-400/20 bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(15,23,42,0.92))] hover:bg-emerald-500/10'}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-2 text-emerald-300">{icon}</div>
        {badge ? <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-300">{badge}</span> : null}
      </div>
      <h2 className="mt-4 text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
      <ul className="mt-4 space-y-2 text-sm text-slate-400">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex items-center justify-between text-sm text-slate-300">
        <span>{disabled ? 'Unavailable' : 'Available'}</span>
        <ArrowRight className="size-4" />
      </div>
    </motion.button>
  );
}

export default function AccountType() {
  const navigate = useNavigate();
  const { setAccountType, user } = useAuth();

  const handleFarmer = () => {
    setAccountType('farmer');
    navigate('/signup');
  };

  return (
    <AuthLayout title="Welcome to SoilMint" subtitle="Choose how you want to use SoilMint">
      <div className="grid gap-4">
        <SelectionCard
          icon={<Sprout className="size-5" />}
          title="Farmer"
          description="Manage farms, understand carbon intelligence, and receive AI recommendations."
          features={['Manage farms', 'Carbon Intelligence', 'AI Recommendations', 'Marketplace']}
          onSelect={handleFarmer}
        />
        <SelectionCard
          icon={<Building2 className="size-5" />}
          title="Carbon Buyer"
          description="Purchase verified credits and track ESG impact across your portfolio."
          features={['Purchase verified carbon credits', 'ESG Dashboard', 'Portfolio']}
          badge="Coming Soon"
          disabled
          onSelect={() => undefined}
        />
        <SelectionCard
          icon={<ShieldCheck className="size-5" />}
          title="Verifier"
          description="Support government, NGO, and audit workflows with trusted reporting."
          features={['Government', 'NGO', 'Carbon Auditors']}
          badge="Coming Soon"
          disabled
          onSelect={() => undefined}
        />
      </div>
      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-400">
        {user ? 'Your current selection will be used during registration.' : 'You can continue as a farmer to explore the full experience.'}
      </div>
    </AuthLayout>
  );
}
