import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from '@remix-run/react';

import tailwindwCss from "~/styles/tailwind.css";
import globalCss from "~/styles/global.css";

import { App } from './App';
import { AppTheme } from './components/AppTheme';
import { getErrorMessage } from './utils';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: globalCss },
  { rel: 'stylesheet', href: tailwindwCss },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
];

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <App />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <title>Error</title>
      </head>

      <body>
        <AppTheme>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2>An error occured: {getErrorMessage(error, 'Unknown error')}</h2>
          </div>
        </AppTheme>
        <Scripts />
      </body>
    </html>
  );
}
