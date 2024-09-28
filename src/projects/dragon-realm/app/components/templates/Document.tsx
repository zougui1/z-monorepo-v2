import { Links, Meta, Scripts, ScrollRestoration } from '@remix-run/react';

export const Document = ({ children, title }: DocumentProps) => {
  return (
    <html lang="en" className="dark text-slate-100">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {title ? <title>{title}</title> : null}

        <Meta />
        <Links />
      </head>
      <body>
        {children}

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
