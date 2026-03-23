'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface IssueLoggerPanelContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const IssueLoggerPanelContext = createContext<IssueLoggerPanelContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
});

export const IssueLoggerPanelProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const value = useMemo(() => ({ isOpen, open, close, toggle }), [isOpen, open, close, toggle]);

  return (
    <IssueLoggerPanelContext.Provider value={value}>{children}</IssueLoggerPanelContext.Provider>
  );
};

export const useIssueLoggerPanel = () => useContext(IssueLoggerPanelContext);
