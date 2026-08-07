import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ChevronLeft, ChevronRight, FileText, LoaderCircle, MapPinned, Sparkles, UploadCloud, X } from 'lucide-react';
import { useEffect, useMemo, useState, type DragEvent } from 'react';
import toast from 'react-hot-toast';
import { useCurrentFarm } from '../../contexts/CurrentFarmContext';
import { useFarms } from '../../contexts/FarmsContext';

type AddFarmWizardProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

type Step = 1 | 2 | 3 | 4 | 5;

type FarmDraftData = {
  name: string;
  location: string;
  area: string;
  ownerName: string;
  surveyNumber: string;
  village: string;
  taluk: string;
  district: string;
  state: string;
  landClassification: string;
  confidence: string;
};

type WizardProgress = {
  step: Step;
  fileName: string | null;
  data: FarmDraftData;
};

const initialData: FarmDraftData = {
  name: 'Green Valley Farm',
  location: 'Bharuch, Gujarat',
  area: '24 acres',
  ownerName: 'Ramesh Patel',
  surveyNumber: 'SR-104/12',
  village: 'Bharuch',
  taluk: 'Bharuch',
  district: 'Bharuch',
  state: 'Gujarat',
  landClassification: 'Dryland',
  confidence: '96%',
};

const processingSteps = [
  'Uploading Document',
  'Image Enhancement',
  'OCR',
  'AI Understanding',
  'Extracting Farm Information',
  'Creating Digital Farm Profile',
];

const stepTitles: Record<Step, string> = {
  1: 'Choose Farm Creation Method',
  2: 'Upload Land Record',
  3: 'AI Processing',
  4: 'Review Farm Information',
  5: 'Success',
};

const stepDescriptions: Record<Step, string> = {
  1: 'Select the best way to create your digital farm profile.',
  2: 'Upload your government land record to kick off AI extraction.',
  3: 'SoilMint is turning the document into a verified farm profile.',
  4: 'Validate the extracted fields before registering the farm.',
  5: 'Your farm is live and ready for carbon intelligence.',
};

export function AddFarmWizard({ open, onClose, onCreated }: AddFarmWizardProps) {
  const { addFarm } = useFarms();
  const { setCurrentFarmId } = useCurrentFarm();
  const [step, setStep] = useState<Step>(1);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [processingIndex, setProcessingIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [draft, setDraft] = useState<FarmDraftData>(initialData);

  useEffect(() => {
    if (!open) {
      return;
    }

    const storageKey = 'soilmint-add-farm-progress';
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as WizardProgress;
        setStep(parsed.step ?? 1);
        setFile(null);
        setDraft(parsed.data ?? initialData);
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const storageKey = 'soilmint-add-farm-progress';
    window.localStorage.setItem(storageKey, JSON.stringify({ step, fileName: file?.name ?? null, data: draft }));
  }, [draft, file, open, step]);

  useEffect(() => {
    if (!isProcessing) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setProcessingIndex((current) => {
        const next = current + 1;
        if (next >= processingSteps.length) {
          window.clearInterval(timer);
          setIsProcessing(false);
          setStep(4);
          return current;
        }
        return next;
      });
    }, 900);

    return () => window.clearInterval(timer);
  }, [isProcessing]);

  const progressPercent = useMemo(() => (step / 5) * 100, [step]);

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    toast.success(`${selectedFile.name} ready for AI processing.`);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragActive(false);
    const dropped = event.dataTransfer.files?.[0] ?? null;
    handleFileChange(dropped);
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!file) {
        toast.error('Please upload a land record before continuing.');
        return;
      }
      setIsProcessing(true);
      setProcessingIndex(0);
      setStep(3);
      return;
    }

    if (step === 4) {
      const createdFarm = addFarm({
        name: draft.name,
        location: draft.location,
        area: draft.area,
        ownerName: draft.ownerName,
        surveyNumber: draft.surveyNumber,
        village: draft.village,
        taluk: draft.taluk,
        district: draft.district,
        state: draft.state,
        landClassification: draft.landClassification,
        confidence: draft.confidence,
        documents: [file?.name ?? 'Government Land Record.pdf'],
      });
      setCurrentFarmId(createdFarm.id);
      toast.success(`Farm ${createdFarm.name} created successfully.`);
      onCreated?.();
      setStep(5);
      return;
    }

    if (step === 5) {
      handleClose();
    }
  };

  const handleBack = () => {
    if (step === 2 || step === 3 || step === 4 || step === 5) {
      if (step === 3 && isProcessing) {
        setIsProcessing(false);
      }
      setStep((current) => (current > 1 ? (current - 1) as Step : 1));
    }
  };

  const handleClose = () => {
    setStep(1);
    setFile(null);
    setProcessingIndex(0);
    setIsProcessing(false);
    setDraft(initialData);
    window.localStorage.removeItem('soilmint-add-farm-progress');
    onClose();
  };

  const handleFieldChange = (field: keyof FarmDraftData, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-5">
            <div className="grid gap-3 md:grid-cols-2">
              <button type="button" className="rounded-[1.25rem] border border-emerald-400/25 bg-emerald-500/10 p-4 text-left transition hover:bg-emerald-500/15">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-2 text-emerald-300">
                    <FileText className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Upload Government Land Record</p>
                    <p className="text-sm text-emerald-200">Recommended</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-400">Automatically create your farm profile using AI.</p>
              </button>
              <button type="button" disabled className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 text-left opacity-60">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-2 text-slate-400">
                    <MapPinned className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Draw Farm Boundary</p>
                    <p className="text-sm text-slate-400">Coming Soon</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-400">Sketch your farm shape manually with a dedicated editor.</p>
              </button>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-2 text-emerald-300">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <p className="font-semibold text-white">Manual entry is also available</p>
                  <p className="mt-1">You can always refine the extracted details in the review screen before creating the farm.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <label
            onDragOver={(event) => { event.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`group flex cursor-pointer flex-col items-center justify-center rounded-[1.6rem] border border-dashed px-6 py-12 text-center transition ${dragActive ? 'border-emerald-400 bg-emerald-500/10' : 'border-white/15 bg-slate-950/60 hover:border-emerald-400/40'}`}
          >
            <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="sr-only" onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)} />
            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-emerald-300">
              <UploadCloud className="size-8" />
            </div>
            <p className="mt-5 text-lg font-semibold text-white">Drag and drop your land record</p>
            <p className="mt-2 max-w-md text-sm text-slate-400">Supported formats: PDF, PNG, JPG, JPEG</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Drag & Drop</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Browse Files</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">File Preview</span>
            </div>
            {file ? (
              <div className="mt-6 w-full max-w-md rounded-[1.1rem] border border-white/10 bg-white/5 p-4 text-left">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{file.name}</p>
                    <p className="text-sm text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button type="button" onClick={(event) => { event.preventDefault(); setFile(null); }} className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-sm text-slate-300">Remove</button>
                </div>
              </div>
            ) : null}
          </label>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-[1.2rem] border border-white/10 bg-slate-950/60 p-4">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-2 text-emerald-300">
                <LoaderCircle className="size-5 animate-spin" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Processing your land record</p>
                <p className="text-sm text-slate-400">This takes a moment while we structure your digital farm profile.</p>
              </div>
            </div>
            <div className="space-y-3">
              {processingSteps.map((item, index) => {
                const active = index <= processingIndex;
                return (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.06 }}
                    className={`flex items-center gap-3 rounded-[1rem] border px-4 py-3 ${active ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200' : 'border-white/10 bg-white/5 text-slate-400'}`}
                  >
                    {active ? <CheckCircle2 className="size-4" /> : <span className="size-2 rounded-full bg-slate-500" />}
                    <span className="text-sm font-medium">{item}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {[
                ['name', 'Farm Name'],
                ['ownerName', 'Owner Name'],
                ['surveyNumber', 'Survey Number'],
                ['village', 'Village'],
                ['taluk', 'Taluk'],
                ['district', 'District'],
                ['state', 'State'],
                ['area', 'Farm Area'],
                ['landClassification', 'Land Classification'],
                ['confidence', 'AI Confidence Score'],
              ].map(([key, label]) => (
                <label key={key} className="rounded-[1.1rem] border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">
                  <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">{label}</span>
                  <input
                    value={draft[key as keyof FarmDraftData]}
                    onChange={(event) => handleFieldChange(key as keyof FarmDraftData, event.target.value)}
                    className="w-full bg-transparent text-sm text-white outline-none"
                  />
                </label>
              ))}
            </div>
            <div className="rounded-[1.2rem] border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-400">
              <div className="flex items-center justify-between">
                <span>Extracted from uploaded land record</span>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-emerald-200">{draft.confidence} confidence</span>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col items-center rounded-[1.6rem] border border-emerald-400/20 bg-emerald-500/10 px-6 py-10 text-center">
            <div className="rounded-full border border-emerald-400/20 bg-emerald-500/15 p-4 text-emerald-300">
              <CheckCircle2 className="size-10" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold text-white">Your Digital Farm has been created successfully.</h3>
            <p className="mt-3 max-w-lg text-sm text-slate-300">{draft.name} is now available in My Farms with verification pending and carbon intelligence ready.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1rem] border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Farm Name</p>
                <p className="mt-1 font-semibold text-white">{draft.name}</p>
              </div>
              <div className="rounded-[1rem] border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Location</p>
                <p className="mt-1 font-semibold text-white">{draft.location}</p>
              </div>
              <div className="rounded-[1rem] border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Area</p>
                <p className="mt-1 font-semibold text-white">{draft.area}</p>
              </div>
            </div>
            <div className="mt-4 rounded-full border border-emerald-400/20 bg-emerald-500/15 px-3 py-1 text-sm text-emerald-200">Verification Status: Pending Review</div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!open) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 px-3 py-4 backdrop-blur-xl sm:px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(2,6,23,0.97))] shadow-[0_40px_140px_rgba(2,6,23,0.38)]"
        >
          <div className="border-b border-white/10 px-5 py-4 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-emerald-300">Step {step} of 5</p>
                <h2 className="mt-1 text-xl font-semibold text-white">{stepTitles[step]}</h2>
                <p className="mt-1 text-sm text-slate-400">{stepDescriptions[step]}</p>
              </div>
              <button type="button" onClick={handleClose} className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-slate-200">
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, index) => {
                const active = index + 1 <= step;
                return (
                  <div key={index} className={`h-1.5 flex-1 rounded-full ${active ? 'bg-emerald-400' : 'bg-white/10'}`} />
                );
              })}
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-emerald-400 transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            {renderStepContent()}
          </div>

          <div className="flex items-center justify-between border-t border-white/10 px-5 py-4 sm:px-6">
            <button type="button" onClick={handleBack} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10">
              <ChevronLeft className="size-4" />
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={step === 2 && !file}
              className="inline-flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/15 px-3 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-slate-500"
            >
              {step === 5 ? 'Close' : step === 4 ? 'Confirm & Create Farm' : 'Continue'}
              <ChevronRight className="size-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
