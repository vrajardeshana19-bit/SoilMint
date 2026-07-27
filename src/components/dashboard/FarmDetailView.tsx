import { motion } from 'framer-motion';
import { ArrowLeft, Files, Leaf, MapPin, ShieldCheck, Sparkles, TimerReset } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFarms } from '../../contexts/FarmsContext';

const tabs = ['Overview', 'Timeline', 'Documents'];

export function FarmDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFarmById } = useFarms();
  const farm = getFarmById(id ?? '');

  if (!farm) {
    return (
      <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(2,6,23,0.96))] p-8 text-center shadow-[0_20px_70px_rgba(2,6,23,0.16)] backdrop-blur-xl">
        <p className="text-lg font-semibold text-white">Farm not found</p>
        <p className="mt-2 text-sm text-slate-400">The selected farm is not available right now.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button type="button" onClick={() => navigate('/dashboard/farms')} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10">
        <ArrowLeft className="size-4" />
        Back to My Farms
      </button>

      <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(2,6,23,0.96))] p-5 shadow-[0_25px_80px_rgba(2,6,23,0.16)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-300">Farm Dashboard</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">{farm.name}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-400">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <MapPin className="size-4 text-emerald-300" />
                {farm.location}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <Leaf className="size-4 text-emerald-300" />
                {farm.area}
              </span>
            </div>
          </div>
          <div className="rounded-[1.1rem] border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4" />
              Verification Status: {farm.status}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button key={tab} type="button" className={`rounded-full border px-3 py-2 text-sm ${tab === 'Overview' ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200' : 'border-white/10 bg-white/5 text-slate-300'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(2,6,23,0.96))] p-5 shadow-[0_20px_70px_rgba(2,6,23,0.16)] backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-300">Overview</p>
              <h3 className="mt-1 text-xl font-semibold text-white">Premium insights for {farm.name}</h3>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-2 text-emerald-300">
              <Sparkles className="size-4" />
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ['Owner Name', farm.ownerName],
              ['Survey Number', farm.surveyNumber],
              ['Village', farm.village],
              ['District', farm.district],
              ['State', farm.state],
              ['Land Classification', farm.landClassification],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.1rem] border border-white/10 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
                <p className="mt-1 text-sm font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(2,6,23,0.96))] p-5 shadow-[0_20px_70px_rgba(2,6,23,0.16)] backdrop-blur-xl">
          <p className="text-sm font-medium text-emerald-300">Timeline</p>
          <div className="mt-4 space-y-3">
            {farm.timeline.map((event) => (
              <div key={event.id} className="rounded-[1.1rem] border border-white/10 bg-white/5 p-3">
                <div className="flex items-center gap-2 text-sm text-emerald-200">
                  <TimerReset className="size-4" />
                  {event.title}
                </div>
                <p className="mt-2 text-sm text-slate-400">{event.detail}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">{event.time}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(2,6,23,0.96))] p-5 shadow-[0_20px_70px_rgba(2,6,23,0.16)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-300">Documents</p>
            <h3 className="mt-1 text-xl font-semibold text-white">Verification package</h3>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-300">
            <Files className="size-4" />
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {farm.documents.map((document) => (
            <div key={document} className="rounded-[1.1rem] border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
              {document}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
