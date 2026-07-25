import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Droplets, Leaf, LoaderCircle, MapPin, Sparkles, Sprout, Trees, TrendingUp, Wheat } from 'lucide-react';
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
                        className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-200 transition hover:bg-emerald-500/15"
                      >
                        <MapPin className="size-3.5" />
                        Use Current Location
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
                      <div className="flex items-center gap-2 text-emerald-300">
                        <CheckCircle2 className="size-5" />
                        <p className="font-medium">Estimate ready</p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[1.2rem] border border-white/10 bg-slate-900/65 p-4">
                          <p className="text-sm text-slate-400">Estimated Carbon Credits</p>
                          <p className="mt-2 text-2xl font-semibold text-white">
                            <AnimatedNumber value={result.credits} suffix=" credits" />
                          </p>
                        </div>
                        <div className="rounded-[1.2rem] border border-white/10 bg-slate-900/65 p-4">
                          <p className="text-sm text-slate-400">Estimated Annual Income</p>
                          <p className="mt-2 text-2xl font-semibold text-white">
                            <AnimatedNumber value={result.income} prefix="₹" />
                          </p>
                        </div>
                        <div className="rounded-[1.2rem] border border-white/10 bg-slate-900/65 p-4">
                          <p className="text-sm text-slate-400">AI Confidence</p>
                          <p className="mt-2 text-2xl font-semibold text-white">
                            <AnimatedNumber value={result.confidence} suffix="%" />
                          </p>
                        </div>
                        <div className="rounded-[1.2rem] border border-white/10 bg-slate-900/65 p-4">
                          <p className="text-sm text-slate-400">Potential Credit Increase</p>
                          <p className="mt-2 text-2xl font-semibold text-white">
                            +<AnimatedNumber value={result.increase} suffix=" credits" />
                          </p>
                        </div>
                      </div>

                      <div className="rounded-[1.3rem] border border-emerald-400/20 bg-emerald-500/10 p-4">
                        <p className="text-sm text-slate-400">Recommended Sustainable Practice</p>
                        <p className="mt-2 text-lg font-semibold text-white">{result.practice}</p>
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
