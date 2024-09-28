import { isRouteErrorResponse, useRouteError } from '@remix-run/react';

import { Typography } from '~/components/atoms/Typography';

export const BaseErrorBoundary = ({ container: Container }: BaseErrorBoundaryProps) => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (typeof error.data?.message === 'string') {
      return (
        <Container>
          <Typography variant="h1" className="pb-6">
            {error.data.message}
          </Typography>
        </Container>
      );
    }

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
      <Container>
        <Typography variant="h1" className="pb-6">
          {error.status}: {error.statusText}
        </Typography>

        {message}
      </Container>
    );
  }

  if (error instanceof Error && import.meta.env.DEV) {
    console.error(error);

    return (
      <Container>
        <div>
          <Typography variant="h1" className="pb-6">There was an error</Typography>
          <p>{error.message}</p>
          <hr />
          <p>Hey, developer, you should replace this with what you want your users to see.</p>
        </div>
      </Container>
    );
  }

  return <h1>Unknown Error</h1>;
}

export interface BaseErrorBoundaryProps {
  container: (props: { children: React.ReactNode }) => JSX.Element;
}
