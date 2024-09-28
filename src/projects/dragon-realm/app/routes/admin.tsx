import { redirect } from '@remix-run/node';
import { Link, Outlet } from '@remix-run/react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { Container } from '~/components/atoms/Container';
import { NavigationMenu } from '~/components/molecules/NavigationMenu';
import { AppHeader } from '~/components/organisms/AppHeader';
import { BaseErrorBoundary } from '~/components/templates/BaseErrorBoundary';

const queryClient = new QueryClient();

export const loader = async () => {
  console.log('check dev mode');

  if (!import.meta.env.DEV) {
    console.log('redirect')
    throw redirect('/');
  }

  return null;
}

const LayoutTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppHeader>
        <NavigationMenu.Root>
          <NavigationMenu.List>
            <NavigationMenu.Item>
              <NavigationMenu.Link className={NavigationMenu.triggerStyle()} asChild>
                <Link to="/admin/areas">
                  Areas
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
      </AppHeader>

      <Container>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
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
