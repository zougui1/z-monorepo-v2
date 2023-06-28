import { Button } from '@mui/material';

import { RelativeStartTime } from '../RelativeStartTime';
//import { NewExerciseForm } from '../NewExerciseForm';
import { NewExerciseForm } from '../NewExerciseForm-v2';

export const Workout = () => {
  return (
    <div className="m-8 flex flex-col gap-6 w-full">
      <div>
        <RelativeStartTime />
      </div>

      <ul>

      </ul>

      <div>
        <NewExerciseForm />
      </div>

      <div>
        <Button variant="contained">Finish</Button>
      </div>
    </div>
  );
}
