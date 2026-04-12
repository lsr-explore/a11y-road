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
  unregister: (instanceId: string, ref?: RefObject<HTMLDivElement | null>) => void;
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
  const registryRef = useRef<Map<string, RegisteredElement[]>>(new Map());

  const register = useCallback((entry: RegisteredElement) => {
    const existing = registryRef.current.get(entry.instanceId) ?? [];
    existing.push(entry);
    registryRef.current.set(entry.instanceId, existing);
  }, []);

  const unregister = useCallback((instanceId: string, ref?: RefObject<HTMLDivElement | null>) => {
    if (ref) {
      const entries = registryRef.current.get(instanceId);
      if (entries) {
        const filtered = entries.filter((entry) => entry.ref !== ref);
        if (filtered.length === 0) {
          registryRef.current.delete(instanceId);
        } else {
          registryRef.current.set(instanceId, filtered);
        }
      }
    } else {
      registryRef.current.delete(instanceId);
    }
  }, []);

  const getElement = useCallback((instanceId: string) => {
    const entries = registryRef.current.get(instanceId);
    return entries?.[0];
  }, []);

  const getAllElements = useCallback(() => {
    return Array.from(registryRef.current.values()).flat();
  }, []);

  const value = useMemo(
    () => ({ register, unregister, getElement, getAllElements }),
    [register, unregister, getElement, getAllElements],
  );

  return (
    <ElementRegistryContext.Provider value={value}>{children}</ElementRegistryContext.Provider>
  );
};
