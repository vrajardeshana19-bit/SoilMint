import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type FarmTimelineEvent = {
  id: string;
  title: string;
  detail: string;
  time: string;
};

export type Farm = {
  id: string;
  name: string;
  location: string;
  area: string;
  credits: string;
  score: string;
  status: string;
  updated: string;
  ownerName: string;
  surveyNumber: string;
  village: string;
  taluk: string;
  district: string;
  state: string;
  landClassification: string;
  confidence: string;
  documents: string[];
  timeline: FarmTimelineEvent[];
};

type FarmDraft = Omit<Farm, 'id' | 'updated' | 'credits' | 'score' | 'status' | 'documents' | 'timeline'> & {
  credits?: string;
  score?: string;
  status?: string;
  documents?: string[];
  timeline?: FarmTimelineEvent[];
};

type FarmsContextValue = {
  farms: Farm[];
  addFarm: (farm: FarmDraft) => Farm;
  getFarmById: (id: string) => Farm | undefined;
};

const FarmsContext = createContext<FarmsContextValue | undefined>(undefined);

const STORAGE_KEY = 'soilmint-farms';

const defaultFarms: Farm[] = [
  {
    id: 'farm-asha',
    name: 'Asha Farm',
    location: 'Bharuch, Gujarat',
    area: '24 acres',
    credits: '184 credits',
    score: '92/100',
    status: 'Healthy',
    updated: 'Updated 2h ago',
    ownerName: 'Ramesh Patel',
    surveyNumber: 'SR-104/12',
    village: 'Bharuch',
    taluk: 'Bharuch',
    district: 'Bharuch',
    state: 'Gujarat',
    landClassification: 'Dryland',
    confidence: '96%',
    documents: ['Government Land Record.pdf', 'Soil Test Report.pdf'],
    timeline: [
      { id: '1', title: 'Government Record Uploaded', detail: 'Verified government land record received.', time: '2h ago' },
      { id: '2', title: 'AI Analysis Completed', detail: 'Boundary and crop profile analyzed.', time: '1h ago' },
      { id: '3', title: 'Farm Registered', detail: 'Digital profile published for carbon tracking.', time: '25m ago' },
    ],
  },
  {
    id: 'farm-shivam',
    name: 'Shivam Fields',
    location: 'Sangli, Maharashtra',
    area: '18 acres',
    credits: '132 credits',
    score: '88/100',
    status: 'Improving',
    updated: 'Updated 1d ago',
    ownerName: 'Anil Sharma',
    surveyNumber: 'MB-221/9',
    village: 'Sangli',
    taluk: 'Sangli',
    district: 'Sangli',
    state: 'Maharashtra',
    landClassification: 'Irrigated',
    confidence: '92%',
    documents: ['Land Record.pdf'],
    timeline: [
      { id: '4', title: 'Government Record Uploaded', detail: 'Land record uploaded successfully.', time: '1d ago' },
      { id: '5', title: 'AI Analysis Completed', detail: 'Farm profile created.', time: '1d ago' },
    ],
  },
];

function createFarmId() {
  return `farm-${Math.random().toString(36).slice(2, 8)}`;
}

function readStoredFarms() {
  if (typeof window === 'undefined') {
    return defaultFarms;
  }

  const persisted = window.localStorage.getItem(STORAGE_KEY);
  if (!persisted) {
    return defaultFarms;
  }

  try {
    const parsed = JSON.parse(persisted) as Farm[];
    return parsed.length > 0 ? parsed : defaultFarms;
  } catch {
    return defaultFarms;
  }
}

export function FarmsProvider({ children }: { children: ReactNode }) {
  const [farms, setFarms] = useState<Farm[]>(() => readStoredFarms());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(farms));
    }
  }, [farms]);

  const addFarm = (farm: FarmDraft) => {
    const createdFarm: Farm = {
      id: createFarmId(),
      name: farm.name,
      location: farm.location,
      area: farm.area,
      credits: farm.credits ?? '0 credits',
      score: farm.score ?? '84/100',
      status: farm.status ?? 'Registered',
      updated: 'Just now',
      ownerName: farm.ownerName,
      surveyNumber: farm.surveyNumber,
      village: farm.village,
      taluk: farm.taluk,
      district: farm.district,
      state: farm.state,
      landClassification: farm.landClassification,
      confidence: farm.confidence ?? '91%',
      documents: farm.documents ?? ['Government Land Record.pdf'],
      timeline: farm.timeline ?? [
        { id: 'timeline-1', title: 'Government Record Uploaded', detail: 'Land record uploaded successfully.', time: 'Just now' },
        { id: 'timeline-2', title: 'AI Analysis Completed', detail: 'Farm profile generated from the uploaded document.', time: 'Just now' },
        { id: 'timeline-3', title: 'Farm Registered', detail: 'Digital farm profile is now active.', time: 'Just now' },
        { id: 'timeline-4', title: 'Awaiting Carbon Assessment', detail: 'Next step is carbon scoring and verification.', time: 'Pending' },
      ],
    };

    setFarms((current) => [createdFarm, ...current]);
    return createdFarm;
  };

  const getFarmById = useMemo(
    () => (id: string) => farms.find((farm) => farm.id === id),
    [farms],
  );

  const value = useMemo(
    () => ({ farms, addFarm, getFarmById }),
    [farms, getFarmById],
  );

  return <FarmsContext.Provider value={value}>{children}</FarmsContext.Provider>;
}

export function useFarms() {
  const context = useContext(FarmsContext);
  if (!context) {
    throw new Error('useFarms must be used inside FarmsProvider');
  }

  return context;
}
