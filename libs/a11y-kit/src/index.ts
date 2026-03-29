export { A11yDemo } from './components/a11y-demo';
export { A11yModeProvider, useA11yMode } from './components/a11y-mode-provider';
export {
  ElementRegistryProvider,
  useElementRegistry,
} from './components/element-registry-provider';
export { SidePanelProvider, useSidePanel } from './components/side-panel-provider';
export { highlightCss, highlightElement, highlightElementByRef } from './highlight';
export { logger } from './lib/logger';
export { A11yRegistry } from './registry';
export type {
  A11yIssueDefinition,
  A11yIssueInstance,
  ResolvedInstance,
  TestingMethod,
  UserProfile,
  UserRole,
} from './types';
export { testingMethodLabels } from './types';
