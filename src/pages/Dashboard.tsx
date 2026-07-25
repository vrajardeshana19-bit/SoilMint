import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Topbar } from '../components/dashboard/Topbar';
import { DashboardHome } from '../components/dashboard/DashboardHome';
import { FarmCard } from '../components/dashboard/FarmCard';
import { AddFarmModal } from '../components/dashboard/AddFarmModal';

const farms = [
  {
    name: 'Asha Farm',
    village: 'Bharuch',
    state: 'Gujarat',
    area: '24 acres',
    status: 'Healthy',
    credits: '184 credits',
    score: '92/100',
    updated: 'Updated 2h ago',
  },
  {
    name: 'Shivam Fields',
    village: 'Sangli',
    state: 'Maharashtra',
    area: '18 acres',
    status: 'Improving',
    credits: '132 credits',
    score: '88/100',
    updated: 'Updated 1d ago',
  },
  {
    name: 'Nirmal Orchards',
    village: 'Tirunelveli',
    state: 'Tamil Nadu',
    area: '31 acres',
    status: 'Monitoring',
    credits: '214 credits',
    score: '90/100',
    updated: 'Updated 4h ago',
  },
];

const sectionTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Welcome back, Ramesh', subtitle: 'Track farm health, carbon promises, and growth opportunities in one place.' },
  farms: { title: 'My Farms', subtitle: 'A premium view of every operating field and its evolving carbon potential.' },
  timeline: { title: 'Farm Timeline', subtitle: 'Review field updates, verification events, and milestones.' },
  carbon: { title: 'Carbon Credits', subtitle: 'Monitor credit generation and compliance-ready reporting.' },
  reports: { title: 'Sustainability Reports', subtitle: 'Share-ready farm intelligence with investors and partners.' },
  advisor: { title: 'AI Advisor', subtitle: 'Get actionable recommendations for soil, water, and revenue.' },
  marketplace: { title: 'Marketplace', subtitle: 'Discover premium carbon and agriculture opportunities.' },
  documents: { title: 'Documents', subtitle: 'Manage land records, certifications, and verification files.' },
  notifications: { title: 'Notifications', subtitle: 'Stay ahead of key actions and market shifts.' },
  settings: { title: 'Settings', subtitle: 'Tune your workspace and farmer preferences.' },
};

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showAddFarm, setShowAddFarm] = useState(false);

  const header = useMemo(() => sectionTitles[activeSection] ?? sectionTitles.dashboard, [activeSection]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_30%),linear-gradient(135deg,#020617,#0f172a_55%,#020617)] px-3 py-3 text-slate-100 sm:px-4 lg:px-5">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row">
        <div className="lg:w-72">
          <Sidebar activeSection={activeSection} onSelect={setActiveSection} onAddFarm={() => setShowAddFarm(true)} />
        </div>

        <div className="flex-1 space-y-4">
          <Topbar title={header.title} subtitle={header.subtitle} />

          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {activeSection === 'dashboard' ? (
              <DashboardHome />
            ) : activeSection === 'farms' ? (
              <div className="space-y-4">
                <div className="grid gap-4 xl:grid-cols-3">
                  {farms.map((farm) => (
                    <FarmCard key={farm.name} {...farm} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(2,6,23,0.96))] p-6 shadow-[0_20px_70px_rgba(2,6,23,0.16)] backdrop-blur-xl">
                <p className="text-sm font-medium text-emerald-300">{header.title}</p>
                <p className="mt-2 text-sm text-slate-400">This panel is ready for the next product module and can be expanded with deeper workflows.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <AddFarmModal open={showAddFarm} onClose={() => setShowAddFarm(false)} />
    </div>
  );
};

export default Dashboard;
