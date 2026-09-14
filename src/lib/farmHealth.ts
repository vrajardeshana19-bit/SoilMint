import type { Farm, FarmActivity } from '../contexts/FarmsContext';

export type FarmHealthStatus = 'Excellent' | 'Good' | 'Needs Attention' | 'Critical' | 'Not enough data';

export type FarmHealthResult = {
  score: number | null;
  status: FarmHealthStatus;
  explanation: string;
  dataAvailable: boolean;
};

function missingOrPending(value: string | undefined | null) {
  if (!value) {
    return true;
  }

  return value.toLowerCase().trim() === 'pending' || value.toLowerCase().trim() === 'not calculated' || value.toLowerCase().trim() === 'unknown';
}

function parseScoreString(value: string) {
  const parsed = Number.parseFloat(value.replace(/[^\d.]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function scoreStatus(score: number): Exclude<FarmHealthStatus, 'Not enough data'> {
  if (score >= 85) {
    return 'Excellent';
  }

  if (score >= 70) {
    return 'Good';
  }

  if (score >= 50) {
    return 'Needs Attention';
  }

  return 'Critical';
}

export function calculateFarmHealth(farm: Farm | undefined, activities: FarmActivity[] = []): FarmHealthResult {
  if (!farm) {
    return {
      score: null,
      status: 'Not enough data',
      explanation: 'No farm is selected yet. Add or select a farm to generate a Farm Health score.',
      dataAvailable: false,
    };
  }

  const requiredFields = [
    farm.name,
    farm.location,
    farm.area,
    farm.ownerName,
    farm.surveyNumber,
    farm.village,
    farm.taluk,
    farm.district,
    farm.state,
    farm.landClassification,
    farm.currentSeason,
    farm.currentCrop,
  ];

  const filledFields = requiredFields.filter((value) => value && value.trim().length > 0 && !missingOrPending(value)).length;
  const profileCompleteness = Math.round((filledFields / requiredFields.length) * 100);

  const records = Math.min(farm.documents.length + farm.timeline.length + activities.length, 10);
  const dataScore = Math.min(Math.round((records / 10) * 100), 100);

  const sustainabilityScore = Math.min(100, Math.max(0, parseScoreString(farm.soil.sustainabilityScore)));

  const environmentSignals = [
    farm.soil.moisture,
    farm.soil.organicMatter,
    farm.weather.rainfall,
    farm.weather.forecast,
    farm.satellite.coverage,
    farm.satellite.trend,
  ];
  const availableSignals = environmentSignals.filter((value) => value && !missingOrPending(value)).length;
  const environmentScore = Math.min(100, Math.round((availableSignals / environmentSignals.length) * 100));

  const weightedScore = Math.round(
    profileCompleteness * 0.35 +
      dataScore * 0.25 +
      sustainabilityScore * 0.25 +
      environmentScore * 0.15,
  );

  const totalSignals = records + filledFields + sustainabilityScore + availableSignals;
  if (totalSignals <= 3 || (farm.documents.length === 0 && farm.timeline.length === 0 && activities.length === 0)) {
    return {
      score: null,
      status: 'Not enough data',
      explanation: 'Farm profile, document record, activity history, or sustainability metrics are still too limited to score this farm safely.',
      dataAvailable: false,
    };
  }

  const healthStatus = scoreStatus(Math.round(weightedScore));
  const reasons = [];

  if (profileCompleteness < 80) {
    reasons.push('profile completeness is incomplete');
  }

  if (records < 4) {
    reasons.push('recorded documents, timeline events, or activities are limited');
  }

  if (sustainabilityScore < 70) {
    reasons.push('sustainability metrics are below a strong baseline');
  }

  if (environmentScore < 70) {
    reasons.push('environmental or soil-weather signals are still sparse');
  }

  const explanation = reasons.length > 0
    ? `Score reflects ${reasons.join(', ')}. ${farm.name} has ${farm.documents.length} documents, ${farm.timeline.length} timeline events, and ${activities.length} recorded activities.`
    : `Profile completeness, recorded activity/data, sustainability score, and environmental signals are all visible. ${farm.name} has ${farm.documents.length} documents, ${farm.timeline.length} timeline events, and ${activities.length} recorded activities.`;

  return {
    score: Math.min(100, Math.max(0, weightedScore)),
    status: healthStatus,
    explanation,
    dataAvailable: true,
  };
}
