import { motion } from 'framer-motion';
import { MapPin, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrentFarm } from '../../contexts/CurrentFarmContext';

type FarmCardProps = {
  id: string;
  name: string;
  village: string;
  state: string;
  area: string;
  status: string;
  credits: string;
  score: string;
  updated: string;
  location?: string;
  currentCrop?: string;
  verificationStatus?: string;
  lastUpdated?: string;
};

export function FarmCard({ id, name, village, state, area, status, credits, score, updated, location, currentCrop, verificationStatus, lastUpdated }: FarmCardProps) {
  const navigate = useNavigate();
  const { setCurrentFarmId } = useCurrentFarm();

  const openCarbon = () => {
    setCurrentFarmId(id);
    navigate(`/dashboard/farms/${id}/carbon`);
  };
  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(2,6,23,0.95))] p-5 shadow-[0_20px_60px_rgba(2,6,23,0.18)] backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-white">{name}</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
            <MapPin className="size-4 text-emerald-300" />
            <span>{location ?? `${village}, ${state}`}</span>
          </div>
        </div>
        <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-200">
          {verificationStatus ?? status}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1rem] border border-white/10 bg-white/5 p-3">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Farm Area</p>
          <p className="mt-1 text-sm font-semibold text-white">{area}</p>
        </div>
        <div className="rounded-[1rem] border border-white/10 bg-white/5 p-3">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Current Crop</p>
          <p className="mt-1 text-sm font-semibold text-white">{currentCrop ?? 'Pending'}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1rem] border border-white/10 bg-slate-950/60 p-3">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Sustainability Score</p>
          <p className="mt-1 text-sm font-semibold text-white">{score}</p>
        </div>
        <div className="rounded-[1rem] border border-white/10 bg-slate-950/60 p-3">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Carbon Credits</p>
          <p className="mt-1 text-sm font-semibold text-white">{credits}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-[1rem] border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-400">
        <span>Verification: {verificationStatus ?? 'In review'}</span>
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-emerald-300" />
          {lastUpdated ?? updated}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={() => {
          setCurrentFarmId(id);
          navigate(`/dashboard/farms/${id}`);
        }} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
          Open Farm
        </button>
        <button type="button" onClick={openCarbon} className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200 transition hover:bg-emerald-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
          Analyze
        </button>
        <button type="button" onClick={() => {
          setCurrentFarmId(id);
          navigate(`/dashboard/farms/${id}/timeline`);
        }} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
          View Timeline
        </button>
      </div>
    </motion.article>
  );
}
