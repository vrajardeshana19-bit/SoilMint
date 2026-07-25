import { useCallback, useEffect, useRef, useState } from 'react';
import { getCurrentLocationData } from '../services/locationService';

export type UseCurrentLocationStatus = 'idle' | 'loading' | 'success' | 'error';

export type UseCurrentLocationResult = {
  status: UseCurrentLocationStatus;
  errorMessage: string | null;
  location: {
    city: string;
    district: string;
    state: string;
    country: string;
  } | null;
  refresh: () => Promise<void>;
};

export function useCurrentLocation() {
  const [status, setStatus] = useState<UseCurrentLocationStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [location, setLocation] = useState<UseCurrentLocationResult['location']>(null);
  const hasResolvedRef = useRef(false);

  const refresh = useCallback(async () => {
    if (hasResolvedRef.current && status === 'success' && location) {
      return;
    }

    setStatus('loading');
    setErrorMessage(null);

    const result = await getCurrentLocationData();

    if (result.success && result.data) {
      const resolvedLocation = {
        city: result.data.city || result.data.village || 'Your location',
        district: result.data.district || 'Unknown district',
        state: result.data.state || 'Unknown state',
        country: result.data.country || 'Unknown country',
      };

      setLocation(resolvedLocation);
      setStatus('success');
      hasResolvedRef.current = true;
      return;
    }

    setLocation(null);
    setErrorMessage(result.error?.message ?? 'Unable to detect your location right now.');
    setStatus('error');
    hasResolvedRef.current = true;
  }, [location, status]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    status,
    errorMessage,
    location,
    refresh,
  };
}
