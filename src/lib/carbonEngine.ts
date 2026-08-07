export type FarmerInputs = {
  fertilizerUsage: string;
  pesticideUsage: string;
  irrigationSource: string;
  cropRotation: string;
  residueManagement: string;
  organicPractices: string;
  treeCover: string;
  waterSource: string;
};

export type CarbonAssessment = {
  currentEstimate: number;
  potentialEstimate: number;
  confidenceScore: number;
  explanation: Array<{ label: string; detail: string }>;
};

export type SustainabilityScore = {
  overall: number;
  breakdown: Array<{ label: string; score: number; detail: string }>;
  trend: string;
};

export type IncomeEstimate = {
  currentAnnualIncome: number;
  potentialAnnualIncome: number;
  estimatedIncrease: number;
};

export type Verification = {
  readiness: number;
  checks: Array<{ label: string; verified: boolean; detail: string }>;
  confidenceScore: number;
};

export type Recommendation = {
  id: string;
  title: string;
  problem: string;
  whyItMatters: string;
  estimatedImpact: string;
  difficulty: string;
  estimatedCost: string;
  potentialCarbonIncrease: string;
  potentialIncomeIncrease: string;
  priority: 'High' | 'Medium' | 'Low';
};

export type CarbonEngineResult = {
  assessment: CarbonAssessment;
  sustainability: SustainabilityScore;
  income: IncomeEstimate;
  verification: Verification;
  recommendations: Recommendation[];
  summary: string;
};

export type FarmProfileLike = {
  area: string;
  currentCrop?: string;
  currentSeason?: string;
  landClassification?: string;
  documents?: Array<{ status?: string }>;
  farmerInputs?: Partial<FarmerInputs>;
  location?: string;
  village?: string;
  district?: string;
  state?: string;
  surveyNumber?: string;
  ownerName?: string;
  soil?: { sustainabilityScore?: string };
  carbon?: { verificationReadiness?: string };
};

function parseArea(area: string) {
  const match = String(area).match(/(\d+)/);
  return match ? Number(match[1]) : 12;
}

function cropMultiplier(crop: string | undefined) {
  const normalized = (crop ?? '').toLowerCase();
  if (normalized.includes('groundnut')) return 1.08;
  if (normalized.includes('sugarcane')) return 1.17;
  if (normalized.includes('paddy')) return 1.14;
  if (normalized.includes('cotton')) return 1.1;
  if (normalized.includes('cereal') || normalized.includes('wheat')) return 1.02;
  return 1.05;
}

function practiceBonus(inputs: Partial<FarmerInputs> | undefined) {
  const irrigation = (inputs?.irrigationSource ?? '').toLowerCase();
  const rotation = (inputs?.cropRotation ?? '').toLowerCase();
  const residue = (inputs?.residueManagement ?? '').toLowerCase();
  const organic = (inputs?.organicPractices ?? '').toLowerCase();
  const tree = (inputs?.treeCover ?? '').toLowerCase();
  const water = (inputs?.waterSource ?? '').toLowerCase();

  let bonus = 0;
  if (irrigation.includes('drip')) bonus += 18;
  else if (irrigation.includes('sprinkler')) bonus += 10;
  else bonus += 6;

  if (rotation.includes('yes')) bonus += 12;
  if (residue.includes('retained')) bonus += 14;
  if (organic.includes('yes')) bonus += 16;
  if (tree.includes('high')) bonus += 12;
  else if (tree.includes('medium')) bonus += 8;
  if (water.includes('rainfed')) bonus += 6;
  else if (water.includes('tank')) bonus += 3;

  return bonus;
}

function buildVerificationChecks(farm: FarmProfileLike) {
  const docsVerified = (farm.documents ?? []).some((document) => (document.status ?? '').toLowerCase() === 'verified');
  const profileComplete = Boolean(farm.ownerName && farm.surveyNumber && farm.village && farm.district && farm.state);
  const boundaryVerified = Boolean(farm.surveyNumber && farm.location);

  return [
    { label: 'Government Record Uploaded', verified: (farm.documents ?? []).length > 0, detail: 'Land records are available in the farm profile.' },
    { label: 'Farm Boundary Verified', verified: boundaryVerified, detail: 'Survey-backed location is available for boundary checks.' },
    { label: 'Farmer Information Complete', verified: profileComplete, detail: 'Core profile details are populated for verification.' },
    { label: 'Documents Verified', verified: docsVerified, detail: 'Uploaded documents have been reviewed for trust signals.' },
  ];
}

export function buildCarbonEngineResult(farm: FarmProfileLike): CarbonEngineResult {
  const areaValue = parseArea(farm.area);
  const cropFactor = cropMultiplier(farm.currentCrop);
  const bonus = practiceBonus(farm.farmerInputs);
  const currentEstimate = Math.round(areaValue * 4.9 * cropFactor + bonus + 24);
  const potentialEstimate = Math.round(currentEstimate + 24 + (farm.farmerInputs?.organicPractices?.toLowerCase().includes('yes') ? 18 : 8) + (farm.farmerInputs?.treeCover?.toLowerCase().includes('high') ? 12 : 0));
  const confidenceScore = Math.min(98, 74 + (farm.documents?.length ? 8 : 0) + (farm.farmerInputs?.cropRotation?.toLowerCase().includes('yes') ? 4 : 0) + (farm.farmerInputs?.residueManagement?.toLowerCase().includes('retained') ? 4 : 0) + (farm.farmerInputs?.organicPractices?.toLowerCase().includes('yes') ? 4 : 0));

  const sustainabilityBreakdown = [
    { label: 'Soil Health', score: 86 + (farm.farmerInputs?.organicPractices?.toLowerCase().includes('yes') ? 4 : 0), detail: 'Soil resilience is supported by regenerative practices and coverage.' },
    { label: 'Water Efficiency', score: 80 + (farm.farmerInputs?.irrigationSource?.toLowerCase().includes('drip') ? 8 : 3), detail: 'Irrigation choices improve water use efficiency and reduce avoidable losses.' },
    { label: 'Carbon Practices', score: 82 + (farm.farmerInputs?.residueManagement?.toLowerCase().includes('retained') ? 6 : 0), detail: 'Residue retention and rotation practices strengthen long-term carbon storage.' },
    { label: 'Biodiversity', score: 75 + (farm.farmerInputs?.treeCover?.toLowerCase().includes('high') ? 8 : farm.farmerInputs?.treeCover?.toLowerCase().includes('medium') ? 4 : 0), detail: 'Tree cover and habitat support add resilience and ecological depth.' },
    { label: 'Resource Efficiency', score: 79 + (farm.farmerInputs?.fertilizerUsage?.toLowerCase().includes('low') ? 6 : 0), detail: 'Balanced input strategies reduce waste and improve nutrient efficiency.' },
  ];

  const overall = Math.round(sustainabilityBreakdown.reduce((sum, item) => sum + item.score, 0) / sustainabilityBreakdown.length);

  const verificationChecks = buildVerificationChecks(farm);
  const readiness = Math.round(verificationChecks.filter((check) => check.verified).length / verificationChecks.length * 100);

  const income = {
    currentAnnualIncome: currentEstimate * 1280,
    potentialAnnualIncome: potentialEstimate * 1280,
    estimatedIncrease: (potentialEstimate - currentEstimate) * 1280,
  };

  const recommendations: Recommendation[] = [
    {
      id: 'drip',
      title: 'Switch to Drip Irrigation',
      problem: 'Watering is still routed through less efficient methods.',
      whyItMatters: 'Drip irrigation reduces losses and improves water-use consistency during peak climate stress.',
      estimatedImpact: '+18 credits',
      difficulty: 'Medium',
      estimatedCost: '₹42,000',
      potentialCarbonIncrease: '+18 credits',
      potentialIncomeIncrease: '≈ ₹23,000/year',
      priority: 'High',
    },
    {
      id: 'residue',
      title: 'Retain Crop Residue',
      problem: 'Residue removal is limiting soil carbon capture potential.',
      whyItMatters: 'Residue retention protects the soil surface and feeds microbial activity over time.',
      estimatedImpact: '+12 credits',
      difficulty: 'Low',
      estimatedCost: '₹8,000',
      potentialCarbonIncrease: '+12 credits',
      potentialIncomeIncrease: '≈ ₹15,000/year',
      priority: 'High',
    },
    {
      id: 'tree-cover',
      title: 'Expand Tree Cover on Boundaries',
      problem: 'The farm has limited tree-based biodiversity support.',
      whyItMatters: 'Trees add carbon storage while improving shade and habitat quality across the farm.',
      estimatedImpact: '+10 credits',
      difficulty: 'Medium',
      estimatedCost: '₹18,000',
      potentialCarbonIncrease: '+10 credits',
      potentialIncomeIncrease: '≈ ₹13,000/year',
      priority: 'Medium',
    },
    {
      id: 'rotation',
      title: 'Strengthen Crop Rotation',
      problem: 'The current crop profile does not fully diversify the field.',
      whyItMatters: 'Rotation reduces vulnerability and supports healthier soil systems over successive seasons.',
      estimatedImpact: '+9 credits',
      difficulty: 'Medium',
      estimatedCost: '₹12,000',
      potentialCarbonIncrease: '+9 credits',
      potentialIncomeIncrease: '≈ ₹11,000/year',
      priority: 'Medium',
    },
  ];

  return {
    assessment: {
      currentEstimate,
      potentialEstimate,
      confidenceScore,
      explanation: [
        { label: 'Farm Area', detail: `The assessment scales with the farm area of ${farm.area}.` },
        { label: 'Crop Type', detail: `The crop mix for ${farm.currentCrop ?? 'the current crop'} influences the carbon profile.` },
        { label: 'Crop Rotation', detail: `Crop rotation inputs increase the model confidence when recorded as ${farm.farmerInputs?.cropRotation ?? 'present'}.` },
        { label: 'Residue Management', detail: `Residue retention practices are rewarded in the sustainability model.` },
        { label: 'Water Source', detail: `Water source and irrigation choices impact water efficiency and resilience.` },
        { label: 'AI Confidence', detail: `The score is based on farm profile completeness, document availability and practiced interventions.` },
      ],
    },
    sustainability: {
      overall,
      breakdown: sustainabilityBreakdown,
      trend: overall >= 88 ? 'Rising' : overall >= 82 ? 'Stable' : 'Improving',
    },
    income,
    verification: {
      readiness,
      checks: verificationChecks,
      confidenceScore: Math.min(98, readiness + 8),
    },
    recommendations,
    summary: `${farm.area} farm with ${farm.currentCrop ?? 'current crop'} is positioned for a measured carbon upgrade, with strong potential from better water and residue management.`,
  };
}
