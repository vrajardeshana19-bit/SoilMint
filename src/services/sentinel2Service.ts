/**
 * Sentinel-2 Satellite Data Service
 * Handles satellite data discovery, search, and metadata management
 * Uses Copernicus Data Space Ecosystem API
 */

export type GeoJSONPolygon = {
  type: 'Polygon';
  coordinates: number[][][];
};

export type FarmBoundary = {
  id: string;
  geometry: GeoJSONPolygon;
  areaSquareMeters: number;
  areaHectares: number;
  areaAcres: number;
  latitude: number;
  longitude: number;
  status: 'pending' | 'confirmed' | 'invalid';
  confirmedAt: string | null;
};

export type SatelliteMetadata = {
  id: string;
  satelliteMission: string;
  productId: string;
  acquisitionDate: string;
  sensingTime: string;
  cloudCoverage: number;
  thumbnailUrl: string | null;
  processingLevel: string;
  dataSource: string;
  status: 'discovered' | 'selected' | 'processing' | 'ready' | 'failed';
};

export type SatelliteObservation = {
  id: string;
  farmId: string;
  metadata: SatelliteMetadata;
  boundaryAOI: GeoJSONPolygon;
  discoveredAt: string;
  lastUpdated: string;
  status: 'searching' | 'found' | 'no_data' | 'cloudy' | 'ready' | 'failed';
  message: string;
};

/**
 * Calculate the area of a polygon in square meters using the Shoelace formula
 */
export function calculatePolygonArea(polygon: GeoJSONPolygon): number {
  const coordinates = polygon.coordinates[0];

  // Shoelace formula for geographic coordinates
  let area = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    const [lon1, lat1] = coordinates[i];
    const [lon2, lat2] = coordinates[i + 1];

    // Simplified approximation (real calculation needs more precision)
    // Using rough conversion: 1 degree ≈ 111,320 meters at equator
    const dLon = (lon2 - lon1) * 111320 * Math.cos(((lat1 + lat2) / 2) * (Math.PI / 180));
    const dLat = (lat2 - lat1) * 110540;
    area += dLon * dLat;
  }

  return Math.abs(area / 2);
}

/**
 * Convert square meters to hectares
 */
export function squareMetersToHectares(squareMeters: number): number {
  return squareMeters / 10000;
}

/**
 * Convert square meters to acres
 */
export function squareMetersToAcres(squareMeters: number): number {
  return squareMeters / 4047;
}

/**
 * Convert acres to square meters
 */
export function acresToSquareMeters(acres: number): string {
  const sqMeters = acres * 4047;
  return squareMetersToAcres(sqMeters).toFixed(2);
}

/**
 * Create a farm boundary from polygon coordinates
 */
export function createFarmBoundary(
  geometry: GeoJSONPolygon,
  farmId: string,
): FarmBoundary {
  const areaSquareMeters = calculatePolygonArea(geometry);
  const areaHectares = squareMetersToHectares(areaSquareMeters);
  const areaAcres = squareMetersToAcres(areaSquareMeters);

  // Calculate centroid for latitude/longitude
  const coordinates = geometry.coordinates[0];
  let lat = 0,
    lon = 0;
  for (const [x, y] of coordinates) {
    lon += x;
    lat += y;
  }
  lat /= coordinates.length;
  lon /= coordinates.length;

  return {
    id: `boundary-${farmId}-${Date.now()}`,
    geometry,
    areaSquareMeters,
    areaHectares,
    areaAcres,
    latitude: lat,
    longitude: lon,
    status: 'pending',
    confirmedAt: null,
  };
}

/**
 * Search for Sentinel-2 imagery intersecting a farm boundary
 * In production, this would query the Copernicus Data Space Ecosystem API
 */
export async function searchSentinel2Imagery(
  boundary: FarmBoundary,
  options?: {
    startDate?: string;
    endDate?: string;
    maxCloudCoverage?: number;
  },
): Promise<SatelliteMetadata[]> {
  const endpoint = import.meta.env.VITE_SENTINEL2_SEARCH_URL;
  if (!endpoint) {
    return [];
  }

  const maxCloud = options?.maxCloudCoverage ?? 30;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      aoi: boundary.geometry,
      startDate: options?.startDate,
      endDate: options?.endDate,
      maxCloudCoverage: maxCloud,
      processingLevel: 'Level-2A',
    }),
  });
  if (!response.ok) {
    throw new Error('Satellite data provider unavailable');
  }
  const results = await response.json() as SatelliteMetadata[];
  return results.filter((result) => result.cloudCoverage <= maxCloud);
}

/**
 * Get the best farm observation from available satellite imagery
 */
export function getBestFarmObservation(metadata: SatelliteMetadata[]): SatelliteMetadata | null {
  if (metadata.length === 0) {
    return null;
  }

  // Sort by: lowest cloud coverage, then most recent
  const sorted = [...metadata].sort((a, b) => {
    if (a.cloudCoverage !== b.cloudCoverage) {
      return a.cloudCoverage - b.cloudCoverage;
    }
    return new Date(b.acquisitionDate).getTime() - new Date(a.acquisitionDate).getTime();
  });

  return sorted[0];
}

/**
 * Create a satellite observation record
 */
export function createSatelliteObservation(
  farmId: string,
  boundary: FarmBoundary,
  metadata: SatelliteMetadata,
): SatelliteObservation {
  return {
    id: `obs-${farmId}-${Date.now()}`,
    farmId,
    metadata,
    boundaryAOI: boundary.geometry,
    discoveredAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    status: 'found',
    message: `Found ${metadata.satelliteMission} imagery from ${metadata.acquisitionDate} with ${metadata.cloudCoverage}% cloud coverage.`,
  };
}

/**
 * Search and identify the best satellite observation for a farm
 */
export async function getBestSatelliteDataForFarm(
  farmId: string,
  boundary: FarmBoundary,
  options?: {
    startDate?: string;
    endDate?: string;
    maxCloudCoverage?: number;
  },
): Promise<SatelliteObservation> {
  try {
    // Search for available imagery
    const imagery = await searchSentinel2Imagery(boundary, options);

    if (imagery.length === 0) {
      return {
        id: `obs-${farmId}-${Date.now()}`,
        farmId,
        metadata: {
          id: `S2-${Date.now()}-none`,
          satelliteMission: 'Sentinel-2',
          productId: 'None',
          acquisitionDate: 'N/A',
          sensingTime: 'N/A',
          cloudCoverage: 100,
          thumbnailUrl: null,
          processingLevel: 'N/A',
          dataSource: 'Copernicus Data Space Ecosystem',
          status: 'failed',
        },
        boundaryAOI: boundary.geometry,
        discoveredAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        status: 'no_data',
        message: import.meta.env.VITE_SENTINEL2_SEARCH_URL
          ? 'No suitable Sentinel-2 imagery found for the specified date range and cloud coverage threshold.'
          : 'Satellite connection not configured. Connect a Copernicus service to search this boundary.',
      };
    }

    // Find the best imagery
    const best = getBestFarmObservation(imagery);

    if (!best) {
      return {
        id: `obs-${farmId}-${Date.now()}`,
        farmId,
        metadata: {
          id: `S2-${Date.now()}-none`,
          satelliteMission: 'Sentinel-2',
          productId: 'None',
          acquisitionDate: 'N/A',
          sensingTime: 'N/A',
          cloudCoverage: 100,
          thumbnailUrl: null,
          processingLevel: 'N/A',
          dataSource: 'Copernicus Data Space Ecosystem',
          status: 'failed',
        },
        boundaryAOI: boundary.geometry,
        discoveredAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        status: 'no_data',
        message: 'Could not identify suitable satellite observation.',
      };
    }

    return createSatelliteObservation(farmId, boundary, best);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to search satellite imagery';

    return {
      id: `obs-${farmId}-${Date.now()}`,
      farmId,
      metadata: {
        id: `S2-${Date.now()}-error`,
        satelliteMission: 'Sentinel-2',
        productId: 'Error',
        acquisitionDate: 'N/A',
        sensingTime: 'N/A',
        cloudCoverage: 0,
        thumbnailUrl: null,
        processingLevel: 'N/A',
        dataSource: 'Copernicus Data Space Ecosystem',
        status: 'failed',
      },
      boundaryAOI: boundary.geometry,
      discoveredAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: 'failed',
      message: `Satellite data search failed: ${errorMessage}`,
    };
  }
}

/**
 * Format boundary area for display
 */
export function formatBoundaryArea(boundary: FarmBoundary): string {
  return `${boundary.areaAcres.toFixed(2)} acres (${boundary.areaHectares.toFixed(2)} ha)`;
}

/**
 * Compare government record area with boundary area
 */
export function compareBoundaryWithRecord(
  boundaryArea: string,
  recordArea: string,
): {
  differs: boolean;
  message: string;
} {
  try {
    // Extract numeric values
    const boundaryMatch = boundaryArea.match(/[\d.]+/);
    const recordMatch = recordArea.match(/[\d.]+/);

    if (!boundaryMatch || !recordMatch) {
      return { differs: false, message: 'Unable to compare areas.' };
    }

    const boundaryNum = parseFloat(boundaryMatch[0]);
    const recordNum = parseFloat(recordMatch[0]);

    const difference = Math.abs(boundaryNum - recordNum);
    const percentDiff = (difference / recordNum) * 100;

    if (percentDiff > 10) {
      return {
        differs: true,
        message: `Boundary area (${boundaryArea}) differs significantly from government record area (${recordArea}). Difference: ${percentDiff.toFixed(1)}%`,
      };
    }

    return {
      differs: false,
      message: `Areas are similar. Boundary: ${boundaryArea}, Record: ${recordArea}`,
    };
  } catch {
    return { differs: false, message: 'Could not compare areas.' };
  }
}
