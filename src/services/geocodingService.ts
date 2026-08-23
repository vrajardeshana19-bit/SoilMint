export type AdministrativeLocationQuery = {
  village?: string | null;
  taluk?: string | null;
  district?: string | null;
  state?: string | null;
  country?: string;
};

export type GeocodedLocation = AdministrativeLocationQuery & {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  confidence: number;
};

export type GeocodingResult =
  | { status: 'resolved'; location: GeocodedLocation }
  | { status: 'not-found' | 'ambiguous' | 'unavailable'; message: string; candidates: GeocodedLocation[] };

const NOMINATIM_URL = import.meta.env.VITE_GEOCODING_URL || 'https://nominatim.openstreetmap.org/search';

function cleanPart(value?: string | null) {
  const cleaned = value?.trim();
  return cleaned && cleaned.toLowerCase() !== 'not detected' && cleaned.toLowerCase() !== 'pending' ? cleaned : null;
}

function buildQuery(query: AdministrativeLocationQuery) {
  return [query.village, query.taluk, query.district, query.state, query.country || 'India']
    .map(cleanPart)
    .filter(Boolean)
    .join(', ');
}

function toLocation(item: { lat: string; lon: string; display_name: string; address?: Record<string, string> }): GeocodedLocation {
  const address = item.address || {};
  return {
    latitude: Number(item.lat),
    longitude: Number(item.lon),
    formattedAddress: item.display_name,
    village: address.village || address.hamlet || address.suburb || null,
    taluk: address.municipality || address.town || address.city_district || null,
    district: address.state_district || address.county || null,
    state: address.state || null,
    country: address.country || 'India',
    confidence: 70,
  };
}

export async function geocodeFarmLocation(query: AdministrativeLocationQuery, signal?: AbortSignal): Promise<GeocodingResult> {
  const search = buildQuery(query);
  if (!search) {
    return { status: 'not-found', message: 'No location information was detected in the land record.', candidates: [] };
  }

  try {
    const url = new URL(NOMINATIM_URL);
    url.searchParams.set('q', search);
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('limit', '5');
    url.searchParams.set('countrycodes', 'in');

    const response = await fetch(url, { signal, headers: { Accept: 'application/json' } });
    if (!response.ok) {
      return { status: 'unavailable', message: 'Location service is unavailable. Search for the location manually.', candidates: [] };
    }

    const candidates = (await response.json() as Array<{ lat: string; lon: string; display_name: string; address?: Record<string, string> }>)
      .map(toLocation)
      .filter((location) => Number.isFinite(location.latitude) && Number.isFinite(location.longitude));

    if (candidates.length === 0) {
      return { status: 'not-found', message: `Could not resolve “${search}”. Search for the farm location manually.`, candidates: [] };
    }
    if (candidates.length > 1) {
      return { status: 'ambiguous', message: 'More than one location matched the land-record details. Select the correct result.', candidates };
    }
    return { status: 'resolved', location: candidates[0] };
  } catch {
    return { status: 'unavailable', message: 'Location service could not be reached. Search for the farm location manually.', candidates: [] };
  }
}

export function resolveAdministrativeLocation(record: AdministrativeLocationQuery, signal?: AbortSignal) {
  return geocodeFarmLocation(record, signal);
}
