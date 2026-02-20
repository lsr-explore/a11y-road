import type { ReactNode } from 'react';

export default function Heading({
  as: Tag,
  children,
  ...props
}: {
  as: keyof HTMLElementTagNameMap;
  children: ReactNode;
  [key: string]: unknown;
}) {
  return <Tag {...props}>{children}</Tag>;
}
