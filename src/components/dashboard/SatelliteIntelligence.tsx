import { Cloud, AlertCircle, CheckCircle2, Loader } from 'lucide-react';
import type { SatelliteObservation } from '../../services/sentinel2Service';

type SatelliteIntelligenceProps = {
  observation: SatelliteObservation | null;
  isLoading?: boolean;
  onRefresh?: () => void;
};

export function SatelliteIntelligence({ observation, isLoading = false, onRefresh }: SatelliteIntelligenceProps) {
  if (isLoading) {
    return (
      <div className="rounded-[1.5rem] border border-emerald-400/20 bg-[linear-gradient(135deg,rgba(5,150,105,0.1),rgba(16,185,129,0.05))] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Loader className="size-5 animate-spin text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">SATELLITE INTELLIGENCE</h3>
            </div>
            <p className="text-sm text-slate-400">Searching for satellite data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!observation) {
    return (
      <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold text-white">SATELLITE INTELLIGENCE</h3>
            <p className="text-sm text-slate-400">Satellite connection not configured</p>
          </div>
          <AlertCircle className="size-8 text-slate-500" />
        </div>
      </div>
    );
  }

  const renderStatus = () => {
    switch (observation.status) {
      case 'searching':
        return (
          <div className="flex items-center gap-2">
            <Loader className="size-4 animate-spin text-emerald-400" />
            <span className="text-sm text-emerald-200">Searching...</span>
          </div>
        );
      case 'found':
        return (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-400" />
            <span className="text-sm text-emerald-200">Satellite data found</span>
          </div>
        );
      case 'no_data':
        return (
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 text-yellow-400" />
            <span className="text-sm text-yellow-200">No suitable imagery found</span>
          </div>
        );
      case 'cloudy':
        return (
          <div className="flex items-center gap-2">
            <Cloud className="size-4 text-amber-400" />
            <span className="text-sm text-amber-200">Excessive cloud coverage</span>
          </div>
        );
      case 'ready':
        return (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-400" />
            <span className="text-sm text-emerald-200">Ready for analysis</span>
          </div>
        );
      case 'failed':
      default:
        return (
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 text-red-400" />
            <span className="text-sm text-red-200">Data retrieval failed</span>
          </div>
        );
    }
  };

  const isBeneficial = observation.status === 'found' || observation.status === 'ready';
  const borderColor = isBeneficial ? 'border-emerald-400/20' : 'border-white/10';
  const bgColor = isBeneficial ? 'bg-[linear-gradient(135deg,rgba(5,150,105,0.1),rgba(16,185,129,0.05))]' : 'bg-slate-950/60';

  return (
    <div className={`rounded-[1.5rem] border ${borderColor} ${bgColor} p-6`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`rounded-2xl border ${isBeneficial ? 'border-emerald-400/20 bg-emerald-500/10' : 'border-white/10 bg-white/5'} p-2`}>
              <Cloud className={`size-5 ${isBeneficial ? 'text-emerald-300' : 'text-slate-400'}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">SATELLITE INTELLIGENCE</h3>
              <p className="text-xs text-slate-400">{observation.metadata.dataSource}</p>
            </div>
          </div>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:bg-white/10"
            >
              Refresh
            </button>
          )}
        </div>

        {/* Status */}
        <div className="rounded-[1rem] border border-white/10 bg-white/5 px-3 py-2">{renderStatus()}</div>

        {/* Metadata */}
        {observation.status !== 'no_data' && observation.status !== 'failed' && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1rem] border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Satellite Mission</p>
              <p className="mt-1 text-sm font-semibold text-white">{observation.metadata.satelliteMission}</p>
            </div>

            <div className="rounded-[1rem] border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Acquisition Date</p>
              <p className="mt-1 text-sm font-semibold text-white">{observation.metadata.acquisitionDate}</p>
            </div>

            <div className="rounded-[1rem] border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Cloud Coverage</p>
              <p className="mt-1 text-sm font-semibold text-white">{observation.metadata.cloudCoverage}%</p>
            </div>

            <div className="rounded-[1rem] border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Processing Level</p>
              <p className="mt-1 text-sm font-semibold text-white">{observation.metadata.processingLevel}</p>
            </div>
          </div>
        )}

        {/* Message */}
        <div className="rounded-[1rem] border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">{observation.message}</div>

        {/* Info box */}
        <div className="rounded-[1rem] border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-400">
          <p>
            <span className="font-semibold text-white">Note:</span> Satellite data is one input into the future Carbon Intelligence Engine. Estimates will combine land records, farm boundaries, crop history, farming practices, and more.
          </p>
        </div>
      </div>
    </div>
  );
}
