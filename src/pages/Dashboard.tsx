import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Topbar } from '../components/dashboard/Topbar';
import { DashboardHome } from '../components/dashboard/DashboardHome';
import { FarmCard } from '../components/dashboard/FarmCard';
import { AddFarmModal } from '../components/dashboard/AddFarmModal';
import { FarmDetailView } from '../components/dashboard/FarmDetailView';
import { useFarms } from '../contexts/FarmsContext';

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
  const { farms } = useFarms();
  const [activeRoute, setActiveRoute] = useState<'dashboard' | 'farms' | 'detail'>('dashboard');
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('/dashboard/farms/')) {
      setActiveRoute('detail');
      setActiveSection('farms');
    } else if (location.pathname === '/dashboard/farms') {
      setActiveRoute('farms');
      setActiveSection('farms');
    } else {
      setActiveRoute('dashboard');
    }
  }, [location.pathname]);

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
            {activeSection === 'dashboard' && activeRoute === 'dashboard' ? (
              <DashboardHome onAddFarm={() => setShowAddFarm(true)} />
            ) : activeSection === 'farms' && activeRoute === 'farms' ? (
              <div className="space-y-4">
                {farms.length === 0 ? (
                  <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(2,6,23,0.96))] p-8 text-center shadow-[0_20px_70px_rgba(2,6,23,0.16)] backdrop-blur-xl">
                    <p className="text-lg font-semibold text-white">No farms yet</p>
                    <p className="mt-2 text-sm text-slate-400">Create your first digital farm profile to unlock carbon intelligence.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 xl:grid-cols-3">
                    {farms.map((farm) => (
                      <FarmCard key={farm.id} {...farm} />
                    ))}
                  </div>
                )}
              </div>
            ) : activeRoute === 'detail' ? (
              <FarmDetailView />
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
