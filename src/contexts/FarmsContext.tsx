import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { FarmBoundary, SatelliteObservation } from '../services/sentinel2Service';

export type FarmTimelineEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  status: string;
  icon: string;
  details?: string[];
};

export type FarmDocument = {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  status: string;
  confidence: string;
};

export type Farm = {
  id: string;
  name: string;
  location: string;
  area: string;
  credits: string;
  score: string;
  status: string;
  verificationStatus: string;
  updated: string;
  lastUpdated: string;
  ownerName: string;
  surveyNumber: string;
  village: string;
  taluk: string;
  district: string;
  state: string;
  landClassification: string;
  confidence: string;
  currentSeason: string;
  currentCrop: string;
  documents: FarmDocument[];
  timeline: FarmTimelineEvent[];
  boundary: FarmBoundary | null;
  governmentRecordedArea: string;
  boundaryCalculatedArea: string;
  satelliteObservation: SatelliteObservation | null;
  carbon: {
    estimatedCredits: string;
    annualIncome: string;
    potential: string;
    verificationReadiness: string;
  };
  soil: {
    sustainabilityScore: string;
    health: string;
    organicMatter: string;
    moisture: string;
  };
  weather: {
    forecast: string;
    rainfall: string;
    temperature: string;
  };
  satellite: {
    lastScan: string;
    coverage: string;
    trend: string;
  };
  recommendations: string[];
};

type FarmDraft = Partial<Omit<Farm, 'id' | 'updated' | 'lastUpdated' | 'credits' | 'score' | 'status' | 'documents' | 'timeline' | 'verificationStatus' | 'boundary' | 'governmentRecordedArea' | 'boundaryCalculatedArea' | 'satelliteObservation'>> & {
  credits?: string;
  score?: string;
  status?: string;
  verificationStatus?: string;
  documents?: FarmDocument[] | string[];
  timeline?: FarmTimelineEvent[];
  boundary?: FarmBoundary | null;
  governmentRecordedArea?: string;
  boundaryCalculatedArea?: string;
  satelliteObservation?: SatelliteObservation | null;
};

type FarmsContextValue = {
  farms: Farm[];
  addFarm: (farm: FarmDraft) => Farm;
  getFarmById: (id: string) => Farm | undefined;
  updateFarm: (id: string, updates: Partial<Farm>) => void;
  addTimelineEvent: (farmId: string, event: FarmTimelineEvent) => void;
};

const FarmsContext = createContext<FarmsContextValue | undefined>(undefined);

const STORAGE_KEY = 'soilmint-farms';

function createFarmId() {
  return `farm-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeDocuments(documents: unknown): FarmDocument[] {
  if (!Array.isArray(documents)) {
    return [];
  }

  return documents.map((document, index) => {
    if (typeof document === 'string') {
      return {
        id: `document-${index}`,
        name: document,
        type: 'Government Record',
        uploadedAt: 'Recently added',
        status: 'Verified',
        confidence: '92%',
      };
    }

    if (typeof document === 'object' && document) {
      const doc = document as Partial<FarmDocument>;
      return {
        id: doc.id ?? `document-${index}`,
        name: doc.name ?? `Document ${index + 1}`,
        type: doc.type ?? 'Government Record',
        uploadedAt: doc.uploadedAt ?? 'Recently added',
        status: doc.status ?? 'Verified',
        confidence: doc.confidence ?? '92%',
      };
    }

    return {
      id: `document-${index}`,
      name: `Document ${index + 1}`,
      type: 'Government Record',
      uploadedAt: 'Recently added',
      status: 'Verified',
      confidence: '92%',
    };
  });
}

function normalizeTimeline(timeline: unknown): FarmTimelineEvent[] {
  if (!Array.isArray(timeline)) {
    return [];
  }

  return timeline.map((event, index) => {
    if (typeof event === 'object' && event) {
      const entry = event as Partial<FarmTimelineEvent>;
      return {
        id: entry.id ?? `timeline-${index}`,
        title: entry.title ?? 'Milestone',
        description: entry.description ?? entry.title ?? 'Farm milestone captured.',
        date: entry.date ?? 'Recently updated',
        status: entry.status ?? 'Completed',
        icon: entry.icon ?? 'sparkles',
        details: entry.details ?? ['Captured in the digital farm workspace.'],
      };
    }

    return {
      id: `timeline-${index}`,
      title: 'Milestone',
      description: 'Farm milestone captured.',
      date: 'Recently updated',
      status: 'Completed',
      icon: 'sparkles',
      details: ['Captured in the digital farm workspace.'],
    };
  });
}

function normalizeFarm(farm: Partial<Farm> & Record<string, unknown>): Farm {
  const carbon = farm.carbon as Partial<Farm['carbon']> | undefined;
  const soil = farm.soil as Partial<Farm['soil']> | undefined;
  const weather = farm.weather as Partial<Farm['weather']> | undefined;
  const satellite = farm.satellite as Partial<Farm['satellite']> | undefined;
  const boundary = farm.boundary as FarmBoundary | undefined;
  const satelliteObservation = farm.satelliteObservation as SatelliteObservation | undefined;

  return {
    id: farm.id ?? createFarmId(),
    name: farm.name ?? 'Digital Farm',
    location: farm.location ?? 'Unknown location',
    area: farm.area ?? '0 acres',
    credits: farm.credits ?? '0 credits',
    score: farm.score ?? '84/100',
    status: farm.status ?? 'Registered',
    verificationStatus: farm.verificationStatus ?? 'In review',
    updated: farm.updated ?? 'Just now',
    lastUpdated: farm.lastUpdated ?? farm.updated ?? 'Just now',
    ownerName: farm.ownerName ?? 'Farmer',
    surveyNumber: farm.surveyNumber ?? 'Pending',
    village: farm.village ?? 'Pending',
    taluk: farm.taluk ?? 'Pending',
    district: farm.district ?? 'Pending',
    state: farm.state ?? 'Pending',
    landClassification: farm.landClassification ?? 'Pending',
    confidence: farm.confidence ?? '91%',
    currentSeason: farm.currentSeason ?? 'Kharif',
    currentCrop: farm.currentCrop ?? 'Cereals',
    documents: normalizeDocuments(farm.documents),
    timeline: normalizeTimeline(farm.timeline),
    boundary: boundary ?? null,
    governmentRecordedArea: (farm.governmentRecordedArea as string) ?? farm.area ?? '0 acres',
    boundaryCalculatedArea: (farm.boundaryCalculatedArea as string) ?? 'Not calculated',
    satelliteObservation: satelliteObservation ?? null,
    carbon: {
      estimatedCredits: carbon?.estimatedCredits ?? '0 credits',
      annualIncome: carbon?.annualIncome ?? '₹0',
      potential: carbon?.potential ?? 'Pending',
      verificationReadiness: carbon?.verificationReadiness ?? 'Pending',
    },
    soil: {
      sustainabilityScore: soil?.sustainabilityScore ?? '84/100',
      health: soil?.health ?? 'Stable',
      organicMatter: soil?.organicMatter ?? '2.4%',
      moisture: soil?.moisture ?? 'Moderate',
    },
    weather: {
      forecast: weather?.forecast ?? 'Balanced',
      rainfall: weather?.rainfall ?? 'Normal',
      temperature: weather?.temperature ?? '24°C',
    },
    satellite: {
      lastScan: satellite?.lastScan ?? '2 days ago',
      coverage: satellite?.coverage ?? 'Excellent',
      trend: satellite?.trend ?? 'Improving',
    },
    recommendations: (farm.recommendations as string[] | undefined) ?? ['Continue monitoring soil moisture.'],
  };
}

const defaultFarms: Farm[] = [
  normalizeFarm({
    id: 'farm-asha',
    name: 'Asha Farm',
    location: 'Bharuch, Gujarat',
    area: '24 acres',
    credits: '184 credits',
    score: '92/100',
    status: 'Healthy',
    verificationStatus: 'Verified',
    updated: 'Updated 2h ago',
    lastUpdated: 'Updated 2h ago',
    ownerName: 'Ramesh Patel',
    surveyNumber: 'SR-104/12',
    village: 'Bharuch',
    taluk: 'Bharuch',
    district: 'Bharuch',
    state: 'Gujarat',
    landClassification: 'Dryland',
    confidence: '96%',
    currentSeason: 'Rabi',
    currentCrop: 'Groundnut',
    documents: [
      {
        id: 'doc-1',
        name: 'Government Land Record',
        type: 'Government Record',
        uploadedAt: '2026-08-05',
        status: 'Verified',
        confidence: '97%',
      },
      {
        id: 'doc-2',
        name: 'Soil Test Report',
        type: 'Soil Analysis',
        uploadedAt: '2026-08-06',
        status: 'Verified',
        confidence: '94%',
      },
    ],
    timeline: [
      { id: '1', title: 'Government Record Uploaded', description: 'Verified government land record received.', date: '2h ago', status: 'Completed', icon: 'file' },
      { id: '2', title: 'AI Record Analysis Completed', description: 'Boundary and crop profile analyzed.', date: '1h ago', status: 'Completed', icon: 'sparkles' },
      { id: '3', title: 'Digital Farm Generated', description: 'Digital twin published for carbon tracking.', date: '25m ago', status: 'Completed', icon: 'leaf' },
    ],
    carbon: {
      estimatedCredits: '184 credits',
      annualIncome: '₹3.2L',
      potential: 'High',
      verificationReadiness: '92%',
    },
    soil: {
      sustainabilityScore: '92/100',
      health: 'Excellent',
      organicMatter: '3.2%',
      moisture: 'Balanced',
    },
    weather: {
      forecast: 'Ideal',
      rainfall: 'Seasonal',
      temperature: '26°C',
    },
    satellite: {
      lastScan: '2 hours ago',
      coverage: 'Excellent',
      trend: 'Improving',
    },
    recommendations: ['Increase nitrogen management to improve residue health.', 'Push for additional verification documents.'],
  }),
  normalizeFarm({
    id: 'farm-shivam',
    name: 'Shivam Fields',
    location: 'Sangli, Maharashtra',
    area: '18 acres',
    credits: '132 credits',
    score: '88/100',
    status: 'Improving',
    verificationStatus: 'In review',
    updated: 'Updated 1d ago',
    lastUpdated: 'Updated 1d ago',
    ownerName: 'Anil Sharma',
    surveyNumber: 'MB-221/9',
    village: 'Sangli',
    taluk: 'Sangli',
    district: 'Sangli',
    state: 'Maharashtra',
    landClassification: 'Irrigated',
    confidence: '92%',
    currentSeason: 'Kharif',
    currentCrop: 'Sugarcane',
    documents: [{ id: 'doc-3', name: 'Land Record.pdf', type: 'Government Record', uploadedAt: '2026-08-02', status: 'Review', confidence: '89%' }],
    timeline: [{ id: '4', title: 'Government Record Uploaded', description: 'Land record uploaded successfully.', date: '1d ago', status: 'Completed', icon: 'file' }],
    carbon: {
      estimatedCredits: '132 credits',
      annualIncome: '₹2.4L',
      potential: 'Moderate',
      verificationReadiness: '84%',
    },
    soil: {
      sustainabilityScore: '88/100',
      health: 'Good',
      organicMatter: '2.9%',
      moisture: 'Optimal',
    },
    weather: {
      forecast: 'Stable',
      rainfall: 'Adequate',
      temperature: '29°C',
    },
    satellite: {
      lastScan: '1 day ago',
      coverage: 'Good',
      trend: 'Stable',
    },
    recommendations: ['Upload a recent water-use certificate.', 'Plan for carbon reporting next quarter.'],
  }),
];

function readStoredFarms() {
  if (typeof window === 'undefined') {
    return defaultFarms;
  }

  const persisted = window.localStorage.getItem(STORAGE_KEY);
  if (!persisted) {
    return defaultFarms;
  }

  try {
    const parsed = JSON.parse(persisted) as Array<Partial<Farm>>;
    return parsed.length > 0 ? parsed.map((farm) => normalizeFarm(farm)) : defaultFarms;
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
    const createdFarm: Farm = normalizeFarm({
      id: createFarmId(),
      name: farm.name,
      location: farm.location,
      area: farm.area,
      credits: farm.credits ?? '0 credits',
      score: farm.score ?? '84/100',
      status: farm.status ?? 'Registered',
      verificationStatus: farm.verificationStatus ?? 'In review',
      updated: 'Just now',
      lastUpdated: 'Just now',
      ownerName: farm.ownerName,
      surveyNumber: farm.surveyNumber,
      village: farm.village,
      taluk: farm.taluk,
      district: farm.district,
      state: farm.state,
      landClassification: farm.landClassification,
      confidence: farm.confidence ?? '91%',
      currentSeason: farm.currentSeason ?? 'Kharif',
      currentCrop: farm.currentCrop ?? 'Cereals',
      documents: farm.documents ? normalizeDocuments(farm.documents) : [{ id: 'doc-new', name: 'Government Land Record', type: 'Government Record', uploadedAt: 'Just now', status: 'Pending', confidence: '91%' }],
      timeline: farm.timeline ?? [
        { id: 'timeline-1', title: 'Government Record Uploaded', description: 'Land record uploaded successfully.', date: 'Just now', status: 'Completed', icon: 'file' },
        { id: 'timeline-2', title: 'AI Analysis Completed', description: 'Farm profile generated from the uploaded document.', date: 'Just now', status: 'Completed', icon: 'sparkles' },
        { id: 'timeline-3', title: 'Farm Registered', description: 'Digital farm profile is now active.', date: 'Just now', status: 'Completed', icon: 'leaf' },
      ],
      boundary: farm.boundary ?? null,
      governmentRecordedArea: farm.governmentRecordedArea ?? farm.area ?? '0 acres',
      boundaryCalculatedArea: farm.boundaryCalculatedArea ?? 'Not calculated',
      satelliteObservation: farm.satelliteObservation ?? null,
      carbon: {
        estimatedCredits: '0 credits',
        annualIncome: '₹0',
        potential: 'Pending',
        verificationReadiness: 'Pending',
      },
      soil: {
        sustainabilityScore: '84/100',
        health: 'Monitoring',
        organicMatter: 'Pending',
        moisture: 'Pending',
      },
      weather: {
        forecast: 'Pending',
        rainfall: 'Pending',
        temperature: 'Pending',
      },
      satellite: {
        lastScan: 'Pending',
        coverage: 'Pending',
        trend: 'Pending',
      },
      recommendations: ['Awaiting AI assessment.'],
    });

    setFarms((current) => [createdFarm, ...current]);
    return createdFarm;
  };

  const updateFarm = (id: string, updates: Partial<Farm>) => {
    setFarms((current) =>
      current.map((farm) => {
        if (farm.id !== id) {
          return farm;
        }
        return {
          ...farm,
          ...updates,
          lastUpdated: 'Just now',
        };
      }),
    );
  };

  const addTimelineEvent = (farmId: string, event: FarmTimelineEvent) => {
    setFarms((current) =>
      current.map((farm) => {
        if (farm.id !== farmId) {
          return farm;
        }
        return {
          ...farm,
          timeline: [event, ...farm.timeline],
          lastUpdated: 'Just now',
        };
      }),
    );
  };

  const getFarmById = useMemo(
    () => (id: string) => farms.find((farm) => farm.id === id),
    [farms],
  );

  const value = useMemo(
    () => ({ farms, addFarm, getFarmById, updateFarm, addTimelineEvent }),
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
