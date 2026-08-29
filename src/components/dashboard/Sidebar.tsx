import { motion } from 'framer-motion';
import {
  BarChart3,
  Bell,
  Bot,
  Compass,
  FileText,
  LayoutDashboard,
  Leaf,
  LogOut,
  Map,
  Settings,
  ShieldCheck,
  Sprout,
  Store,
  Trees,
  UserCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrentFarm } from '../../contexts/CurrentFarmContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'farms', label: 'My Farms', icon: Sprout },
  { id: 'timeline', label: 'Farm Timeline', icon: Compass },
  { id: 'carbon', label: 'Carbon Credits', icon: Leaf },
  { id: 'reports', label: 'Sustainability Reports', icon: BarChart3 },
  { id: 'advisor', label: 'AI Advisor', icon: Bot },
  { id: 'marketplace', label: 'Marketplace', icon: Store },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

type SidebarProps = {
  activeSection: string;
  onSelect: (section: string) => void;
  onAddFarm: () => void;
};

export function Sidebar({ activeSection, onSelect, onAddFarm }: SidebarProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { currentFarmId, setCurrentFarmId } = useCurrentFarm();

  const handleSelect = (itemId: string) => {
    onSelect(itemId);
    if (itemId === 'dashboard') {
      navigate('/dashboard');
    } else if (itemId === 'farms') {
      navigate('/dashboard/farms');
    } else if (currentFarmId) {
      navigate(`/dashboard/farms/${currentFarmId}/${itemId}`);
    } else {
      navigate('/dashboard/farms');
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentFarmId(null);
    navigate('/login', { replace: true });
  };

  return (
    <aside className="flex h-full w-full flex-col justify-between rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-4 shadow-[0_20px_70px_rgba(2,6,23,0.28)] backdrop-blur-xl">
      <div>
        <div className="flex items-center gap-3 rounded-[1.15rem] border border-emerald-400/15 bg-emerald-500/10 p-3">
          <div className="rounded-2xl bg-emerald-500/15 p-2 text-emerald-300">
            <Trees className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">SoilMint</p>
            <p className="text-xs text-slate-400">Farm Intelligence</p>
          </div>
        </div>

        <div className="mt-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.id === activeSection;
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 2, scale: 1.01 }}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition ${active ? 'bg-emerald-500/15 text-emerald-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onAddFarm}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-3 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/15"
        >
          <Map className="size-4" />
          Add Farm
        </button>
      </div>

      <div className="mt-6 rounded-[1.25rem] border border-white/10 bg-white/5 p-3">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/10 p-2">
            <UserCircle2 className="size-5 text-slate-200" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">Ramesh Patel</p>
            <p className="truncate text-xs text-slate-400">Rajkot, Gujarat</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-slate-400">
          <ShieldCheck className="size-3.5 text-emerald-300" />
          Verified Farmer Profile
        </div>
        <button type="button" onClick={handleLogout} className="mt-3 flex items-center gap-2 text-sm text-slate-400 transition hover:text-slate-200">
          <LogOut className="size-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
