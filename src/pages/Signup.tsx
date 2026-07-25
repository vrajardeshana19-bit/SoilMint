import { Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { signup, user } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const isValid = useMemo(() => Boolean(form.name && form.phone && form.email && form.password && form.confirmPassword && form.password === form.confirmPassword && acceptedTerms), [form, acceptedTerms]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValid) {
      setError('Please complete the form and accept the terms.');
      return;
    }

    const success = signup({
      name: form.name,
      phone: form.phone,
      email: form.email,
      password: form.password,
      accountType: user?.accountType ?? 'farmer',
    });

    if (!success) {
      setError('We could not create your account right now.');
      return;
    }

    navigate('/onboarding');
  };

  return (
    <AuthLayout title="Create your account" subtitle="Join SoilMint as a farmer and unlock your digital farm profile.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.1rem] border border-white/10 bg-white/5 p-4">
            <label className="mb-2 block text-sm font-medium text-slate-200">Full Name</label>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3">
              <User className="size-4 text-slate-400" />
              <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="w-full bg-transparent text-sm text-white outline-none" placeholder="Aarav Patel" />
            </div>
          </div>
          <div className="rounded-[1.1rem] border border-white/10 bg-white/5 p-4">
            <label className="mb-2 block text-sm font-medium text-slate-200">Phone Number</label>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3">
              <Phone className="size-4 text-slate-400" />
              <input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="w-full bg-transparent text-sm text-white outline-none" placeholder="+91 98765 43210" />
            </div>
          </div>
        </div>

        <div className="rounded-[1.1rem] border border-white/10 bg-white/5 p-4">
          <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3">
            <Mail className="size-4 text-slate-400" />
            <input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="w-full bg-transparent text-sm text-white outline-none" placeholder="farmer@soilmint.com" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.1rem] border border-white/10 bg-white/5 p-4">
            <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3">
              <Lock className="size-4 text-slate-400" />
              <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} className="w-full bg-transparent text-sm text-white outline-none" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword((current) => !current)} className="text-slate-400">
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <div className="rounded-[1.1rem] border border-white/10 bg-white/5 p-4">
            <label className="mb-2 block text-sm font-medium text-slate-200">Confirm Password</label>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3">
              <Lock className="size-4 text-slate-400" />
              <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))} className="w-full bg-transparent text-sm text-white outline-none" placeholder="••••••••" />
              <button type="button" onClick={() => setShowConfirm((current) => !current)} className="text-slate-400">
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
        </div>

        <label className="flex items-start gap-3 rounded-[1.1rem] border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
          <input type="checkbox" checked={acceptedTerms} onChange={() => setAcceptedTerms((current) => !current)} className="mt-1" />
          <span>I accept the terms and understand that this is a UI-only onboarding prototype.</span>
        </label>

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <Button type="submit" className="w-full">Create Account</Button>
        <div className="text-center text-sm text-slate-400">
          Already have an account? <Link to="/login" className="font-medium text-emerald-300">Sign in</Link>
        </div>
      </form>
    </AuthLayout>
  );
}
