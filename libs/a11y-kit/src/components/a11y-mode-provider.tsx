'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

interface A11yModeContextValue {
  isAccessible: boolean;
  toggle: () => void;
}

const A11yModeContext = createContext<A11yModeContextValue>({
  isAccessible: false,
  toggle: () => {},
});

const STORAGE_KEY = 'a11y-kit-mode';

export const A11yModeProvider = ({
  children,
  storageKey = STORAGE_KEY,
  forceBroken = false,
}: {
  children: ReactNode;
  storageKey?: string;
  forceBroken?: boolean;
}) => {
  const [isAccessible, setIsAccessible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (forceBroken) {
      setMounted(true);
      return;
    }
    const stored = sessionStorage.getItem(storageKey);
    if (stored === 'true') {
      setIsAccessible(true);
    }
    setMounted(true);
  }, [storageKey, forceBroken]);

  useEffect(() => {
    if (mounted && !forceBroken) {
      sessionStorage.setItem(storageKey, String(isAccessible));
    }
  }, [isAccessible, mounted, storageKey, forceBroken]);

  const toggle = () => {
    if (!forceBroken) {
      setIsAccessible((prev) => !prev);
    }
  };

  const effectiveAccessible = forceBroken ? false : isAccessible;

  return (
    <A11yModeContext.Provider value={{ isAccessible: effectiveAccessible, toggle }}>
      {children}
    </A11yModeContext.Provider>
  );
};

export const useA11yMode = () => {
  return useContext(A11yModeContext);
};
