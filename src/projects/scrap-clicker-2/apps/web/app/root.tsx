import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
} from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import 'tailwindcss/tailwind.css';

import { Document } from './globals/Document';

export const links: LinksFunction = () => [

];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Document>{children}</Document>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    let message;
    switch (error.status) {
      case 401:
        message = <p>Oops! Looks like you tried to visit a page that you do not have access to.</p>;
        break;
      case 404:
        message = <p>Oops! Looks like you tried to visit a page that does not exist.</p>;
        break;

      default:
        throw new Error(error.data || error.statusText);
    }

    return (
      <Document title={`${error.status} ${error.statusText}`}>
        <h1>
          {error.status}: {error.statusText}
        </h1>
        {message}
      </Document>
    );
  }

  if (error instanceof Error && import.meta.env.DEV) {
    console.error(error);

    return (
      <Document title="Error!">
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>Hey, developer, you should replace this with what you want your users to see.</p>
        </div>
      </Document>
    );
  }

  return <h1>Unknown Error</h1>;
}
