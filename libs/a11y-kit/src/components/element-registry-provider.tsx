'use client';

import {
  createContext,
  type ReactNode,
  type RefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';

interface RegisteredElement {
  ref: RefObject<HTMLDivElement | null>;
  label: string;
  instanceId: string;
}

interface ElementRegistryContextValue {
  register: (entry: RegisteredElement) => void;
  unregister: (instanceId: string) => void;
  getElement: (instanceId: string) => RegisteredElement | undefined;
  getAllElements: () => RegisteredElement[];
}

const ElementRegistryContext = createContext<ElementRegistryContextValue | null>(null);

export const useElementRegistry = () => {
  const context = useContext(ElementRegistryContext);
  if (!context) {
    throw new Error('useElementRegistry must be used within an ElementRegistryProvider.');
  }
  return context;
};

export const ElementRegistryProvider = ({ children }: { children: ReactNode }) => {
  const registryRef = useRef<Map<string, RegisteredElement>>(new Map());

  const register = useCallback((entry: RegisteredElement) => {
    registryRef.current.set(entry.instanceId, entry);
  }, []);

  const unregister = useCallback((instanceId: string) => {
    registryRef.current.delete(instanceId);
  }, []);

  const getElement = useCallback((instanceId: string) => {
    return registryRef.current.get(instanceId);
  }, []);

  const getAllElements = useCallback(() => {
    return Array.from(registryRef.current.values());
  }, []);

  const value = useMemo(
    () => ({ register, unregister, getElement, getAllElements }),
    [register, unregister, getElement, getAllElements],
  );

  return (
    <ElementRegistryContext.Provider value={value}>{children}</ElementRegistryContext.Provider>
  );
};
