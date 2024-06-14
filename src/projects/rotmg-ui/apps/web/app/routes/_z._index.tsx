import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'Rotmg' },
    { name: 'description', content: 'Rotmg utilities!' },
  ];
};

export default function Index() {
  return (
    <div>
      TODO: total exalt progress
      <br />
      TODO: total exalt progress based on the remaining dungeons left to do
      <br />
      TODO: exalt dungeons left to do
    </div>
  );
}
