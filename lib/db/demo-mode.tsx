'use client';

/**
 * HER TURN - Demo Mode Provider & Hook
 * 
 * Manages demo mode state, seeded mock data loading, and synchronization
 * with localStorage. When Demo Mode is active or Supabase credentials are
 * absent, all views seamlessly run on Priya Sharma's rich medical records.
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { mockUser, DEMO_USER_ID } from './mock-data';
import { isSupabaseConfigured } from './supabase';
import { resetLocalDemoData } from './queries';
import type { UserProfile } from '@/lib/types';

export const DEMO_ACCOUNT_ID = DEMO_USER_ID;
const STORAGE_KEY = 'her_turn_demo_mode';

interface DemoModeContextType {
  isDemoMode: boolean;
  demoUser: UserProfile;
  setDemoMode: (enabled: boolean) => void;
  resetDemoData: () => void;
  isBackendConfigured: boolean;
}

const DemoModeContext = createContext<DemoModeContextType | null>(null);

export interface DemoModeProviderProps {
  children: React.ReactNode;
  initialDemoMode?: boolean;
}

export function DemoModeProvider({ children, initialDemoMode }: DemoModeProviderProps) {
  const backendConfigured = isSupabaseConfigured();

  // If backend is not configured, we force demo mode to true.
  // Otherwise check local storage or use initial value.
  const [isDemoMode, setIsDemoModeState] = useState<boolean>(() => {
    if (!backendConfigured) return true;
    if (initialDemoMode !== undefined) return initialDemoMode;
    return true; // Default to demo mode for initial out-of-the-box experience
  });

  // Hydrate preference from localStorage on browser mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!backendConfigured) {
      setIsDemoModeState(true);
      window.localStorage.setItem(STORAGE_KEY, 'true');
      return;
    }

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        setIsDemoModeState(saved === 'true');
      }
    } catch (e) {
      console.warn('[DemoMode] Unable to access localStorage:', e);
    }
  }, [backendConfigured]);

  const setDemoMode = useCallback((enabled: boolean) => {
    if (!backendConfigured && !enabled) {
      console.info('[DemoMode] Supabase is not configured yet. Remaining in Demo Mode.');
      return;
    }

    setIsDemoModeState(enabled);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
      } catch (e) {
        console.warn('[DemoMode] Unable to write to localStorage:', e);
      }
    }
  }, [backendConfigured]);

  const resetDemoData = useCallback(() => {
    resetLocalDemoData();
    console.info('[DemoMode] Mock data reset to initial seeds.');
  }, []);

  const value = useMemo<DemoModeContextType>(
    () => ({
      isDemoMode,
      demoUser: mockUser,
      setDemoMode,
      resetDemoData,
      isBackendConfigured: backendConfigured,
    }),
    [isDemoMode, backendConfigured, setDemoMode, resetDemoData]
  );

  return (
    <DemoModeContext.Provider value={value}>
      {children}
    </DemoModeContext.Provider>
  );
}

/**
 * Hook to consume Demo Mode context across components.
 * Returns { isDemoMode, demoUser, setDemoMode, resetDemoData, isBackendConfigured }
 */
export function useDemoMode(): DemoModeContextType {
  const context = useContext(DemoModeContext);
  if (!context) {
    // Graceful fallback for components rendered outside provider
    return {
      isDemoMode: true,
      demoUser: mockUser,
      setDemoMode: () => {},
      resetDemoData: () => {},
      isBackendConfigured: false,
    };
  }
  return context;
}
