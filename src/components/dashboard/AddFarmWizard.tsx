import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ChevronLeft, ChevronRight, AlertCircle, FileText, LoaderCircle, MapPinned, Sparkles, UploadCloud, X } from 'lucide-react';
import { useEffect, useMemo, useState, type DragEvent } from 'react';
import toast from 'react-hot-toast';
import { useCurrentFarm } from '../../contexts/CurrentFarmContext';
import { useFarms } from '../../contexts/FarmsContext';
import { analyzeFarmRecord, type FarmRecord } from '../../services/farmRecordAnalyzer';
import { createFarmBoundary, getBestSatelliteDataForFarm, type FarmBoundary, type GeoJSONPolygon } from '../../services/sentinel2Service';
import { geocodeFarmLocation, type GeocodedLocation } from '../../services/geocodingService';
import { FarmBoundaryMap } from './FarmBoundaryMap';
import { SatelliteIntelligence } from './SatelliteIntelligence';
import type { SatelliteObservation } from '../../services/sentinel2Service';

type AddFarmWizardProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type WizardState = {
  step: Step;
  file: File | null;
  farmRecord: FarmRecord | null;
  boundary: FarmBoundary | null;
  satelliteObservation: SatelliteObservation | null;
  location: GeocodedLocation | null;
  locationConfirmed: boolean;
  processingIndex: number;
  isAnalyzing: boolean;
  isSearchingSatellite: boolean;
  satelliteSearchError: string | null;
  analysisErrors: string[];
  analysisWarnings: string[];
};

const stepTitles: Record<Step, string> = {
  1: 'Choose Farm Creation Method',
  2: 'Upload Land Record',
  3: 'AI Analysis',
  4: 'Review Farm Information',
  5: 'Define Farm Boundary',
  6: 'Satellite Data Discovery',
  7: 'Success',
};

const stepDescriptions: Record<Step, string> = {
  1: 'Select the best way to create your digital farm profile.',
  2: 'Upload your government land record to start AI extraction.',
  3: 'SoilMint is analyzing the document and extracting farm details.',
  4: 'Review and correct the extracted information before proceeding.',
  5: 'Draw or confirm the farm boundary on the map.',
  6: 'Searching for available satellite imagery for your farm.',
  7: 'Your farm is live with boundary and satellite data integrated.',
};

const analysisProcessingSteps = [
  'Validating document',
  'Extracting text',
  'Analyzing content',
  'Identifying land record',
  'Parsing farm details',
  'Generating profile',
];

function areaInSquareMeters(value: string | null, unit: string | null) {
  const amount = value ? Number(value.replace(',', '.').match(/[\d.]+/)?.[0]) : NaN;
  if (!Number.isFinite(amount)) return null;
  const normalized = (unit || '').toLowerCase();
  if (normalized.includes('hectare') || normalized === 'ha') return amount * 10000;
  if (normalized.includes('acre')) return amount * 4046.8564224;
  if (normalized.includes('square metre') || normalized.includes('square meter') || normalized === 'm2') return amount;
  return null;
}

export function AddFarmWizard({ open, onClose, onCreated }: AddFarmWizardProps) {
  const { addFarm } = useFarms();
  const { setCurrentFarmId } = useCurrentFarm();

  const [state, setState] = useState<WizardState>({
    step: 1,
    file: null,
    farmRecord: null,
    boundary: null,
    satelliteObservation: null,
    location: null,
    locationConfirmed: false,
    processingIndex: 0,
    isAnalyzing: false,
    isSearchingSatellite: false,
    satelliteSearchError: null,
    analysisErrors: [],
    analysisWarnings: [],
  });

  const [dragActive, setDragActive] = useState(false);
  const [createdFarmId, setCreatedFarmId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FarmRecord, string>>>({});

  // Load progress from storage
  useEffect(() => {
    if (!open) return;

    const storageKey = 'soilmint-add-farm-progress-v2';
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setState((current) => ({
          ...current,
          step: parsed.step ?? 1,
          farmRecord: parsed.farmRecord ?? null,
          boundary: parsed.boundary ?? null,
          satelliteObservation: parsed.satelliteObservation ?? null,
          location: parsed.location ?? null,
          locationConfirmed: parsed.locationConfirmed ?? false,
        }));
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }
  }, [open]);

  // Save progress to storage
  useEffect(() => {
    if (!open) return;

    const storageKey = 'soilmint-add-farm-progress-v2';
    const dataToStore = {
      step: state.step,
      farmRecord: state.farmRecord,
      boundary: state.boundary,
      satelliteObservation: state.satelliteObservation,
      location: state.location,
      locationConfirmed: state.locationConfirmed,
    };
    window.localStorage.setItem(storageKey, JSON.stringify(dataToStore));
  }, [state, open]);

  // Handle document analysis animation
  useEffect(() => {
    if (!state.isAnalyzing) return;

    const timer = window.setInterval(() => {
      setState((current) => {
        const next = current.processingIndex + 1;
        if (next >= analysisProcessingSteps.length) {
          window.clearInterval(timer);
          return { ...current, isAnalyzing: false };
        }
        return { ...current, processingIndex: next };
      });
    }, 600);

    return () => window.clearInterval(timer);
  }, [state.isAnalyzing]);

  // Handle satellite search animation
  useEffect(() => {
    if (!state.isSearchingSatellite) return;

    const timer = window.setTimeout(async () => {
      try {
        if (state.boundary) {
          const observation = await getBestSatelliteDataForFarm(
            createdFarmId || 'temp-farm',
            state.boundary,
            { maxCloudCoverage: 30 },
          );
          setState((current) => ({
            ...current,
            satelliteObservation: observation,
            isSearchingSatellite: false,
            satelliteSearchError: null,
          }));
        }
      } catch {
        setState((current) => ({
          ...current,
          isSearchingSatellite: false,
          satelliteSearchError: 'Satellite data could not be retrieved right now. Please try again.',
        }));
      }
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [state.isSearchingSatellite, state.boundary, createdFarmId]);

  const progressPercent = useMemo(() => (state.step / 7) * 100, [state.step]);

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;

    setState((current) => ({ ...current, file: selectedFile }));
    toast.success(`${selectedFile.name} ready for AI processing.`);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragActive(false);
    const dropped = event.dataTransfer.files?.[0] ?? null;
    handleFileChange(dropped);
  };

  const handleAnalyzeDocument = async () => {
    if (!state.file) {
      toast.error('Please upload a document first.');
      return;
    }

    setState((current) => ({
      ...current,
      isAnalyzing: true,
      processingIndex: 0,
      analysisErrors: [],
      analysisWarnings: [],
    }));

    try {
      const result = await analyzeFarmRecord(state.file);

      setState((current) => ({
        ...current,
        isAnalyzing: false,
        analysisErrors: result.errors,
        analysisWarnings: result.warnings,
      }));

      if (result.success && result.record) {
        const geocoding = await geocodeFarmLocation(result.record);
        setState((current) => ({
          ...current,
          farmRecord: result.record,
          location: geocoding.status === 'resolved' ? geocoding.location : null,
          locationConfirmed: false,
          step: 4,
        }));
        if (geocoding.status !== 'resolved') toast.error(geocoding.message);
        toast.success('Document analyzed successfully!');
      } else {
        toast.error(result.errors[0] || 'Document analysis failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      setState((current) => ({
        ...current,
        isAnalyzing: false,
        analysisErrors: [errorMessage],
      }));
      toast.error(errorMessage);
    }
  };

  const handleBoundarySave = (geometry: GeoJSONPolygon) => {
    if (!state.locationConfirmed) {
      toast.error('Confirm the farm location before saving the boundary.');
      return;
    }
    const boundary = createFarmBoundary(geometry, createdFarmId || 'new-farm');
    setState((current) => ({
      ...current,
      boundary,
    }));
  };

  const handleFieldChange = (field: keyof FarmRecord, value: string | null) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setState((current) => ({
      ...current,
      farmRecord: current.farmRecord ? { ...current.farmRecord, [field]: value } : null,
    }));
  };

  const validateFarmRecord = () => {
    const farmRecord = state.farmRecord;
    const errors: Partial<Record<keyof FarmRecord, string>> = {};

    if (!farmRecord?.farmName?.trim()) {
      errors.farmName = 'Enter a farm name to continue.';
    }

    if (!farmRecord?.area?.trim() || !Number.isFinite(Number(farmRecord.area)) || Number(farmRecord.area) <= 0) {
      errors.area = 'Enter a land area greater than 0 to continue.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLocationChange = (location: GeocodedLocation) => {
    setState((current) => ({ ...current, location, locationConfirmed: false, boundary: null }));
  };

  const handleCreateFarm = () => {
    if (!state.farmRecord) {
      toast.error('Farm record is missing');
      return;
    }

    const createdFarm = addFarm({
      name: state.farmRecord.farmName || 'Digital Farm',
      location: state.farmRecord.village && state.farmRecord.state
        ? `${state.farmRecord.village}, ${state.farmRecord.state}`
        : 'Pending location',
      locationDetails: state.location,
      area: state.farmRecord.area ? `${state.farmRecord.area} ${state.farmRecord.areaUnit}` : '0 acres',
      ownerName: state.farmRecord.ownerName || 'Farmer',
      surveyNumber: state.farmRecord.surveyNumber || 'Pending',
      village: state.farmRecord.village || 'Pending',
      taluk: state.farmRecord.taluk || 'Pending',
      district: state.farmRecord.district || 'Pending',
      state: state.farmRecord.state || 'Pending',
      landClassification: state.farmRecord.landClassification || 'Pending',
      confidence: `${state.farmRecord.extractionConfidence}%`,
      documents: [
        {
          id: `doc-${Date.now()}`,
          name: state.file?.name || 'Government Land Record',
          type: 'Government Record',
          uploadedAt: new Date().toISOString().split('T')[0],
          status: 'Analyzed',
          confidence: `${state.farmRecord.extractionConfidence}%`,
        },
      ],
      boundary: state.boundary || undefined,
      governmentRecordedArea: state.farmRecord.area
        ? `${state.farmRecord.area} ${state.farmRecord.areaUnit}`
        : '0 acres',
      governmentRecordedAreaUnit: state.farmRecord.areaUnit || 'unknown',
      boundaryArea: state.boundary?.areaSquareMeters ?? null,
      boundaryAreaUnit: 'square metre',
      boundaryCalculatedArea: state.boundary
        ? `${state.boundary.areaAcres.toFixed(2)} acres`
        : 'Not calculated',
      satelliteObservation: state.satelliteObservation || undefined,
      timeline: [
        {
          id: `event-1-${Date.now()}`,
          title: 'Land Record Uploaded',
          description: `Government land record (${state.file?.name}) uploaded and analyzed.`,
          date: 'Just now',
          status: 'Completed',
          icon: 'file',
        },
        {
          id: `event-2-${Date.now()}`,
          title: 'AI Analysis Completed',
          description: 'Farm profile extracted from government land record with AI analysis.',
          date: 'Just now',
          status: 'Completed',
          icon: 'sparkles',
        },
        ...(state.boundary
          ? [
              {
                id: `event-3-${Date.now()}`,
                title: 'Farm Boundary Confirmed',
                description: `Farm boundary defined as polygon with area ${state.boundary.areaAcres.toFixed(2)} acres.`,
                date: 'Just now',
                status: 'Completed',
                icon: 'map',
              },
            ]
          : []),
        ...(state.satelliteObservation
          ? [
              {
                id: `event-4-${Date.now()}`,
                title: 'Satellite Data Discovered',
                description: `${state.satelliteObservation.metadata.satelliteMission} imagery found (${state.satelliteObservation.metadata.cloudCoverage}% cloud).`,
                date: 'Just now',
                status: 'Completed',
                icon: 'satellite',
              },
            ]
          : []),
      ],
    });

    setCreatedFarmId(createdFarm.id);
    setCurrentFarmId(createdFarm.id);
    toast.success(`Farm ${createdFarm.name} created successfully!`);

    setState((current) => ({
      ...current,
      step: 7,
    }));

    onCreated?.();
  };

  const handleNext = () => {
    switch (state.step) {
      case 1:
        setState((current) => ({ ...current, step: 2 }));
        break;
      case 2:
        if (!state.file) {
          toast.error('Please upload a document');
          return;
        }
        setState((current) => ({ ...current, step: 3 }));
        setTimeout(() => handleAnalyzeDocument(), 100);
        break;
      case 3:
        // Waiting for analysis to complete
        break;
      case 4:
        if (!state.farmRecord) {
          toast.error('Farm record is missing');
          return;
        }
        if (!validateFarmRecord()) return;
        setState((current) => ({ ...current, step: 5 }));
        break;
      case 5:
        if (!state.locationConfirmed || !state.boundary) {
          toast.error('Confirm the location and draw a boundary before continuing.');
          return;
        }
        setState((current) => ({
          ...current,
          boundary: current.boundary ? { ...current.boundary, status: 'confirmed', confirmedAt: new Date().toISOString() } : null,
          step: 6,
          isSearchingSatellite: true,
          satelliteSearchError: null,
        }));
        toast.success('Farm boundary confirmed. Searching Sentinel-2 data...');
        break;
      case 6:
        // Satellite search is automatic, then create farm
        handleCreateFarm();
        break;
      case 7:
        handleClose();
        break;
    }
  };

  const handleBack = () => {
    if (state.step > 1) {
      if (state.step === 3 && state.isAnalyzing) {
        setState((current) => ({ ...current, isAnalyzing: false }));
      }
      setState((current) => ({
        ...current,
        step: (current.step - 1) as Step,
      }));
    }
  };

  const handleClose = () => {
    setState({
      step: 1,
      file: null,
      farmRecord: null,
      boundary: null,
      satelliteObservation: null,
      location: null,
      locationConfirmed: false,
      processingIndex: 0,
      isAnalyzing: false,
      isSearchingSatellite: false,
      satelliteSearchError: null,
      analysisErrors: [],
      analysisWarnings: [],
    });
    setCreatedFarmId(null);
    setFieldErrors({});
    window.localStorage.removeItem('soilmint-add-farm-progress-v2');
    onClose();
  };

  const renderStepContent = () => {
    switch (state.step) {
      case 1:
        return (
          <div className="space-y-5">
            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setState((current) => ({ ...current, step: 2 }));
                }}
                className="rounded-[1.25rem] border border-emerald-400/25 bg-emerald-500/10 p-4 text-left transition hover:bg-emerald-500/15"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-2 text-emerald-300">
                    <FileText className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Upload Government Land Record</p>
                    <p className="text-sm text-emerald-200">Recommended</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-400">AI will extract farm details and create your digital profile.</p>
              </button>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 text-left opacity-60">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-2 text-slate-400">
                    <MapPinned className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Manual Entry</p>
                    <p className="text-sm text-slate-400">Coming Soon</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-400">Enter farm details manually.</p>
              </div>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-2 text-emerald-300">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <p className="font-semibold text-white">Complete farm setup in one flow</p>
                  <p className="mt-1">Upload document → AI Analysis → Review Information → Draw Boundary → Satellite Discovery</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <label
            onDragOver={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`group flex cursor-pointer flex-col items-center justify-center rounded-[1.6rem] border border-dashed px-6 py-12 text-center transition ${
              dragActive ? 'border-emerald-400 bg-emerald-500/10' : 'border-white/15 bg-slate-950/60 hover:border-emerald-400/40'
            }`}
          >
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="sr-only"
              onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
            />
            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-emerald-300">
              <UploadCloud className="size-8" />
            </div>
            <p className="mt-5 text-lg font-semibold text-white">Upload your government land record</p>
            <p className="mt-2 max-w-md text-sm text-slate-400">PDF, PNG, JPG, or JPEG (Max 50MB)</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Drag & Drop</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Browse Files</span>
            </div>
            {state.file && (
              <div className="mt-6 w-full max-w-md rounded-[1.1rem] border border-emerald-400/20 bg-emerald-500/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-emerald-100">{state.file.name}</p>
                    <p className="text-sm text-emerald-200">{(state.file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <CheckCircle2 className="size-5 text-emerald-400" />
                </div>
              </div>
            )}
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
                <p className="text-sm font-semibold text-white">Analyzing your land record</p>
                <p className="text-sm text-slate-400">Validating document and extracting farm information...</p>
              </div>
            </div>
            <div className="space-y-3">
              {analysisProcessingSteps.map((item, index) => {
                const active = index <= state.processingIndex;
                return (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.06 }}
                    className={`flex items-center gap-3 rounded-[1rem] border px-4 py-3 ${
                      active ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200' : 'border-white/10 bg-white/5 text-slate-400'
                    }`}
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
        return state.farmRecord ? (
          <div className="space-y-4">
            {state.analysisErrors.length > 0 && (
              <div className="rounded-[1.1rem] border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 size-4 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Analysis Errors:</p>
                    <ul className="mt-2 list-inside list-disc space-y-1">
                      {state.analysisErrors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {state.analysisWarnings.length > 0 && (
              <div className="rounded-[1.1rem] border border-yellow-400/20 bg-yellow-500/10 p-4 text-sm text-yellow-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 size-4 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Please Review:</p>
                    <ul className="mt-2 list-inside list-disc space-y-1">
                      {state.analysisWarnings.map((warning, i) => (
                        <li key={i}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-4 lg:grid-cols-2">
              {(
                [
                  ['farmName', 'Farm Name'],
                  ['ownerName', 'Owner Name'],
                  ['surveyNumber', 'Survey Number'],
                  ['subSurveyNumber', 'Sub-Survey Number'],
                  ['village', 'Village'],
                  ['taluk', 'Taluk/Tehsil'],
                  ['district', 'District'],
                  ['state', 'State'],
                  ['area', 'Land Area'],
                  ['landClassification', 'Land Classification'],
                  ['crop', 'Crop Information'],
                  ['ownership', 'Ownership'],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className={`rounded-[1.1rem] border bg-slate-950/60 p-3 ${fieldErrors[key] ? 'border-red-400/60' : 'border-white/10'}`}>
                  <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">{label}</span>
                  <input
                    aria-describedby={fieldErrors[key] ? `${key}-error` : undefined}
                    aria-invalid={Boolean(fieldErrors[key])}
                    value={state.farmRecord?.[key] ?? ''}
                    onChange={(event) => handleFieldChange(key, event.target.value || null)}
                    placeholder="Not detected"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />
                  {fieldErrors[key] && <p id={`${key}-error`} className="mt-2 text-xs text-red-300">{fieldErrors[key]}</p>}
                </label>
              ))}
            </div>

            <div className="rounded-[1.2rem] border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-emerald-200">Extracted from land record using AI analysis</span>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-emerald-200">
                  {state.farmRecord.extractionConfidence}% confidence
                </span>
              </div>
            </div>
          </div>
        ) : null;

      case 5:
        return state.farmRecord && state.file ? (
          <div className="space-y-4">
            <div className="rounded-[1.1rem] border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">Detected Farm Location</p>
              <p className="mt-1">{state.location?.formattedAddress || 'Location not resolved from the land record'}</p>
              {state.location && <p className="mt-2 text-xs text-slate-400">Coordinates: {state.location.latitude.toFixed(6)}, {state.location.longitude.toFixed(6)}</p>}
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => setState((current) => ({ ...current, locationConfirmed: true }))} disabled={!state.location} className="rounded-lg border border-emerald-400/20 bg-emerald-500/15 px-3 py-2 text-sm text-emerald-200 disabled:opacity-40">Confirm Location</button>
                <button type="button" onClick={() => setState((current) => ({ ...current, locationConfirmed: false }))} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">Change Location</button>
              </div>
            </div>
            <FarmBoundaryMap
              location={state.location}
              geometry={state.boundary?.geometry || null}
              onLocationChange={handleLocationChange}
              onGeometryChange={(geometry) => {
                if (!geometry) {
                  setState((current) => ({ ...current, boundary: null }));
                } else if (state.locationConfirmed) {
                  handleBoundarySave(geometry);
                }
              }}
            />
            {state.boundary && <div className="rounded-[1.1rem] border border-white/10 bg-slate-950/60 p-4 text-sm"><p className="text-slate-300">Government record: <span className="font-semibold text-white">{state.farmRecord.area || 'Not detected'} {state.farmRecord.areaUnit || ''}</span></p><p className="mt-1 text-slate-300">Mapped boundary: <span className="font-semibold text-white">{state.boundary.areaHectares.toFixed(3)} hectares</span></p>{(() => { const recorded = areaInSquareMeters(state.farmRecord.area, state.farmRecord.areaUnit); const difference = recorded ? Math.abs(state.boundary.areaSquareMeters - recorded) / recorded * 100 : null; return difference === null ? <p className="mt-2 text-xs text-slate-400">Difference unavailable because this regional unit has no verified conversion configured.</p> : <p className={`mt-2 text-xs ${difference > 10 ? 'text-amber-200' : 'text-emerald-200'}`}>Difference: {difference.toFixed(1)}%{difference > 10 ? ' · Mapped area differs from the area recorded in your land document. Please verify the boundary.' : ''}</p>; })()}</div>}
          </div>
        ) : null;

      case 6:
        return (
          <div className="space-y-4">
            {state.isSearchingSatellite && (
              <SatelliteIntelligence observation={null} isLoading={true} />
            )}
            {!state.isSearchingSatellite && state.satelliteObservation && (
              <SatelliteIntelligence observation={state.satelliteObservation} />
            )}
            {!state.isSearchingSatellite && state.satelliteSearchError && (
              <div className="rounded-[1.1rem] border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-300" />
                  <div>
                    <p className="font-semibold">Satellite search unavailable</p>
                    <p className="mt-1 text-red-200/80">{state.satelliteSearchError}</p>
                    <button
                      type="button"
                      onClick={() => setState((current) => ({ ...current, isSearchingSatellite: true, satelliteSearchError: null }))}
                      className="mt-3 rounded-lg border border-red-300/20 bg-red-400/10 px-3 py-2 text-sm font-medium text-red-100 transition hover:bg-red-400/20"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}
            {!state.isSearchingSatellite && !state.satelliteObservation && (
              <div className="rounded-[1.1rem] border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-400">
                <p>Satellite data search will begin automatically once boundary is confirmed.</p>
              </div>
            )}
          </div>
        );

      case 7:
        return (
          <div className="flex flex-col items-center rounded-[1.6rem] border border-emerald-400/20 bg-emerald-500/10 px-6 py-10 text-center">
            <div className="rounded-full border border-emerald-400/20 bg-emerald-500/15 p-4 text-emerald-300">
              <CheckCircle2 className="size-10" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold text-white">Farm Profile Complete!</h3>
            <p className="mt-3 max-w-lg text-sm text-slate-300">
              {state.farmRecord?.farmName || 'Your farm'} has been created with government land record, boundary definition, and satellite data integration.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1rem] border border-white/10 bg-slate-950/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Location</p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {state.farmRecord?.village}, {state.farmRecord?.state}
                </p>
              </div>
              <div className="rounded-[1rem] border border-white/10 bg-slate-950/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Boundary Area</p>
                <p className="mt-1 text-sm font-semibold text-white">{state.boundary?.areaAcres.toFixed(2)} acres</p>
              </div>
              <div className="rounded-[1rem] border border-white/10 bg-slate-950/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Satellite Data</p>
                <p className="mt-1 text-sm font-semibold text-white">{state.satelliteObservation ? 'Integrated' : 'Pending'}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="rounded-full border border-emerald-400/20 bg-emerald-500/15 px-3 py-1 text-sm text-emerald-200">
                ✓ Land record analyzed
              </div>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-500/15 px-3 py-1 text-sm text-emerald-200">
                ✓ Boundary confirmed
              </div>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-500/15 px-3 py-1 text-sm text-emerald-200">
                ✓ Satellite intelligence ready
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!open) return null;

  const isNextDisabled =
    (state.step === 2 && !state.file) ||
    (state.step === 3 && state.isAnalyzing) ||
    (state.step === 5 && (!state.boundary || !state.locationConfirmed)) ||
    (state.step === 6 && state.isSearchingSatellite);

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
                <p className="text-sm font-medium text-emerald-300">Step {state.step} of 7</p>
                <h2 className="mt-1 text-xl font-semibold text-white">{stepTitles[state.step]}</h2>
                <p className="mt-1 text-sm text-slate-400">{stepDescriptions[state.step]}</p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-slate-200"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2">
              {Array.from({ length: 7 }).map((_, index) => {
                const active = index + 1 <= state.step;
                return <div key={index} className={`h-1.5 flex-1 rounded-full ${active ? 'bg-emerald-400' : 'bg-white/10'}`} />;
              })}
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-emerald-400 transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">{renderStepContent()}</div>

          <div className="flex items-center justify-between border-t border-white/10 px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={handleBack}
              disabled={state.step === 1}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="size-4" />
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={isNextDisabled}
              className="inline-flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/15 px-3 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-slate-500"
            >
              {state.step === 7
                ? 'Close'
                : state.step === 6
                  ? 'Create Farm'
                  : state.step === 5
                    ? 'Next'
                    : 'Continue'}
              <ChevronRight className="size-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
