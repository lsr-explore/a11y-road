import type { ReactNode } from 'react';

export default function Link({
  children,
  to,
  ...props
}: {
  children: ReactNode;
  to?: string;
  [key: string]: unknown;
}) {
  return (
    <a href={to} {...props}>
      {children}
    </a>
  );
}
