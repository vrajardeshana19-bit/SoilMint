import { Bell, Search, SunMoon, UserCircle2 } from 'lucide-react';

type TopbarProps = {
  title: string;
  subtitle?: string;
  onSearch?: () => void;
  farms: Array<{ id: string; name: string }>;
  currentFarmId: string | null;
  onFarmSelect: (farmId: string) => void;
};

export function Topbar({ title, subtitle, onSearch, farms, currentFarmId, onFarmSelect }: TopbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-slate-950/70 px-4 py-4 shadow-[0_20px_70px_rgba(2,6,23,0.2)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div>
        <p className="text-sm font-medium text-emerald-300">Farmer Workspace</p>
        <h1 className="text-xl font-semibold text-white">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onSearch}
          className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-400 transition hover:bg-white/10 hover:text-slate-200"
        >
          <Search className="size-4" />
          Search
        </button>
        <button
          type="button"
          aria-label="View notifications"
          className="rounded-2xl border border-white/10 bg-white/5 p-2.5 text-slate-400 transition hover:bg-white/10 hover:text-slate-200"
        >
          <Bell className="size-4" />
        </button>
        <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
          <div className="rounded-full bg-emerald-500/15 p-1.5 text-emerald-300">
            <UserCircle2 className="size-4" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-white">Current Farm</p>
            <select
              value={currentFarmId ?? ''}
              onChange={(event) => onFarmSelect(event.target.value)}
              className="bg-transparent text-xs text-slate-400 outline-none"
            >
              {farms.map((farm) => (
                <option key={farm.id} value={farm.id} className="bg-slate-900 text-slate-200">
                  {farm.name}
                </option>
              ))}
            </select>
          </div>
        </label>
        <button
          type="button"
          aria-label="Toggle theme"
          className="rounded-2xl border border-white/10 bg-white/5 p-2.5 text-slate-400 transition hover:bg-white/10 hover:text-slate-200"
        >
          <SunMoon className="size-4" />
        </button>
      </div>
    </div>
  );
}
