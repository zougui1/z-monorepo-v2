import type { V2_MetaFunction } from '@remix-run/node';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Story IDE' }];
};

export default function Index() {
  return (
    <div className="m-8">
      <h1>Home</h1>
    </div>
  );
}
