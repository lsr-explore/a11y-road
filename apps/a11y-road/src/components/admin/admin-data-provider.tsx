'use client';

import type { A11yIssueDefinition, A11yIssueInstance } from '@a11y-road/a11y-kit';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { IssueSet } from '../../data/evaluation-types';
import defaultIssueSets from '../../data/issue-sets.json';
import { issueDefinitions as defaultDefinitions, registry } from '../../data/issues-registry';

const DEFINITIONS_KEY = 'a11y-road-admin-definitions';
const INSTANCES_KEY = 'a11y-road-admin-instances';
const ISSUE_SETS_KEY = 'a11y-road-issue-sets';

interface AdminDataContextValue {
  definitions: A11yIssueDefinition[];
  instances: A11yIssueInstance[];
  issueSets: IssueSet[];
  isDirty: boolean;
  addDefinition: (definition: A11yIssueDefinition) => void;
  updateDefinition: (id: string, updates: Partial<A11yIssueDefinition>) => void;
  deleteDefinition: (id: string) => void;
  addInstance: (instance: A11yIssueInstance) => void;
  updateInstance: (id: string, updates: Partial<A11yIssueInstance>) => void;
  deleteInstance: (id: string) => void;
  addIssueSet: (issueSet: IssueSet) => void;
  updateIssueSet: (id: string, updates: Partial<IssueSet>) => void;
  deleteIssueSet: (id: string) => void;
  resetToDefaults: () => void;
}

const AdminDataContext = createContext<AdminDataContextValue>({
  definitions: [],
  instances: [],
  issueSets: [],
  isDirty: false,
  addDefinition: () => {},
  updateDefinition: () => {},
  deleteDefinition: () => {},
  addInstance: () => {},
  updateInstance: () => {},
  deleteInstance: () => {},
  addIssueSet: () => {},
  updateIssueSet: () => {},
  deleteIssueSet: () => {},
  resetToDefaults: () => {},
});

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = <T,>(key: string, data: T) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};

const defaultInstances = registry.getInstances();

export const AdminDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [definitions, setDefinitions] = useState<A11yIssueDefinition[]>(defaultDefinitions);
  const [instances, setInstances] = useState<A11yIssueInstance[]>(defaultInstances);
  const [issueSets, setIssueSets] = useState<IssueSet[]>(defaultIssueSets as IssueSet[]);
  const [isDirty, setIsDirty] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDefinitions(loadFromStorage(DEFINITIONS_KEY, defaultDefinitions));
    setInstances(loadFromStorage(INSTANCES_KEY, defaultInstances));
    setIssueSets(loadFromStorage(ISSUE_SETS_KEY, defaultIssueSets as IssueSet[]));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      saveToStorage(DEFINITIONS_KEY, definitions);
      saveToStorage(INSTANCES_KEY, instances);
      saveToStorage(ISSUE_SETS_KEY, issueSets);
    }
  }, [definitions, instances, issueSets, mounted]);

  const addDefinition = useCallback((definition: A11yIssueDefinition) => {
    setDefinitions((prev) => [...prev, definition]);
    setIsDirty(true);
  }, []);

  const updateDefinition = useCallback((id: string, updates: Partial<A11yIssueDefinition>) => {
    setDefinitions((prev) => prev.map((def) => (def.id === id ? { ...def, ...updates } : def)));
    setIsDirty(true);
  }, []);

  const deleteDefinition = useCallback((id: string) => {
    setDefinitions((prev) => prev.filter((def) => def.id !== id));
    setIsDirty(true);
  }, []);

  const addInstance = useCallback((instance: A11yIssueInstance) => {
    setInstances((prev) => [...prev, instance]);
    setIsDirty(true);
  }, []);

  const updateInstance = useCallback((id: string, updates: Partial<A11yIssueInstance>) => {
    setInstances((prev) => prev.map((inst) => (inst.id === id ? { ...inst, ...updates } : inst)));
    setIsDirty(true);
  }, []);

  const deleteInstance = useCallback((id: string) => {
    setInstances((prev) => prev.filter((inst) => inst.id !== id));
    setIsDirty(true);
  }, []);

  const addIssueSet = useCallback((issueSet: IssueSet) => {
    setIssueSets((prev) => [...prev, issueSet]);
    setIsDirty(true);
  }, []);

  const updateIssueSet = useCallback((id: string, updates: Partial<IssueSet>) => {
    setIssueSets((prev) => prev.map((set) => (set.id === id ? { ...set, ...updates } : set)));
    setIsDirty(true);
  }, []);

  const deleteIssueSet = useCallback((id: string) => {
    setIssueSets((prev) => prev.filter((set) => set.id !== id));
    setIsDirty(true);
  }, []);

  const resetToDefaults = useCallback(() => {
    setDefinitions(defaultDefinitions);
    setInstances(defaultInstances);
    setIssueSets(defaultIssueSets as IssueSet[]);
    setIsDirty(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DEFINITIONS_KEY);
      localStorage.removeItem(INSTANCES_KEY);
      localStorage.removeItem(ISSUE_SETS_KEY);
    }
  }, []);

  const value = useMemo<AdminDataContextValue>(
    () => ({
      definitions,
      instances,
      issueSets,
      isDirty,
      addDefinition,
      updateDefinition,
      deleteDefinition,
      addInstance,
      updateInstance,
      deleteInstance,
      addIssueSet,
      updateIssueSet,
      deleteIssueSet,
      resetToDefaults,
    }),
    [
      definitions,
      instances,
      issueSets,
      isDirty,
      addDefinition,
      updateDefinition,
      deleteDefinition,
      addInstance,
      updateInstance,
      deleteInstance,
      addIssueSet,
      updateIssueSet,
      deleteIssueSet,
      resetToDefaults,
    ],
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
};

export const useAdminData = () => useContext(AdminDataContext);
