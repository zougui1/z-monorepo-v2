import { Outlet } from '@remix-run/react';

import { Document } from '~/components/templates/Document';
import { BaseErrorBoundary } from '~/components/templates/BaseErrorBoundary';

import './tailwind.css';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Document>{children}</Document>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  return <BaseErrorBoundary container={Document} />;
}
