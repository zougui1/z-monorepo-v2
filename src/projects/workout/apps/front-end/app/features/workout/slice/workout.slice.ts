import { createSlice } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

export interface WorkoutState {
  startDate: DateTime | undefined;
}

const initialState: WorkoutState = {
  startDate: undefined,
};

export const workout = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    start: state => {
      state.startDate = DateTime.now();
    },
  },
});
