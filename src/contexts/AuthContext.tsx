import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type User = {
  id: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  accountType: 'farmer' | 'buyer' | 'verifier';
  farms: string[];
  farmName?: string;
  location?: string;
  completedProfile: boolean;
  onboarded: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (payload: Omit<User, 'id' | 'farms' | 'farmName' | 'location' | 'completedProfile' | 'onboarded'>) => boolean;
  logout: () => void;
  completeProfile: (name: string, phone: string, farmName?: string, location?: string) => void;
  completeOnboarding: () => void;
  setAccountType: (accountType: User['accountType']) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'soilmint-auth';

function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser);

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = (email: string, password: string) => {
    const stored = getStoredUser();
    if (!stored) return false;
    const match = stored.email.toLowerCase() === email.toLowerCase() && stored.password === password;
    if (!match) return false;
    setUser(stored);
    return true;
  };

  const signup = (payload: Omit<User, 'id' | 'farms' | 'farmName' | 'location' | 'completedProfile' | 'onboarded'>) => {
    const nextUser: User = {
      id: `${Date.now()}`,
      farms: [],
      completedProfile: false,
      onboarded: false,
      ...payload,
    };
    setUser(nextUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const completeProfile = (name: string, phone: string, farmName?: string, location?: string) => {
    setUser((current) => (current ? {
      ...current,
      name,
      phone,
      farmName: farmName?.trim() || current.farmName || '',
      location: location?.trim() || current.location || '',
      completedProfile: true,
    } : current));
  };

  const completeOnboarding = () => {
    setUser((current) => (current ? { ...current, onboarded: true } : current));
  };

  const setAccountType = (accountType: User['accountType']) => {
    setUser((current) => (current ? { ...current, accountType } : current));
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout,
      completeProfile,
      completeOnboarding,
      setAccountType,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
