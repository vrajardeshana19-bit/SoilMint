import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Bot, FileText, Leaf, Plus, Sprout, TrendingUp, Upload, Workflow } from 'lucide-react';
import type { Farm } from '../../contexts/FarmsContext';

const quickActions = [
  { title: 'Add Farm', subtitle: 'Create a new digital farm profile', icon: Plus },
  { title: 'Upload Land Record', subtitle: 'Process government documents', icon: Upload },
  { title: 'Analyze Farm', subtitle: 'Run AI-powered farm assessment', icon: Workflow },
  { title: 'View Timeline', subtitle: 'Track every milestone', icon: BarChart3 },
  { title: 'Ask AI', subtitle: 'Get recommendations instantly', icon: Bot },
  { title: 'Marketplace', subtitle: 'Explore carbon opportunities', icon: Leaf },
];

type DashboardHomeProps = {
  farms: Farm[];
  onAddFarm?: () => void;
};

const timeline = [
  'Farm Created',
  'Land Record Uploaded',
  'Satellite Analysis Completed',
  'Carbon Assessment Generated',
  'Marketplace Listing Created',
];

function numericValue(value: string) {
  const parsed = Number.parseFloat(value.replace(/[^\d.]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCredits(value: number) {
  return `${Math.round(value).toLocaleString('en-IN')} credits`;
}

function formatIncome(farms: Farm[]) {
  const total = farms.reduce((sum, farm) => {
    const income = numericValue(farm.carbon.annualIncome);
    return sum + (farm.carbon.annualIncome.toUpperCase().includes('L') ? income * 100000 : income);
  }, 0);

  if (total >= 100000) {
    return `₹${(total / 100000).toFixed(1)}L`;
  }

  return `₹${Math.round(total).toLocaleString('en-IN')}`;
}

export function DashboardHome({ farms, onAddFarm }: DashboardHomeProps) {
  const totalCredits = farms.reduce((sum, farm) => sum + numericValue(farm.carbon.estimatedCredits), 0);
  const averageScore = farms.length
    ? Math.round(farms.reduce((sum, farm) => sum + numericValue(farm.soil.sustainabilityScore), 0) / farms.length)
    : 0;
  const verifiedDocuments = farms.reduce(
    (count, farm) => count + farm.documents.filter((document) => document.status.toLowerCase() === 'verified').length,
    0,
  );
  const metrics = [
    { label: 'Total Farms', value: farms.length.toLocaleString('en-IN'), icon: Sprout, accent: 'text-emerald-300' },
    { label: 'Estimated Carbon Credits', value: formatCredits(totalCredits), icon: Leaf, accent: 'text-emerald-300' },
    { label: 'Estimated Annual Income', value: formatIncome(farms), icon: TrendingUp, accent: 'text-emerald-300' },
    { label: 'Sustainability Score', value: `${averageScore}/100`, icon: BarChart3, accent: 'text-emerald-300' },
    { label: 'Verified Documents', value: verifiedDocuments.toLocaleString('en-IN'), icon: FileText, accent: 'text-emerald-300' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-[1.35rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.88),rgba(2,6,23,0.96))] p-4 shadow-[0_18px_50px_rgba(2,6,23,0.18)] backdrop-blur-xl"
            >
              <div className={`inline-flex rounded-2xl border border-white/10 bg-slate-950/60 p-2 ${metric.accent}`}>
                <Icon className="size-4" />
              </div>
              <p className="mt-3 text-sm text-slate-400">{metric.label}</p>
              <p className="mt-2 text-xl font-semibold text-white">{metric.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(2,6,23,0.96))] p-5 shadow-[0_25px_80px_rgba(2,6,23,0.16)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-300">Quick Actions</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Launch your next farm workflow</h2>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -3, scale: 1.01 }}
                onClick={() => {
                  if (action.title === 'Add Farm' && onAddFarm) {
                    onAddFarm();
                  }
                }}
                className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-2 text-emerald-300">
                    <Icon className="size-4" />
                  </div>
                  <ArrowRight className="size-4 text-slate-400" />
                </div>
                <p className="mt-4 text-sm font-semibold text-white">{action.title}</p>
                <p className="mt-1 text-sm text-slate-400">{action.subtitle}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(2,6,23,0.96))] p-5 shadow-[0_25px_80px_rgba(2,6,23,0.16)] backdrop-blur-xl">
        <p className="text-sm font-medium text-emerald-300">Recent Activity</p>
        <div className="mt-4 space-y-3">
          {timeline.map((item, index) => (
            <div key={item} className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/10 text-sm font-semibold text-emerald-200">
                {index + 1}
              </div>
              <div className="flex-1 rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                {item}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
