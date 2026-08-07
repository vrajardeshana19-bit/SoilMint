import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Bot,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleCheckBig,
  CircleDashed,
  CloudSun,
  Database,
  FileText,
  Leaf,
  MapPin,
  Satellite,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Upload,
  Wheat,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFarms, type FarmTimelineEvent } from '../../contexts/FarmsContext';

type TabKey = 'Overview' | 'Timeline' | 'Documents' | 'Carbon' | 'Satellite' | 'Weather' | 'Soil' | 'AI Advisor' | 'Marketplace' | 'Settings';

type PlaceholderConfig = {
  title: string;
  description: string;
  benefits: string;
  features: string[];
  icon: LucideIcon;
};

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'Overview', label: 'Overview' },
  { key: 'Timeline', label: 'Timeline' },
  { key: 'Documents', label: 'Documents' },
  { key: 'Carbon', label: 'Carbon' },
  { key: 'Satellite', label: 'Satellite' },
  { key: 'Weather', label: 'Weather' },
  { key: 'Soil', label: 'Soil' },
  { key: 'AI Advisor', label: 'AI Advisor' },
  { key: 'Marketplace', label: 'Marketplace' },
  { key: 'Settings', label: 'Settings' },
];

const placeholderConfigs: Record<Exclude<TabKey, 'Overview' | 'Timeline' | 'Documents'>, PlaceholderConfig> = {
  Carbon: {
    title: 'Carbon Intelligence',
    description: 'This module will transform farm activity into carbon-ready evidence for buyers and agencies.',
    benefits: 'Farmers will understand their carbon opportunity and verify it with confidence.',
    features: ['MRV-ready emission estimates', 'Practice-based credit modelling', 'Buyer-ready reporting narratives'],
    icon: Leaf,
  },
  Satellite: {
    title: 'Satellite Intelligence',
    description: 'Satellite analysis will monitor canopy health, field boundaries and crop stress from orbit.',
    benefits: 'The farmer can spot risk sooner and plan interventions with less guesswork.',
    features: ['Vegetation trend detection', 'Field anomaly alerts', 'Temporal change analysis'],
    icon: Satellite,
  },
  Weather: {
    title: 'Weather Intelligence',
    description: 'Weather intelligence will connect field conditions to irrigation timing and seasonal risk.',
    benefits: 'This helps reduce losses while improving yield quality and forecasting.',
    features: ['Rainfall anomaly alerts', 'Heat stress forecasting', 'Planting and harvesting guidance'],
    icon: CloudSun,
  },
  Soil: {
    title: 'Soil Intelligence',
    description: 'Soil intelligence will combine lab data, remote sensing and field signals into a deeper health view.',
    benefits: 'The farmer can make nutrient and land management decisions based on evidence.',
    features: ['Nutrient balance modelling', 'Moisture trend scoring', 'Microbial and organic matter insights'],
    icon: Database,
  },
  'AI Advisor': {
    title: 'AI Advisor',
    description: 'The advisor will synthesize farm signals into clear recommendations for the next best action.',
    benefits: 'It turns observation into action for yield, revenue and sustainability goals.',
    features: ['Actionable recommendations', 'Scenario planning', 'Dynamic advisories by crop and season'],
    icon: Bot,
  },
  Marketplace: {
    title: 'Marketplace',
    description: 'The marketplace will connect verified farms to carbon credit buyers and premium partners.',
    benefits: 'Farmers can discover real monetization pathways without leaving the dashboard.',
    features: ['Credit listing opportunities', 'Verified buyer matching', 'Commercial deal insights'],
    icon: Wheat,
  },
  Settings: {
    title: 'Government Verification',
    description: 'Verification workflows will coordinate external agencies, document trust and audit readiness.',
    benefits: 'This supports farmers and buyers with a trust layer that scales.',
    features: ['Agency submission workflows', 'Compliance evidence packs', 'Verification readiness scoring'],
    icon: ShieldCheck,
  },
};

function SectionCard({ children, title, eyebrow, icon: Icon, action }: { children: React.ReactNode; title: string; eyebrow: string; icon: LucideIcon; action?: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(2,6,23,0.96))] p-5 shadow-[0_20px_70px_rgba(2,6,23,0.16)] backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-emerald-300">{eyebrow}</p>
          <h3 className="mt-1 text-xl font-semibold text-white">{title}</h3>
        </div>
        {Icon ? (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-2 text-emerald-300">
            <Icon className="size-4" />
          </div>
        ) : null}
      </div>
      {action ? <div className="mt-4">{action}</div> : null}
      <div className="mt-5">{children}</div>
    </motion.section>
  );
}

function PlaceholderPanel({ config }: { config: PlaceholderConfig }) {
  const Icon = config.icon;
  return (
    <SectionCard title={config.title} eyebrow="Premium module" icon={Icon}>
      <div className="space-y-4">
        <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          <p>{config.description}</p>
          <p className="mt-2 text-emerald-200">{config.benefits}</p>
        </div>
        <div className="rounded-[1.25rem] border border-emerald-400/20 bg-emerald-500/10 p-4">
          <p className="text-sm font-semibold text-white">Expected AI features</p>
          <ul className="mt-3 space-y-2 text-sm text-emerald-100">
            {config.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <CircleCheckBig className="mt-0.5 size-4 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionCard>
  );
}

function TimelineItem({ event }: { event: FarmTimelineEvent }) {
  const [expanded, setExpanded] = useState(false);
  const iconMap: Record<string, LucideIcon> = {
    file: FileText,
    sparkles: Sparkles,
    leaf: Leaf,
    shield: ShieldCheck,
    satellite: Satellite,
  };
  const Icon = iconMap[event.icon] ?? Sparkles;

  return (
    <motion.div layout className="rounded-[1.15rem] border border-white/10 bg-white/5 p-3">
      <button type="button" onClick={() => setExpanded((current) => !current)} className="flex w-full items-start justify-between gap-3 text-left">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-2 text-emerald-200">
            <Icon className="size-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{event.title}</p>
            <p className="mt-1 text-sm text-slate-400">{event.description}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/60 px-2 py-1">
                <CalendarDays className="size-3" />
                {event.date}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-1 text-emerald-200">
                <CircleCheckBig className="size-3" />
                {event.status}
              </span>
            </div>
          </div>
        </div>
        {expanded ? <ChevronDown className="mt-1 size-4 text-slate-400" /> : <ChevronRight className="mt-1 size-4 text-slate-400" />}
      </button>
      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-3 rounded-[1rem] border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Expanded context</p>
              <ul className="mt-2 space-y-2">
                {(event.details ?? ['Captured in the digital farm workspace.']).map((detail) => (
                  <li key={detail} className="flex items-start gap-2">
                    <CircleDashed className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

export function FarmDetailView() {
  const { farmId, id } = useParams<{ farmId?: string; id?: string }>();
  const navigate = useNavigate();
  const { getFarmById } = useFarms();
  const farmIdParam = farmId ?? id ?? '';
  const farm = getFarmById(farmIdParam);
  const [activeTab, setActiveTab] = useState<TabKey>('Overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = window.setTimeout(() => setIsLoading(false), 700);
    return () => window.clearTimeout(timer);
  }, [farmIdParam]);

  useEffect(() => {
    setActiveTab('Overview');
  }, [farmIdParam]);

  const analytics = useMemo(() => [
    { label: 'Farm Area', value: farm?.area ?? '0 acres', icon: Leaf },
    { label: 'Current Crop', value: farm?.currentCrop ?? 'Pending', icon: Wheat },
    { label: 'Estimated Carbon Credits', value: farm?.carbon.estimatedCredits ?? '0 credits', icon: Leaf },
    { label: 'Estimated Annual Income', value: farm?.carbon.annualIncome ?? '₹0', icon: Sparkles },
    { label: 'Sustainability Score', value: farm?.soil.sustainabilityScore ?? '84/100', icon: ShieldCheck },
    { label: 'Verification Readiness', value: farm?.carbon.verificationReadiness ?? 'Pending', icon: ShieldCheck },
    { label: 'AI Confidence', value: farm?.confidence ?? '91%', icon: Bot },
  ], [farm]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-12 w-44 animate-pulse rounded-full border border-white/10 bg-white/5" />
        <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(2,6,23,0.96))] p-5 shadow-[0_20px_70px_rgba(2,6,23,0.16)] backdrop-blur-xl">
          <div className="h-6 w-40 animate-pulse rounded-full bg-white/10" />
          <div className="mt-4 h-10 w-72 animate-pulse rounded-full bg-white/10" />
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-24 animate-pulse rounded-[1.2rem] border border-white/10 bg-white/5" />
            ))}
          </div>
        </div>
      </div>
    );
  }

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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-200">
              <Sparkles className="size-4" />
              Digital Farm Identity
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-white">{farm.name}</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">A live digital twin of the farm capturing land records, health signals, verification readiness and monetization pathways.</p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-400">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <MapPin className="size-4 text-emerald-300" />
                {farm.location}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <Leaf className="size-4 text-emerald-300" />
                {farm.area}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <Wheat className="size-4 text-emerald-300" />
                {farm.currentCrop}
              </span>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ['Farm Status', farm.status],
                ['Verification Status', farm.verificationStatus],
                ['Village', farm.village],
                ['District', farm.district],
                ['State', farm.state],
                ['Survey Number', farm.surveyNumber],
                ['Current Season', farm.currentSeason],
                ['Last Updated', farm.lastUpdated],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.1rem] border border-white/10 bg-white/5 p-3">
                  <p className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-500">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="rounded-[1.1rem] border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4" />
                Verification Status: {farm.verificationStatus}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10">
                <Upload className="size-4" />
                Upload Document
              </button>
              <button type="button" onClick={() => navigate(`/dashboard/farms/${farm.id}/carbon`)} className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200 transition hover:bg-emerald-500/15">
                <Sparkles className="size-4" />
                Run Carbon Analysis
              </button>
              <button type="button" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10">
                <FileText className="size-4" />
                Edit Farm
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {analytics.map((metric) => {
            const Icon = metric.icon;
            return (
              <motion.div key={metric.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.2rem] border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">{metric.label}</p>
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-2 text-emerald-300">
                    <Icon className="size-4" />
                  </div>
                </div>
                <p className="mt-3 text-lg font-semibold text-white">{metric.value}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full border px-3 py-2 text-sm transition ${activeTab === tab.key ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200' : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'Overview' ? (
        <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <SectionCard title="Farm Profile" eyebrow="Core identity" icon={MapPin}>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ['Owner', farm.ownerName],
                  ['Survey Number', farm.surveyNumber],
                  ['Village', farm.village],
                  ['Area', farm.area],
                  ['Land Classification', farm.landClassification],
                  ['Current Season', farm.currentSeason],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[1.1rem] border border-white/10 bg-white/5 p-3">
                    <p className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Farm Health" eyebrow="Performance signals" icon={ShieldCheck}>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ['Sustainability Score', farm.soil.sustainabilityScore],
                  ['Carbon Potential', farm.carbon.potential],
                  ['Verification Readiness', farm.carbon.verificationReadiness],
                  ['AI Confidence', farm.confidence],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[1.1rem] border border-white/10 bg-white/5 p-3">
                    <p className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Recent Activity" eyebrow="Operational pulse" icon={TimerReset}>
            <div className="space-y-3">
              {farm.timeline.slice(0, 4).map((event) => (
                <div key={event.id} className="rounded-[1.1rem] border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-white">{event.title}</p>
                    <span className="text-xs uppercase tracking-[0.24em] text-slate-500">{event.date}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{event.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-[1.1rem] border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">
              <p className="font-semibold">Recommended next move</p>
              <p className="mt-1">{farm.recommendations[0] ?? 'Continue consolidating verification evidence.'}</p>
            </div>
          </SectionCard>
        </div>
      ) : null}

      {activeTab === 'Timeline' ? (
        <SectionCard title="Farm Timeline" eyebrow="Flagship activity feed" icon={TimerReset}>
          <div className="space-y-3">
            {farm.timeline.length > 0 ? (
              farm.timeline.map((event) => <TimelineItem key={event.id} event={event} />)
            ) : (
              <div className="rounded-[1.1rem] border border-dashed border-white/10 bg-white/5 p-6 text-center text-sm text-slate-400">No timeline activity yet.</div>
            )}
          </div>
        </SectionCard>
      ) : null}

      {activeTab === 'Documents' ? (
        <SectionCard
          title="Government Records"
          eyebrow="Verification package"
          icon={FileText}
          action={
            <button type="button" className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200 transition hover:bg-emerald-500/15">
              <Upload className="size-4" />
              Upload Another Document
            </button>
          }
        >
          {farm.documents.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {farm.documents.map((document) => (
                <div key={document.id} className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{document.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{document.type}</p>
                    </div>
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-200">
                      {document.status}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-500">Upload Date</p>
                      <p className="mt-1 text-sm text-white">{document.uploadedAt}</p>
                    </div>
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-500">Confidence Score</p>
                      <p className="mt-1 text-sm text-white">{document.confidence}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10">View</button>
                    <button type="button" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10">Replace</button>
                    <button type="button" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.1rem] border border-dashed border-white/10 bg-white/5 p-6 text-center text-sm text-slate-400">No documents are attached to this farm yet.</div>
          )}
        </SectionCard>
      ) : null}

      {activeTab !== 'Overview' && activeTab !== 'Timeline' && activeTab !== 'Documents' ? (
        <PlaceholderPanel config={placeholderConfigs[activeTab]} />
      ) : null}
    </div>
  );
}
