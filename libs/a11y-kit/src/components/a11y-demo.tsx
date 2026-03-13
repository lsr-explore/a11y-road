'use client';

import type { ReactNode } from 'react';
import { useA11yMode } from './a11y-mode-provider';

interface A11yDemoToggleProps {
  instanceId: string;
  broken: ReactNode;
  fixed: ReactNode;
  children?: never;
}

interface A11yDemoWrapperProps {
  instanceId: string;
  broken?: never;
  fixed?: never;
  children: ReactNode;
}

type A11yDemoProps = A11yDemoToggleProps | A11yDemoWrapperProps;

export const A11yDemo = (props: A11yDemoProps) => {
  const { isAccessible } = useA11yMode();
  const { instanceId } = props;

  if ('children' in props && props.children !== undefined) {
    return <div data-a11y-id={instanceId}>{props.children}</div>;
  }

  const { broken, fixed } = props as A11yDemoToggleProps;
  return <div data-a11y-id={instanceId}>{isAccessible ? fixed : broken}</div>;
};
