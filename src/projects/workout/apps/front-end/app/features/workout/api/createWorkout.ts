import { client } from './client';

export const createWorkout = ({ date }: CreateWorkoutData) => {
  return client.Post('/workouts', {
    date: date.toISOString(),
  });
}

export interface CreateWorkoutData {
  date: Date;
}
