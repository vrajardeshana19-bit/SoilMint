import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Bot,
  FileDown,
  Leaf,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wheat,
  type LucideIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFarms } from '../../contexts/FarmsContext';
import { buildCarbonEngineResult, type CarbonEngineResult } from '../../lib/carbonEngine';

type SectionCardProps = {
  title: string;
  eyebrow: string;
  icon: LucideIcon;
  children: React.ReactNode;
};

function SectionCard({ title, eyebrow, icon: Icon, children }: SectionCardProps) {
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
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-2 text-emerald-300">
          <Icon className="size-4" />
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </motion.section>
  );
}

function CircularScore({ value, label }: { value: number; label: string }) {
  const normalized = Math.max(0, Math.min(100, value));
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex size-28 items-center justify-center rounded-full border border-white/10 bg-slate-950/60">
        <svg viewBox="0 0 120 120" className="absolute inset-0 size-full -rotate-90">
          <circle cx="60" cy="60" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="10" fill="none" />
          <circle cx="60" cy="60" r={radius} stroke="#34d399" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
        </svg>
        <div className="text-center">
          <p className="text-2xl font-semibold text-white">{normalized}</p>
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

export function CarbonIntelligenceView() {
  const navigate = useNavigate();
  const { farmId, id } = useParams<{ farmId?: string; id?: string }>();
  const { getFarmById } = useFarms();
  const farm = getFarmById(farmId ?? id ?? '');
  const [activeExplain, setActiveExplain] = useState<string | null>(null);

  const result = useMemo<CarbonEngineResult | null>(() => {
    if (!farm) return null;
    return buildCarbonEngineResult({
      area: farm.area,
      currentCrop: farm.currentCrop,
      currentSeason: farm.currentSeason,
      landClassification: farm.landClassification,
      documents: farm.documents,
      farmerInputs: {
        fertilizerUsage: 'Moderate',
        pesticideUsage: 'Moderate',
        irrigationSource: 'Drip',
        cropRotation: 'Yes',
        residueManagement: 'Retained',
        organicPractices: 'Yes',
        treeCover: 'Medium',
        waterSource: 'Rainfed',
      },
      location: farm.location,
      village: farm.village,
      district: farm.district,
      state: farm.state,
      surveyNumber: farm.surveyNumber,
      ownerName: farm.ownerName,
      soil: farm.soil,
      carbon: farm.carbon,
    });
  }, [farm]);

  if (!farm || !result) {
    return (
      <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(2,6,23,0.96))] p-8 text-center shadow-[0_20px_70px_rgba(2,6,23,0.16)] backdrop-blur-xl">
        <p className="text-lg font-semibold text-white">Farm not found</p>
        <p className="mt-2 text-sm text-slate-400">Select a farm from the dashboard to inspect its carbon intelligence.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button type="button" onClick={() => navigate(`/dashboard/farms/${farm.id}`)} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10">
        <ArrowLeft className="size-4" />
        Back to Farm Dashboard
      </button>

      <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(2,6,23,0.96))] p-5 shadow-[0_25px_80px_rgba(2,6,23,0.16)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-200">
              <Sparkles className="size-4" />
              Carbon Intelligence Engine
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-white">{farm.name}</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">{result.summary}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200 transition hover:bg-emerald-500/15">
              <FileDown className="size-4" />
              Download Report
            </button>
            <button type="button" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10">
              <Bot className="size-4" />
              Explain Model
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard title="Carbon Potential Engine" eyebrow="Assessment" icon={Leaf}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Current Estimate</p>
                <p className="mt-1 text-3xl font-semibold text-white">{result.assessment.currentEstimate}</p>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Potential Estimate</p>
                <p className="mt-1 text-3xl font-semibold text-white">{result.assessment.potentialEstimate}</p>
              </div>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-slate-950/60 p-4">
              <CircularScore value={result.assessment.confidenceScore} label="Confidence" />
            </div>
          </div>
          <div className="mt-4 rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Why this estimate exists</p>
              <button type="button" className="text-sm text-emerald-200">Why?</button>
            </div>
            <div className="mt-3 space-y-2">
              {result.assessment.explanation.map((item) => (
                <div key={item.label} className="rounded-[1rem] border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-white">{item.label}</p>
                    <button type="button" onClick={() => setActiveExplain(item.label)} className="text-xs text-emerald-200">Explain</button>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{item.detail}</p>
                </div>
              ))}
            </div>
            <AnimatePresence>
              {activeExplain ? (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="mt-3 rounded-[1.1rem] border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">
                  <p className="font-semibold">{activeExplain}</p>
                  <p className="mt-1">The engine uses the farm area, crop profile, land management signals and document quality to construct the score. This makes every number explainable and traceable to the existing farm profile.</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </SectionCard>

        <SectionCard title="Sustainability Engine" eyebrow="Health score" icon={ShieldCheck}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Overall Score</p>
              <p className="mt-1 text-3xl font-semibold text-white">{result.sustainability.overall}/100</p>
              <p className="mt-2 text-sm text-emerald-200">Trend: {result.sustainability.trend}</p>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-slate-950/60 p-4">
              <CircularScore value={result.sustainability.overall} label="Sustainability" />
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {result.sustainability.breakdown.map((item) => (
              <div key={item.label} className="rounded-[1.15rem] border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <span className="text-sm text-emerald-200">{item.score}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="Income Engine" eyebrow="Revenue outlook" icon={TrendingUp}>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Current Income</p>
              <p className="mt-1 text-xl font-semibold text-white">₹{result.income.currentAnnualIncome.toLocaleString()}</p>
            </div>
            <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Potential Income</p>
              <p className="mt-1 text-xl font-semibold text-white">₹{result.income.potentialAnnualIncome.toLocaleString()}</p>
            </div>
            <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Estimated Increase</p>
              <p className="mt-1 text-xl font-semibold text-white">₹{result.income.estimatedIncrease.toLocaleString()}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Verification Engine" eyebrow="Trust & readiness" icon={ShieldCheck}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Verification Readiness</p>
              <p className="mt-1 text-3xl font-semibold text-white">{result.verification.readiness}%</p>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-slate-950/60 p-4">
              <CircularScore value={result.verification.confidenceScore} label="Confidence" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {result.verification.checks.map((check) => (
              <div key={check.label} className="flex items-start justify-between rounded-[1rem] border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
                <div>
                  <p className="font-medium text-white">{check.label}</p>
                  <p className="mt-1 text-slate-400">{check.detail}</p>
                </div>
                <div className={`rounded-full px-2 py-1 text-xs ${check.verified ? 'bg-emerald-500/10 text-emerald-200' : 'bg-white/10 text-slate-300'}`}>
                  {check.verified ? 'Verified' : 'Pending'}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Recommendation Engine" eyebrow="Actionable intelligence" icon={Wheat}>
        <div className="grid gap-3 lg:grid-cols-2">
          {result.recommendations.map((recommendation) => (
            <div key={recommendation.id} className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{recommendation.title}</p>
                  <p className="mt-2 text-sm text-slate-400">{recommendation.problem}</p>
                </div>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-200">{recommendation.priority}</span>
              </div>
              <p className="mt-3 text-sm text-slate-300">{recommendation.whyItMatters}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <div className="rounded-[1rem] border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">
                  <p className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-500">Estimated Impact</p>
                  <p className="mt-1 font-semibold text-white">{recommendation.estimatedImpact}</p>
                </div>
                <div className="rounded-[1rem] border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">
                  <p className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-500">Potential Carbon Increase</p>
                  <p className="mt-1 font-semibold text-white">{recommendation.potentialCarbonIncrease}</p>
                </div>
                <div className="rounded-[1rem] border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">
                  <p className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-500">Estimated Cost</p>
                  <p className="mt-1 font-semibold text-white">{recommendation.estimatedCost}</p>
                </div>
                <div className="rounded-[1rem] border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">
                  <p className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-500">Potential Income Increase</p>
                  <p className="mt-1 font-semibold text-white">{recommendation.potentialIncomeIncrease}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Farm Sustainability Report" eyebrow="Export ready" icon={FileDown}>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10">Export PDF</button>
          <button type="button" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10">Share Report</button>
          <button type="button" className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200 transition hover:bg-emerald-500/15">Download Snapshot</button>
        </div>
      </SectionCard>
    </div>
  );
}
