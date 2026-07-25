import { AnimatePresence, motion } from 'framer-motion';
import { Camera, FileText, MapPinned, Sparkles, X } from 'lucide-react';

type AddFarmModalProps = {
  open: boolean;
  onClose: () => void;
};

const entryModes = [
  { title: 'Use GPS', description: 'Detect land with live location', icon: MapPinned },
  { title: 'Upload Record', description: 'Add land documentation', icon: FileText },
  { title: 'AI Assisted', description: 'Create from satellite and soil hints', icon: Sparkles },
];

export function AddFarmModal({ open, onClose }: AddFarmModalProps) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          className="w-full max-w-2xl rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(2,6,23,0.97))] p-6 shadow-[0_35px_120px_rgba(2,6,23,0.34)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-emerald-300">New farm profile</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">Add a farm in seconds</h2>
              <p className="mt-2 text-sm text-slate-400">Choose the fastest way to onboard your land and start capturing carbon insights.</p>
            </div>
            <button type="button" onClick={onClose} className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-slate-200">
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {entryModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.title}
                  type="button"
                  className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10"
                >
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-2 text-emerald-300">
                    <Icon className="size-4" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-white">{mode.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{mode.description}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-[1.2rem] border border-white/10 bg-slate-950/60 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-2 text-emerald-300">
                <Camera className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Capture farmland with a photo</p>
                <p className="text-sm text-slate-400">Upload a field image and let SoilMint suggest boundaries and crop health.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
