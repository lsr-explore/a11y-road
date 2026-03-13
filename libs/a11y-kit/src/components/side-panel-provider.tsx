'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

interface SidePanelContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const SidePanelContext = createContext<SidePanelContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
});

export const SidePanelProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidePanelContext.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        toggle: () => setIsOpen((prev) => !prev),
      }}
    >
      {children}
    </SidePanelContext.Provider>
  );
};

export const useSidePanel = () => {
  return useContext(SidePanelContext);
};
