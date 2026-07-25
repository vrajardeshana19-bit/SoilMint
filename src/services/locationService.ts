export type ReverseGeocodeResult = {
  country: string;
  state: string;
  district: string;
  city: string;
  village: string;
  latitude: number;
  longitude: number;
};

export type LocationErrorType = 'unsupported' | 'permission-denied' | 'unavailable' | 'timeout' | 'geocoding-failed' | 'unknown';

export type LocationLookupResult = {
  success: boolean;
  data?: ReverseGeocodeResult;
  error?: {
    type: LocationErrorType;
    message: string;
  };
};

function getDefaultMessage(errorType: LocationErrorType) {
  switch (errorType) {
    case 'permission-denied':
      return 'Location access was denied. Please allow browser permission and try again.';
    case 'unavailable':
      return 'Location services are unavailable on this device right now. Please try again later.';
    case 'timeout':
      return 'Location detection timed out. Please try again.';
    case 'geocoding-failed':
      return 'We could not identify your location right now. Please try again in a moment.';
    case 'unsupported':
      return 'This browser does not support location services.';
    default:
      return 'We could not detect your location right now. Please try again.';
  }
}

function parseAddress(address: Record<string, string | undefined>): ReverseGeocodeResult {
  const city = address.city || address.town || address.village || address.hamlet || address.suburb || address.municipality || '';
  const village = address.village || '';
  const district = address.county || address.district || address.state_district || '';
  const state = address.state || '';
  const country = address.country || '';

  return {
    country,
    state,
    district,
    city: city || village,
    village,
    latitude: 0,
    longitude: 0,
  };
}

export async function reverseGeocodeLocation(latitude: number, longitude: number): Promise<LocationLookupResult> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Reverse geocoding failed');
    }

    const data = (await response.json()) as { address?: Record<string, string | undefined> };
    const address = data.address ?? {};
    const parsed = parseAddress(address);

    if (!parsed.state || !parsed.country) {
      return {
        success: false,
        error: {
          type: 'geocoding-failed',
          message: getDefaultMessage('geocoding-failed'),
        },
      };
    }

    return {
      success: true,
      data: {
        ...parsed,
        latitude,
        longitude,
      },
    };
  } catch {
    return {
      success: false,
      error: {
        type: 'geocoding-failed',
        message: getDefaultMessage('geocoding-failed'),
      },
    };
  }
}

export async function getCurrentLocationData(): Promise<LocationLookupResult> {
  if (typeof window === 'undefined' || !('geolocation' in navigator)) {
    return {
      success: false,
      error: {
        type: 'unsupported',
        message: getDefaultMessage('unsupported'),
      },
    };
  }

  return new Promise((resolve) => {
    const timeoutId = window.setTimeout(() => {
      resolve({
        success: false,
        error: {
          type: 'timeout',
          message: getDefaultMessage('timeout'),
        },
      });
    }, 10000);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        window.clearTimeout(timeoutId);
        const geocodeResult = await reverseGeocodeLocation(position.coords.latitude, position.coords.longitude);
        resolve(geocodeResult);
      },
      (error) => {
        window.clearTimeout(timeoutId);
        let errorType: LocationErrorType = 'unknown';
        let message = getDefaultMessage('unknown');

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorType = 'permission-denied';
            message = getDefaultMessage('permission-denied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorType = 'unavailable';
            message = getDefaultMessage('unavailable');
            break;
          case error.TIMEOUT:
            errorType = 'timeout';
            message = getDefaultMessage('timeout');
            break;
          default:
            errorType = 'unknown';
            message = getDefaultMessage('unknown');
        }

        resolve({
          success: false,
          error: {
            type: errorType,
            message,
          },
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000,
      },
    );
  });
}
