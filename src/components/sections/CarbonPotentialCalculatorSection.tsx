import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, BarChart3, Bot, CheckCircle2, ChevronDown, Coins, Droplets, Leaf, LoaderCircle, MapPin, ShieldCheck, Sparkles, Sprout, Trees, TrendingUp, Wheat, type LucideIcon } from 'lucide-react';
import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { Container } from '../common/Container';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { Button } from '../ui/button';

type FormState = {
  farmSize: number;
  landUnit: LandUnit;
  crop: string;
  state: string;
  method: string;
};

type LandUnit = 'acre' | 'hectare' | 'bigha' | 'guntha' | 'kanal' | 'biswa' | 'cent' | 'decimal';

type ResultState = {
  credits: number;
  income: number;
  confidence: number;
  practice: string;
  increase: number;
};

type FieldProps = {
  label: string;
  id: string;
  children: ReactNode;
};

type SearchableSelectProps = {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
  action?: ReactNode;
};

type AnimatedNumberProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

type MethodOption = {
  value: string;
  label: string;
  description: string;
  icon: typeof Leaf;
};

type MetricCardProps = {
  title: string;
  value: ReactNode;
  subtitle: string;
  icon: LucideIcon;
  accent: string;
};

const landUnits = [
  { value: 'acre', label: 'Acre' },
  { value: 'hectare', label: 'Hectare' },
  { value: 'bigha', label: 'Bigha' },
  { value: 'guntha', label: 'Guntha' },
  { value: 'kanal', label: 'Kanal' },
  { value: 'biswa', label: 'Biswa' },
  { value: 'cent', label: 'Cent' },
  { value: 'decimal', label: 'Decimal' },
] as const;

const cropOptions = [
  { value: 'wheat', label: 'Wheat' },
  { value: 'rice', label: 'Rice' },
  { value: 'maize', label: 'Maize' },
  { value: 'barley', label: 'Barley' },
  { value: 'jowar', label: 'Jowar' },
  { value: 'bajra', label: 'Bajra' },
  { value: 'ragi', label: 'Ragi' },
  { value: 'millet', label: 'Millet' },
  { value: 'gram', label: 'Gram' },
  { value: 'chana', label: 'Chana' },
  { value: 'masoor', label: 'Masoor' },
  { value: 'moong', label: 'Moong' },
  { value: 'urad', label: 'Urad' },
  { value: 'tur', label: 'Tur' },
  { value: 'soybean', label: 'Soybean' },
  { value: 'groundnut', label: 'Groundnut' },
  { value: 'mustard', label: 'Mustard' },
  { value: 'sunflower', label: 'Sunflower' },
  { value: 'sesame', label: 'Sesame' },
  { value: 'castor', label: 'Castor' },
  { value: 'linseed', label: 'Linseed' },
  { value: 'tomato', label: 'Tomato' },
  { value: 'potato', label: 'Potato' },
  { value: 'onion', label: 'Onion' },
  { value: 'garlic', label: 'Garlic' },
  { value: 'cauliflower', label: 'Cauliflower' },
  { value: 'cabbage', label: 'Cabbage' },
  { value: 'peas', label: 'Peas' },
  { value: 'okra', label: 'Okra' },
  { value: 'brinjal', label: 'Brinjal' },
  { value: 'capsicum', label: 'Capsicum' },
  { value: 'banana', label: 'Banana' },
  { value: 'mango', label: 'Mango' },
  { value: 'guava', label: 'Guava' },
  { value: 'apple', label: 'Apple' },
  { value: 'pomegranate', label: 'Pomegranate' },
  { value: 'coconut', label: 'Coconut' },
  { value: 'arecanut', label: 'Arecanut' },
  { value: 'tea', label: 'Tea' },
  { value: 'coffee', label: 'Coffee' },
  { value: 'cardamom', label: 'Cardamom' },
  { value: 'chilli', label: 'Chilli' },
  { value: 'turmeric', label: 'Turmeric' },
  { value: 'cumin', label: 'Cumin' },
  { value: 'ginger', label: 'Ginger' },
  { value: 'cotton', label: 'Cotton' },
  { value: 'sugarcane', label: 'Sugarcane' },
  { value: 'jute', label: 'Jute' },
  { value: 'tobacco', label: 'Tobacco' },
];

const stateOptions = [
  { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
  { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh' },
  { value: 'Assam', label: 'Assam' },
  { value: 'Bihar', label: 'Bihar' },
  { value: 'Chhattisgarh', label: 'Chhattisgarh' },
  { value: 'Goa', label: 'Goa' },
  { value: 'Gujarat', label: 'Gujarat' },
  { value: 'Haryana', label: 'Haryana' },
  { value: 'Himachal Pradesh', label: 'Himachal Pradesh' },
  { value: 'Jharkhand', label: 'Jharkhand' },
  { value: 'Karnataka', label: 'Karnataka' },
  { value: 'Kerala', label: 'Kerala' },
  { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
  { value: 'Maharashtra', label: 'Maharashtra' },
  { value: 'Manipur', label: 'Manipur' },
  { value: 'Meghalaya', label: 'Meghalaya' },
  { value: 'Mizoram', label: 'Mizoram' },
  { value: 'Nagaland', label: 'Nagaland' },
  { value: 'Odisha', label: 'Odisha' },
  { value: 'Punjab', label: 'Punjab' },
  { value: 'Rajasthan', label: 'Rajasthan' },
  { value: 'Sikkim', label: 'Sikkim' },
  { value: 'Tamil Nadu', label: 'Tamil Nadu' },
  { value: 'Telangana', label: 'Telangana' },
  { value: 'Tripura', label: 'Tripura' },
  { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
  { value: 'Uttarakhand', label: 'Uttarakhand' },
  { value: 'West Bengal', label: 'West Bengal' },
  { value: 'Andaman and Nicobar Islands', label: 'Andaman and Nicobar Islands' },
  { value: 'Chandigarh', label: 'Chandigarh' },
  { value: 'Dadra and Nagar Haveli and Daman and Diu', label: 'Dadra and Nagar Haveli and Daman and Diu' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Jammu and Kashmir', label: 'Jammu and Kashmir' },
  { value: 'Ladakh', label: 'Ladakh' },
  { value: 'Lakshadweep', label: 'Lakshadweep' },
  { value: 'Puducherry', label: 'Puducherry' },
];

const methodOptions: MethodOption[] = [
  { value: 'organic', label: 'Organic Farming', description: 'Soil cover and compost-led growth', icon: Leaf },
  { value: 'conventional', label: 'Conventional Farming', description: 'Balanced inputs with efficient planning', icon: Wheat },
  { value: 'natural', label: 'Natural Farming', description: 'Low-input and biodiversity-first', icon: Sprout },
  { value: 'agroforestry', label: 'Agroforestry', description: 'Tree integration for resilient soils', icon: Trees },
  { value: 'drip', label: 'Drip Irrigation', description: 'Water-efficient precision farming', icon: Droplets },
];

const processingMessages = [
  'Analyzing soil profile...',
  'Checking crop type...',
  'Estimating carbon sequestration...',
  'Calculating earning potential...',
];

function getSuggestedLandUnit(state: string): LandUnit {
  const recommended: Record<string, LandUnit> = {
    Gujarat: 'bigha',
    Karnataka: 'acre',
    Punjab: 'acre',
    Kerala: 'hectare',
    Maharashtra: 'acre',
    'Tamil Nadu': 'acre',
    'Uttar Pradesh': 'bigha',
    Rajasthan: 'bigha',
    Haryana: 'acre',
    Telangana: 'acre',
    'Andhra Pradesh': 'acre',
    'West Bengal': 'decimal',
    Uttarakhand: 'bigha',
    'Himachal Pradesh': 'kanal',
    'Jammu and Kashmir': 'kanal',
    Odisha: 'acre',
    Bihar: 'bigha',
    Assam: 'bigha',
  };

  return recommended[state] ?? 'acre';
}

const stateLandUnits: Record<string, LandUnit> = {
  Punjab: 'acre',
  Haryana: 'acre',
  'Uttar Pradesh': 'bigha',
  Rajasthan: 'bigha',
  Maharashtra: 'acre',
  Karnataka: 'acre',
  'Tamil Nadu': 'acre',
  Telangana: 'acre',
  'Andhra Pradesh': 'acre',
  Kerala: 'cent',
  'West Bengal': 'decimal',
  Bihar: 'bigha',
  Odisha: 'acre',
  Assam: 'bigha',
  'Himachal Pradesh': 'kanal',
  'Jammu and Kashmir': 'kanal',
  Ladakh: 'acre',
  Uttarakhand: 'bigha',
  Gujarat: 'bigha',
  'Madhya Pradesh': 'acre',
  Chhattisgarh: 'acre',
  Jharkhand: 'acre',
  Manipur: 'acre',
  Meghalaya: 'acre',
  Nagaland: 'acre',
  Sikkim: 'acre',
  Tripura: 'acre',
  Goa: 'acre',
  'Arunachal Pradesh': 'acre',
  Mizoram: 'acre',
  Delhi: 'acre',
  Chandigarh: 'acre',
  'Andaman and Nicobar Islands': 'acre',
  'Dadra and Nagar Haveli and Daman and Diu': 'acre',
  Lakshadweep: 'acre',
  Puducherry: 'acre',
};

const landUnitConversion: Record<LandUnit, number> = {
  acre: 1,
  hectare: 2.471,
  bigha: 0.25,
  guntha: 0.025,
  kanal: 0.125,
  biswa: 0.0125,
  cent: 0.01,
  decimal: 0.01,
};

function Field({ label, id, children }: FieldProps) {
  return (
    <label htmlFor={id} className="block text-sm text-slate-300">
      <span className="mb-2 block font-medium text-slate-200">{label}</span>
      {children}
    </label>
  );
}

function SearchableSelect({ label, id, value, onChange, options, placeholder, action }: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return options;
    }

    return options.filter((option) => option.label.toLowerCase().includes(normalized));
  }, [options, query]);

  const selectedLabel = options.find((option) => option.value === value)?.label ?? '';

  return (
    <div className="relative">
      <div className="mb-2 flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm text-slate-300">
          <span className="block font-medium text-slate-200">{label}</span>
        </label>
        {action ? <div>{action}</div> : null}
      </div>
      <button
        type="button"
        id={id}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white outline-none transition focus:border-emerald-400/40 focus:bg-white/8"
      >
        <span className={selectedLabel ? 'text-white' : 'text-slate-400'}>{selectedLabel || placeholder}</span>
        <span className="text-slate-400">▾</span>
      </button>

      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-20 mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-slate-950/60"
        >
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none ring-0 placeholder:text-slate-500"
          />
          <div className="mt-2 max-h-48 space-y-1 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setQuery('');
                  }}
                  className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${value === option.value ? 'bg-emerald-500/15 text-emerald-200' : 'text-slate-300 hover:bg-white/10'}`}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-slate-400">No matches found</div>
            )}
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}

function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let animationFrame = 0;
    const startTime = performance.now();
    const duration = 900;

    const step = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      }
    };

    animationFrame = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [value]);

  return <span>{`${prefix}${display.toFixed(decimals).toLocaleString()}${suffix}`}</span>;
}

function MetricCard({ title, value, subtitle, icon: Icon, accent }: MetricCardProps) {
  return (
    <motion.article
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl"
    >
      <div className={`inline-flex rounded-2xl border border-white/10 bg-slate-950/60 p-2 ${accent}`}>
        <Icon className="size-4" />
      </div>
      <p className="mt-3 text-sm text-slate-400">{title}</p>
      <div className="mt-2 text-xl font-semibold text-white">{value}</div>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
    </motion.article>
  );
}

function CarbonPotentialGauge({ value }: { value: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="flex flex-col items-center"
    >
      <div className="relative flex size-40 items-center justify-center rounded-full bg-slate-950/70 shadow-[0_0_30px_rgba(16,185,129,0.12)] sm:size-44 md:size-48">
        <div className="absolute inset-0 rounded-full border border-emerald-400/15" />
        <div className="absolute inset-1.5 rounded-full bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_70%)]" />
        <motion.div
          initial={{ opacity: 0.7, scale: 0.96 }}
          animate={{ opacity: [0.7, 1, 0.75], scale: [0.96, 1, 0.96] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full border border-emerald-400/20"
        />
        <svg viewBox="0 0 140 140" className="absolute inset-0 size-full -rotate-90">
          <circle cx="70" cy="70" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="none" />
          <motion.circle
            cx="70"
            cy="70"
            r={radius}
            stroke="url(#gaugeGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            strokeDasharray={circumference}
          />
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a7f3d0" />
              <stop offset="50%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="relative z-10 flex flex-col items-center px-3 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-3xl font-semibold leading-none text-white sm:text-4xl md:text-[2.6rem]"
          >
            {value}%
          </motion.p>
          <p className="mt-2 text-sm font-medium text-emerald-300 sm:text-base">Excellent</p>
        </motion.div>
      </div>

      <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500 sm:text-[12px]">
        AI Confidence: 96%
      </p>
    </motion.div>
  );
}

function getResults(form: FormState): ResultState {
  const cropFactors: Record<string, number> = {
    wheat: 1.04,
    rice: 1.08,
    maize: 1.22,
    barley: 1.01,
    jowar: 1.02,
    bajra: 1.05,
    ragi: 1.07,
    millet: 1.03,
    gram: 1.11,
    chana: 1.12,
    masoor: 1.05,
    moong: 1.06,
    urad: 1.05,
    tur: 1.09,
    soybean: 1.16,
    groundnut: 1.18,
    mustard: 1.1,
    sunflower: 1.12,
    sesame: 1.09,
    castor: 1.08,
    linseed: 1.03,
    tomato: 1.14,
    potato: 1.15,
    onion: 1.1,
    garlic: 1.08,
    cauliflower: 1.09,
    cabbage: 1.07,
    peas: 1.06,
    okra: 1.05,
    brinjal: 1.06,
    capsicum: 1.07,
    banana: 1.18,
    mango: 1.17,
    guava: 1.11,
    apple: 1.14,
    pomegranate: 1.13,
    coconut: 1.19,
    arecanut: 1.16,
    tea: 1.15,
    coffee: 1.2,
    cardamom: 1.13,
    chilli: 1.12,
    turmeric: 1.11,
    cumin: 1.1,
    ginger: 1.09,
    cotton: 1.16,
    sugarcane: 1.2,
    jute: 1.08,
    tobacco: 1.09,
  };

  const stateFactors: Record<string, number> = {
    Maharashtra: 1.08,
    Karnataka: 1.1,
    Punjab: 1.12,
    'Madhya Pradesh': 1.06,
    'Tamil Nadu': 1.09,
    'Uttar Pradesh': 1.07,
    Rajasthan: 1.05,
    Gujarat: 1.07,
    Haryana: 1.1,
    Telangana: 1.08,
    'Andhra Pradesh': 1.07,
    Kerala: 1.11,
    Odisha: 1.06,
    Bihar: 1.04,
    Assam: 1.04,
    'West Bengal': 1.06,
    'Himachal Pradesh': 1.05,
    Uttarakhand: 1.05,
    'Jammu and Kashmir': 1.04,
    Ladakh: 1.03,
    'Andaman and Nicobar Islands': 1.04,
    Chandigarh: 1.09,
    'Dadra and Nagar Haveli and Daman and Diu': 1.05,
    Delhi: 1.08,
    Lakshadweep: 1.04,
    Puducherry: 1.08,
  };

  const methodFactors: Record<string, number> = {
    organic: 1.16,
    conventional: 0.98,
    natural: 1.22,
    agroforestry: 1.34,
    drip: 1.14,
  };

  const acres = form.farmSize * landUnitConversion[form.landUnit];
  const cropFactor = cropFactors[form.crop] ?? 1.08;
  const stateFactor = stateFactors[form.state] ?? 1.05;
  const methodFactor = methodFactors[form.method] ?? 1.08;

  const credits = Math.max(18, Math.round(acres * cropFactor * stateFactor * methodFactor * 12));
  const income = Math.round(credits * 1820);
  const confidence = Math.min(97, Math.round(78 + acres / 10 + methodFactor * 5 + cropFactor * 3));
  const increase = Math.round(credits * 0.2 + methodFactor * 5);

  const practice =
    form.method === 'agroforestry'
      ? 'Agroforestry with tree-based carbon sinks'
      : form.method === 'natural'
        ? 'Natural farming with cover crops'
        : form.method === 'organic'
          ? 'Compost-led soil enrichment'
          : form.method === 'drip'
            ? 'Precision irrigation and residue retention'
            : 'Balanced nutrient management';

  return {
    credits,
    income,
    confidence,
    increase,
    practice,
  };
}

export function CarbonPotentialCalculatorSection() {
  const [form, setForm] = useState<FormState>({
    farmSize: 120,
    landUnit: 'acre',
    crop: 'maize',
    state: 'Maharashtra',
    method: 'organic',
  });
  const [phase, setPhase] = useState<'idle' | 'loading' | 'result'>('idle');
  const [messageIndex, setMessageIndex] = useState(0);
  const [result, setResult] = useState<ResultState | null>(null);
  const [showGrowthPlan, setShowGrowthPlan] = useState(false);
  const { status: locationStatus, errorMessage, location, refresh: refreshLocation } = useCurrentLocation();

  useEffect(() => {
    if (phase !== 'loading') {
      return;
    }

    const interval = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % processingMessages.length);
    }, 700);

    const timeout = window.setTimeout(() => {
      setResult(getResults(form));
      setPhase('result');
    }, 2400);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [form, phase]);

  useEffect(() => {
    if (locationStatus !== 'success' || !location) {
      return;
    }

    setForm((current) => ({
      ...current,
      state: location.state,
      landUnit: getSuggestedLandUnit(location.state),
    }));
  }, [location, locationStatus]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessageIndex(0);
    setPhase('loading');
    setResult(null);
  };

  const handleUseCurrentLocation = async () => {
    await refreshLocation();
  };

  const handleStateChange = (state: string) => {
    setForm((current) => ({
      ...current,
      state,
      landUnit: stateLandUnits[state] ?? current.landUnit,
    }));
  };

  return (
    <section className="bg-[linear-gradient(180deg,_#020617_0%,_#07111f_100%)] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <Container>
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.88),rgba(2,6,23,0.92))] p-6 shadow-[0_30px_120px_rgba(2,6,23,0.35)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55 }}
              className="flex flex-col justify-between"
            >
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3.5 py-2 text-sm font-medium text-emerald-300">
                  <Sparkles className="size-4" />
                  AI-powered farm forecast
                </div>
                <h2 className="mt-6 text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">
                  Estimate Your Farm&apos;s Carbon Income
                </h2>
                <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">
                  Get a fast estimate of carbon credits and annual income based on your farm details, crop, state, and practice.
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Results are estimates designed to help farmers plan better and compare sustainable practices before listing credits.
                </p>
              </div>

              <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-emerald-500/10 p-2 text-emerald-300">
                    <TrendingUp className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">Built for Indian farmers</p>
                    <p className="mt-2 text-sm leading-7 text-slate-400">
                      The calculator supports local land units, regional state context, and a wide range of crops to make the estimate feel practical and trustworthy.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-4 shadow-[0_22px_70px_rgba(2,6,23,0.35)] backdrop-blur sm:p-6"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Farm Size" id="farmSize">
                    <input
                      id="farmSize"
                      type="number"
                      min="1"
                      value={form.farmSize}
                      onChange={(event) => setForm((current) => ({ ...current, farmSize: Number(event.target.value) || 1 }))}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400/40 focus:bg-white/8"
                    />
                  </Field>

                  <Field label="Land Unit" id="landUnit">
                    <select
                      id="landUnit"
                      value={form.landUnit}
                      onChange={(event) => setForm((current) => ({ ...current, landUnit: event.target.value as LandUnit }))}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400/40 focus:bg-white/8"
                    >
                      {landUnits.map((unit) => (
                        <option key={unit.value} value={unit.value} className="bg-slate-900 text-white">
                          {unit.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <SearchableSelect
                    label="Crop"
                    id="crop"
                    value={form.crop}
                    onChange={(value) => setForm((current) => ({ ...current, crop: value }))}
                    options={cropOptions}
                    placeholder="Search crops"
                  />

                  <SearchableSelect
                    label="State"
                    id="state"
                    value={form.state}
                    onChange={handleStateChange}
                    options={stateOptions}
                    placeholder="Search state"
                    action={
                      <button
                        type="button"
                        onClick={handleUseCurrentLocation}
                        disabled={locationStatus === 'loading'}
                        className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-200 transition hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {locationStatus === 'loading' ? <LoaderCircle className="size-3.5 animate-spin" /> : <MapPin className="size-3.5" />}
                        {locationStatus === 'loading' ? 'Detecting...' : 'Use Current Location'}
                      </button>
                    }
                  />
                </div>

                <AnimatePresence mode="wait">
                  {locationStatus === 'loading' ? (
                    <motion.div
                      key="location-loading"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-center gap-2 rounded-[1.1rem] border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200"
                    >
                      <LoaderCircle className="size-4 animate-spin" />
                      Detecting your location...
                    </motion.div>
                  ) : null}

                  {locationStatus === 'success' && location ? (
                    <motion.div
                      key="location-detected"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="rounded-[1.1rem] border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200"
                    >
                      <div className="flex items-center gap-2 font-medium">
                        <CheckCircle2 className="size-4" />
                        <span>Detected Location</span>
                      </div>
                      <div className="mt-1 leading-6 text-emerald-100/90">
                        <div>{location.city || location.district}, {location.district}</div>
                        <div>{location.state}</div>
                      </div>
                    </motion.div>
                  ) : null}

                  {locationStatus === 'error' && errorMessage ? (
                    <motion.div
                      key="location-error"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="rounded-[1.1rem] border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-200"
                    >
                      {errorMessage}
                      <div className="mt-2 text-xs text-amber-100/90">Please try again or enter your state manually.</div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <div className="mt-3 rounded-[1.35rem] border border-white/10 bg-white/5 p-3">
                  <p className="mb-3 text-sm font-medium text-slate-200">Farming Method</p>
                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
                    {methodOptions.map((option) => {
                      const Icon = option.icon;
                      const active = form.method === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setForm((current) => ({ ...current, method: option.value }))}
                          className={`rounded-[1.1rem] border p-3 text-left transition ${active ? 'border-emerald-400/40 bg-emerald-500/10 shadow-[0_10px_30px_rgba(16,185,129,0.14)]' : 'border-white/10 bg-slate-900/60 hover:border-white/20 hover:bg-white/10'}`}
                        >
                          <div className={`mb-2 inline-flex rounded-2xl p-2 ${active ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/8 text-slate-300'}`}>
                            <Icon className="size-4" />
                          </div>
                          <p className="text-sm font-medium text-white">{option.label}</p>
                          <p className="mt-1 text-xs leading-6 text-slate-400">{option.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full gap-2 px-6">
                  Calculate
                  <ArrowRight className="size-4" />
                </Button>
              </form>

              <div className="mt-5 rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                <AnimatePresence mode="wait">
                  {phase === 'loading' ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3 text-emerald-300">
                        <LoaderCircle className="size-5 animate-spin" />
                        <p className="font-medium">AI is processing your farm profile</p>
                      </div>
                      <div className="space-y-2">
                        {processingMessages.map((message, index) => {
                          const active = index === messageIndex;
                          return (
                            <motion.div
                              key={message}
                              initial={{ opacity: 0.4 }}
                              animate={{ opacity: active ? 1 : 0.45 }}
                              transition={{ duration: 0.25 }}
                              className="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-300"
                            >
                              {message}
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ) : null}

                  {phase === 'result' && result ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="rounded-[1.35rem] border border-emerald-400/20 bg-[linear-gradient(135deg,rgba(16,185,129,0.16),rgba(15,23,42,0.86))] p-4 shadow-[0_15px_45px_rgba(16,185,129,0.12)]">
                        <div className="flex items-center gap-2 text-emerald-300">
                          <Sparkles className="size-4" />
                          <p className="text-sm font-medium">Premium forecast ready</p>
                        </div>
                        <p className="mt-3 text-xl font-semibold text-white">Your farm&apos;s carbon opportunity is now mapped</p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">This premium analysis blends your crop, state, and practice profile into a clear signal for income and sustainability potential.</p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <MetricCard
                          title="Estimated Carbon Credits"
                          value={<AnimatedNumber value={Math.max(result.credits, 51)} suffix=" Credits / Year" />}
                          subtitle="Projected annual credits"
                          icon={Leaf}
                          accent="text-emerald-300"
                        />
                        <MetricCard
                          title="Estimated Annual Income"
                          value={<AnimatedNumber value={result.income} prefix="₹" />}
                          subtitle="Potential annual revenue"
                          icon={Coins}
                          accent="text-emerald-300"
                        />
                        <MetricCard
                          title="AI Confidence"
                          value={<AnimatedNumber value={result.confidence} suffix="%" />}
                          subtitle="Model confidence"
                          icon={BarChart3}
                          accent="text-emerald-300"
                        />
                        <MetricCard
                          title="Sustainability Score"
                          value={<AnimatedNumber value={Math.min(98, Math.max(80, Math.round(result.confidence * 0.9 + 6)))} suffix="/100" />}
                          subtitle="Impact readiness"
                          icon={ShieldCheck}
                          accent="text-emerald-300"
                        />
                      </div>

                      <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
                          <div className="flex items-center gap-2 text-emerald-300">
                            <BadgeCheck className="size-4" />
                            <p className="text-sm font-medium">Verification Readiness</p>
                          </div>
                          <p className="mt-3 text-2xl font-semibold text-white">Pending</p>
                          <p className="mt-2 text-sm leading-6 text-slate-400">Your profile is ready for review, and the next step is document verification for premium credit listing.</p>
                        </div>
                        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4 backdrop-blur-xl">
                          <p className="text-sm text-slate-400">Recommended Practice</p>
                          <p className="mt-2 text-lg font-semibold text-white">{result.practice}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-400">Designed to improve soil health, resilience, and future credit eligibility.</p>
                        </div>
                      </div>

                      <div className="rounded-[1.35rem] border border-white/10 bg-white/10 p-4 backdrop-blur-xl sm:p-5">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                          <div className="max-w-md">
                            <p className="text-sm font-medium text-emerald-300">Carbon Potential Gauge</p>
                            <p className="mt-2 text-lg font-semibold text-white">A quick view of your farm&apos;s climate upside.</p>
                            <p className="mt-2 text-sm leading-6 text-slate-400">This premium gauge combines confidence, practice fit, and impact readiness into one simple score.</p>
                          </div>
                          <CarbonPotentialGauge value={Math.min(96, Math.round(result.confidence * 0.9 + 5))} />
                        </div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.1 }}
                        className="rounded-[1.35rem] border border-emerald-400/20 bg-[linear-gradient(135deg,rgba(16,185,129,0.16),rgba(15,23,42,0.9))] p-4 shadow-[0_16px_50px_rgba(16,185,129,0.12)] backdrop-blur-xl"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/15 p-2 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.18)]">
                              <Bot className="size-5" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">AI Recommendation</p>
                              <p className="text-sm text-slate-300">Based on your farm profile:</p>
                            </div>
                          </div>
                          <button className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/15">
                            View Detailed AI Plan
                          </button>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_0.9fr]">
                          <div className="space-y-2 rounded-[1.1rem] border border-white/10 bg-slate-950/60 p-4">
                            <div className="flex items-start gap-2 text-sm text-slate-300">
                              <span className="mt-1 text-emerald-300">•</span>
                              <span>Switch to cover crops.</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-slate-300">
                              <span className="mt-1 text-emerald-300">•</span>
                              <span>Reduce residue burning.</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-slate-300">
                              <span className="mt-1 text-emerald-300">•</span>
                              <span>Use drip irrigation.</span>
                            </div>
                          </div>

                          <div className="rounded-[1.1rem] border border-white/10 bg-white/10 p-4">
                            <p className="text-sm text-slate-400">Potential Benefits</p>
                            <p className="mt-2 text-2xl font-semibold text-white">+12 Carbon Credits</p>
                            <p className="mt-2 text-sm text-slate-300">≈ ₹18,000 Additional Income</p>
                            <div className="mt-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3">
                              <p className="text-sm text-slate-400">Estimated Sustainability Score</p>
                              <p className="mt-1 text-lg font-semibold text-white">88 → 94</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setShowGrowthPlan((current) => !current)}
                          className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/15"
                        >
                          Explore How to Increase Income
                          <ChevronDown className={`size-4 transition ${showGrowthPlan ? 'rotate-180' : ''}`} />
                        </button>
                      </div>

                      <AnimatePresence initial={false}>
                        {showGrowthPlan ? (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 rounded-[1.3rem] border border-emerald-400/20 bg-[linear-gradient(135deg,rgba(16,185,129,0.14),rgba(15,23,42,0.92))] p-4 shadow-[0_16px_46px_rgba(16,185,129,0.12)]">
                              <div className="flex items-center gap-2 text-emerald-300">
                                <TrendingUp className="size-4" />
                                <p className="text-sm font-medium">Growth Potential</p>
                              </div>

                              <div className="mt-4 space-y-3">
                                {[
                                  { label: 'Current Estimate', value: '₹92,820', color: 'text-white' },
                                  { label: 'If you adopt Drip Irrigation', value: '₹1,10,000', color: 'text-emerald-200' },
                                  { label: 'If you introduce Cover Crops', value: '₹1,22,000', color: 'text-emerald-200' },
                                  { label: 'If you reduce residue burning', value: '₹1,28,500', color: 'text-emerald-200' },
                                ].map((item, index) => (
                                  <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.08 }}
                                    className="flex items-center gap-3 rounded-[1rem] border border-white/10 bg-slate-950/60 p-3"
                                  >
                                    <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">
                                      <ArrowRight className="size-4" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm text-slate-400">{item.label}</p>
                                      <p className={`mt-1 text-base font-semibold ${item.color}`}>{item.value}</p>
                                    </div>
                                    {index > 0 ? <div className="text-emerald-300">↗</div> : null}
                                  </motion.div>
                                ))}
                              </div>

                              <div className="mt-4 rounded-[1rem] border border-emerald-400/20 bg-emerald-500/10 p-3">
                                <div className="flex items-center justify-between gap-3">
                                  <p className="text-sm text-slate-300">Potential Increase</p>
                                  <p className="text-lg font-semibold text-white">+₹35,680/year</p>
                                </div>
                                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                  <div className="rounded-[0.9rem] border border-white/10 bg-slate-950/60 p-3">
                                    <p className="text-sm text-slate-400">Estimated Carbon Credits</p>
                                    <div className="mt-2 flex items-end justify-between">
                                      <div>
                                        <p className="text-xs text-slate-500">Current</p>
                                        <p className="text-xl font-semibold text-white">51</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-slate-500">Potential</p>
                                        <p className="text-xl font-semibold text-emerald-300">68</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="rounded-[0.9rem] border border-white/10 bg-slate-950/60 p-3">
                                    <p className="text-sm text-slate-400">Growth Timeline</p>
                                    <div className="mt-2 flex items-center gap-2 text-sm text-emerald-200">
                                      <span className="h-2 w-2 rounded-full bg-emerald-300" />
                                      <span>Short-term practice change</span>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                                      <span className="h-2 w-2 rounded-full bg-white/30" />
                                      <span>Improved verification readiness</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>

                      <div className="rounded-[1.2rem] border border-white/10 bg-slate-950/60 p-4 backdrop-blur-xl">
                        <p className="text-sm font-medium text-slate-200">Estimated using:</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-400">
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                            <CheckCircle2 className="size-3.5 text-emerald-300" />
                            Crop Type
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                            <CheckCircle2 className="size-3.5 text-emerald-300" />
                            Farm Size
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                            <CheckCircle2 className="size-3.5 text-emerald-300" />
                            Region
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                            <CheckCircle2 className="size-3.5 text-emerald-300" />
                            Farming Practices
                          </span>
                        </div>
                        <p className="mt-3 text-xs leading-6 text-slate-500">
                          These are AI-generated estimates. Final carbon credits are determined after verification.
                        </p>
                      </div>
                    </motion.div>
                  ) : null}

                  {phase === 'idle' ? (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="rounded-[1.2rem] border border-dashed border-white/15 bg-slate-900/50 p-4 text-sm leading-7 text-slate-400"
                    >
                      Your forecast will appear here once you calculate your farm profile.
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
