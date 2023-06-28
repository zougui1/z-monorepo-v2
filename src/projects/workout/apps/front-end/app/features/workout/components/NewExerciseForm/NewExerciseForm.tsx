import { Button, TextField, Select, MenuItem, Autocomplete, FormControl } from '@mui/material';
import { Controller } from 'react-hook-form';

import { NumberInput } from '~/components/NumberInput';

import { useNewExerciseForm } from '../../hooks';

export const NewExerciseForm = () => {
  const { control, handleSubmit } = useNewExerciseForm();

  const onSubmit = handleSubmit(data => {
    console.log('data:', data)
  });

  return (
    <form className="flex gap-6 flex-wrap" onSubmit={onSubmit}>
      <FormControl className="w-64">
        <Controller
          name="exercise"
          control={control}
          render={({ field, fieldState }) => (
            <Autocomplete
              {...field}
              options={['Bicep curls', 'Hammer curls', 'Reverse curls', 'Arnold press']}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Exercise"
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                />
              )}
              fullWidth
              onChange={(e, v) => field.onChange(v)}
            />
          )}
        />
      </FormControl>

      <FormControl>
        <Controller
          name="reps"
          control={control}
          render={({ field, fieldState }) => (
            <NumberInput
              {...field}
              label="Reps"
              min={1}
              max={99}
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </FormControl>

      <FormControl className="w-64">
        <Controller
          name="targetedMuscleRegions"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Targeted muscle regions"
              select
              SelectProps={{
                multiple: true
              }}
              defaultValue={[]}
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
            >
              <MenuItem value="Right arm">Right arm</MenuItem>
              <MenuItem value="Left arm">Left arm</MenuItem>
              <MenuItem value="Right leg">Right leg</MenuItem>
              <MenuItem value="Left leg">Left leg</MenuItem>
            </TextField>
          )}
        />
      </FormControl>

      <FormControl>
        <Controller
          name="weight"
          control={control}
          render={({ field, fieldState }) => (
            <NumberInput
              {...field}
              label="Weight"
              min={0}
              max={100}
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </FormControl>

      <FormControl>
        <Controller
          name="bodyWeight"
          control={control}
          render={({ field, fieldState }) => (
            <NumberInput
              {...field}
              label="Body Weight"
              min={50}
              max={150}
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </FormControl>

      <div>
        <Button type="submit" variant="contained">Add</Button>
      </div>
    </form>
  );
}
