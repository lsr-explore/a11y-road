'use client';

import { createContext, type ReactNode, useCallback, useContext, useState } from 'react';

interface A11yNamesContextValue {
  isOn: boolean;
  toggle: () => void;
  setOn: (on: boolean) => void;
}

const A11yNamesContext = createContext<A11yNamesContextValue>({
  isOn: false,
  toggle: () => {},
  setOn: () => {},
});

export const A11yNamesProvider = ({ children }: { children: ReactNode }) => {
  const [isOn, setIsOn] = useState(false);
  const toggle = useCallback(() => setIsOn((prev) => !prev), []);
  const setOn = useCallback((on: boolean) => setIsOn(on), []);

  return (
    <A11yNamesContext.Provider value={{ isOn, toggle, setOn }}>
      {children}
    </A11yNamesContext.Provider>
  );
};

export const useA11yNames = () => useContext(A11yNamesContext);
