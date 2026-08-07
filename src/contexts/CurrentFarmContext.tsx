import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useFarms, type Farm } from './FarmsContext';

type CurrentFarmContextValue = {
  currentFarmId: string | null;
  currentFarm: Farm | undefined;
  setCurrentFarmId: (farmId: string | null) => void;
};

const CurrentFarmContext = createContext<CurrentFarmContextValue | undefined>(undefined);
const STORAGE_KEY = 'soilmint-current-farm';

function readStoredCurrentFarm() {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored ?? null;
}

export function CurrentFarmProvider({ children }: { children: ReactNode }) {
  const { farms } = useFarms();
  const [currentFarmId, setCurrentFarmId] = useState<string | null>(() => readStoredCurrentFarm());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (currentFarmId) {
        window.localStorage.setItem(STORAGE_KEY, currentFarmId);
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [currentFarmId]);

  useEffect(() => {
    if (!farms.length) {
      setCurrentFarmId(null);
      return;
    }

    if (!currentFarmId || !farms.some((farm) => farm.id === currentFarmId)) {
      setCurrentFarmId(farms[0].id);
    }
  }, [farms, currentFarmId]);

  const currentFarm = useMemo(
    () => farms.find((farm) => farm.id === currentFarmId),
    [farms, currentFarmId],
  );

  const value = useMemo(
    () => ({ currentFarmId, currentFarm, setCurrentFarmId }),
    [currentFarmId, currentFarm],
  );

  return <CurrentFarmContext.Provider value={value}>{children}</CurrentFarmContext.Provider>;
}

export function useCurrentFarm() {
  const context = useContext(CurrentFarmContext);
  if (!context) {
    throw new Error('useCurrentFarm must be used inside CurrentFarmProvider');
  }

  return context;
}
