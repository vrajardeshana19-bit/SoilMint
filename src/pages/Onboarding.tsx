import { motion } from 'framer-motion';
import { ArrowRight, FileText, Sparkles, Satellite, Trees } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';

const steps = [
  { icon: FileText, title: 'Upload Government Land Record', description: 'Add your land documentation and verify your farm profile.' },
  { icon: Satellite, title: 'AI analyzes your farm using satellite and government data', description: 'We combine geospatial intelligence with public records for rich insights.' },
  { icon: Trees, title: 'Receive sustainability insights and carbon credit estimates', description: 'Unlock actionable recommendations and market opportunities.' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();

  const handleContinue = () => {
    completeOnboarding();
    navigate('/dashboard');
  };

  return (
    <AuthLayout title="Welcome to SoilMint" subtitle="Let's build your Digital Farm Profile.">
      <div className="space-y-4">
        <div className="rounded-[1.2rem] border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="size-4" />
            Your onboarding experience is now ready.
          </div>
        </div>

        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex items-start gap-3 rounded-[1.2rem] border border-white/10 bg-white/5 p-4"
            >
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-2 text-emerald-300">
                <Icon className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{step.title}</p>
                <p className="mt-1 text-sm text-slate-400">{step.description}</p>
              </div>
            </motion.div>
          );
        })}

        <Button onClick={handleContinue} className="w-full gap-2">
          Go to Dashboard
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </AuthLayout>
  );
}
