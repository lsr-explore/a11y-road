'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface A11yModeContextValue {
  isAccessible: boolean;
  toggle: () => void;
}

const A11yModeContext = createContext<A11yModeContextValue>({
  isAccessible: false,
  toggle: () => {},
});

const STORAGE_KEY = 'a11y-kit-mode';

export function A11yModeProvider({
  children,
  storageKey = STORAGE_KEY,
}: {
  children: ReactNode;
  storageKey?: string;
}) {
  const [isAccessible, setIsAccessible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(storageKey);
    if (stored === 'true') {
      setIsAccessible(true);
    }
    setMounted(true);
  }, [storageKey]);

  useEffect(() => {
    if (mounted) {
      sessionStorage.setItem(storageKey, String(isAccessible));
    }
  }, [isAccessible, mounted, storageKey]);

  const toggle = () => setIsAccessible((prev) => !prev);

  return (
    <A11yModeContext.Provider value={{ isAccessible, toggle }}>
      {children}
    </A11yModeContext.Provider>
  );
}

export function useA11yMode() {
  return useContext(A11yModeContext);
}
