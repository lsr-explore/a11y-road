'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import { useA11yMode } from './a11y-mode-provider';
import { useElementRegistry } from './element-registry-provider';

interface A11yDemoToggleProps {
  instanceId: string;
  label: string;
  broken: ReactNode;
  fixed: ReactNode;
  children?: never;
}

interface A11yDemoWrapperProps {
  instanceId: string;
  label: string;
  broken?: never;
  fixed?: never;
  children: ReactNode;
}

type A11yDemoProps = A11yDemoToggleProps | A11yDemoWrapperProps;

export const A11yDemo = (props: A11yDemoProps) => {
  const { isAccessible } = useA11yMode();
  const { instanceId, label } = props;
  const elementRef = useRef<HTMLDivElement>(null);
  const { register, unregister } = useElementRegistry();

  useEffect(() => {
    register({ ref: elementRef, label, instanceId });
    return () => unregister(instanceId);
  }, [register, unregister, instanceId, label]);

  if ('children' in props && props.children !== undefined) {
    return <div ref={elementRef}>{props.children}</div>;
  }

  const { broken, fixed } = props as A11yDemoToggleProps;
  return <div ref={elementRef}>{isAccessible ? fixed : broken}</div>;
};
