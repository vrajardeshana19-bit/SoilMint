import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { Button } from '../components/ui/button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <AuthLayout title="Forgot password" subtitle="We will email you a secure recovery link and OTP preview for this UI flow.">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSent(true);
        }}
        className="space-y-4"
      >
        <div className="rounded-[1.1rem] border border-white/10 bg-white/5 p-4">
          <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3">
            <Mail className="size-4 text-slate-400" />
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full bg-transparent text-sm text-white outline-none" placeholder="your@email.com" />
          </div>
        </div>

        {sent ? <p className="text-sm text-emerald-300">Recovery instructions prepared. This is a UI-only experience.</p> : null}

        <Button type="submit" className="w-full">Send Recovery Link</Button>
        <div className="text-center text-sm text-slate-400">
          Remembered it? <Link to="/login" className="font-medium text-emerald-300">Back to sign in</Link>
        </div>
      </form>
    </AuthLayout>
  );
}
