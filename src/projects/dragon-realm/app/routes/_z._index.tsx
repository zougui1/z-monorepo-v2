import { redirect, type LoaderFunction, type MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  if (url.pathname === '/') {
    return redirect('/saves');
  }

  return null;
}

export default function Index() {
  return null;
}
