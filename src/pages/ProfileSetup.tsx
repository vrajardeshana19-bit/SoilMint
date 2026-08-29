import { useState } from 'react';
import { Home, MapPin, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { completeProfile, user } = useAuth();
  const [farmName, setFarmName] = useState(user?.farmName ?? '');
  const [location, setLocation] = useState(user?.location ?? '');
  const [error, setError] = useState('');

  const isValid = farmName.trim().length > 0 && location.trim().length > 0;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!isValid) {
      setError('Please add both your farm name and location before continuing.');
      return;
    }

    completeProfile(user?.name ?? 'Farmer', user?.phone ?? '+91 00000 00000', farmName.trim(), location.trim());
    setError('');
    navigate('/onboarding');
  };

  return (
    <AuthLayout title="Profile setup" subtitle="Add the first details of your digital farm profile to personalize the experience.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-[1.1rem] border border-white/10 bg-white/5 p-4">
          <label className="mb-2 block text-sm font-medium text-slate-200">Farm Name</label>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3">
            <Home className="size-4 text-slate-400" />
            <input value={farmName} onChange={(event) => setFarmName(event.target.value)} className="w-full bg-transparent text-sm text-white outline-none" placeholder="Green Valley Farms" />
          </div>
        </div>

        <div className="rounded-[1.1rem] border border-white/10 bg-white/5 p-4">
          <label className="mb-2 block text-sm font-medium text-slate-200">Location</label>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3">
            <MapPin className="size-4 text-slate-400" />
            <input value={location} onChange={(event) => setLocation(event.target.value)} className="w-full bg-transparent text-sm text-white outline-none" placeholder="Rajkot, Gujarat" />
          </div>
        </div>

        <div className="rounded-[1.15rem] border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-slate-300">
          <div className="flex items-center gap-2 font-medium text-emerald-200">
            <Sparkles className="size-4" />
            We will use these details to personalize your dashboard.
          </div>
        </div>

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={!isValid}>Continue</Button>
      </form>
    </AuthLayout>
  );
}
