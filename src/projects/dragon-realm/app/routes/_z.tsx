import { Outlet } from '@remix-run/react';

import { Container } from '~/components/atoms/Container';
import { AppHeader } from '~/components/organisms/AppHeader';
import { BaseErrorBoundary } from '~/components/templates/BaseErrorBoundary';

const LayoutTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppHeader />

      <Container>
        {children}
      </Container>
    </>
  );
}

export default function Layout() {
  return (
    <LayoutTemplate>
      <Outlet />
    </LayoutTemplate>
  );
}

export function ErrorBoundary() {
  return <BaseErrorBoundary container={LayoutTemplate} />;
}
