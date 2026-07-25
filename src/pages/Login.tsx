import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const success = login(email, password);
    if (!success) {
      setError('We could not find an account with those credentials.');
      return;
    }
    navigate('/dashboard');
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue your farmer dashboard experience.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
          <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3">
            <Mail className="size-4 text-slate-400" />
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full bg-transparent text-sm text-white outline-none" placeholder="farmer@soilmint.com" />
          </div>
        </div>

        <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
          <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3">
            <Lock className="size-4 text-slate-400" />
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full bg-transparent text-sm text-white outline-none" placeholder="••••••••" />
            <button type="button" onClick={() => setShowPassword((current) => !current)} className="text-slate-400">
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <Button type="submit" className="w-full">Sign In</Button>

        <div className="rounded-[1.1rem] border border-white/10 bg-slate-950/60 px-3 py-3 text-center text-sm text-slate-400">
          <button type="button" className="font-medium text-emerald-300">Continue with Google</button>
          <span className="mx-2">•</span>
          <Link to="/signup" className="font-medium text-slate-200">Create account</Link>
        </div>
      </form>
    </AuthLayout>
  );
}
