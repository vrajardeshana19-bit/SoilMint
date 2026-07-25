import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { Button } from '../components/ui/button';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');

  return (
    <AuthLayout title="Verify your email" subtitle="A secure OTP flow is shown here for the premium onboarding experience.">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          navigate('/profile-setup');
        }}
        className="space-y-4"
      >
        <div className="rounded-[1.1rem] border border-white/10 bg-white/5 p-4">
          <label className="mb-2 block text-sm font-medium text-slate-200">One-Time Password</label>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3">
            <KeyRound className="size-4 text-slate-400" />
            <input value={otp} onChange={(event) => setOtp(event.target.value)} className="w-full bg-transparent text-sm text-white outline-none" placeholder="Enter 6 digit OTP" />
          </div>
        </div>
        <p className="text-sm text-slate-400">Demo OTP: 123456</p>
        <Button type="submit" className="w-full">Verify</Button>
      </form>
    </AuthLayout>
  );
}
