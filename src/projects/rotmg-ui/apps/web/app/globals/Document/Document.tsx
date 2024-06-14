import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { CssBaseline } from '@mui/material';

import { theme } from '~/theme';

export const Document = ({ children, title }: DocumentProps) => {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name="theme-color" content={theme.palette.primary.main} />
        {title ? <title>{title}</title> : null}

        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <CssBaseline />

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}
