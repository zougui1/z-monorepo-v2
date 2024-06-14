import { useNavigate } from '@remix-run/react';
import { Button } from '@mui/material';
import type { V2_MetaFunction } from '@remix-run/node';

import { createWorkout } from '~/features/workout/api/createWorkout';
import { useRequest } from '~/hooks';
import { client } from '~/api/ts-rest/client';
import { useEffect } from 'react';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Workout' }];
};

export default function Index() {
  const { send } = useRequest(createWorkout, {
    immediate: false,
  });
  const navigate = useNavigate();

  const handleClick = async () => {
    const data = await send({
      date: new Date(),
    });

    navigate(`workout/id`);
  }

  useEffect(() => {
    client.users
      .getMany()
      .then(console.log)
      .catch(console.error);
  }, []);

  return (
    <div className="m-8">
      <Button
        variant="contained"
        href={`workout?startDate=${new Date().toISOString()}`}
        onClick={handleClick}
      >
        Start
      </Button>
    </div>
  );
}
