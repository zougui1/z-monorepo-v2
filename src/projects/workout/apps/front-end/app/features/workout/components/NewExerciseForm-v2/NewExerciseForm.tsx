import { Button } from '@mui/material';
import zod from 'zod';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';

import type { UnknownObject } from '@zougui/common.type-utils';

import { Form } from '~/components/Form';

export const schema = zod.object({
  exercise: zod.enum(['Bicep curls', 'Hammer curls', 'Reverse curls', 'Arnold press']).default('Bicep curls'),
  reps: zod.coerce.number().min(1).max(99).default(10),
  targetedMuscleRegions: zod.array(zod.enum(['Right arm', 'Left arm', 'Right leg', 'Left leg'])).min(1).default(['Right arm']),
  extraWeight: zod.coerce.number().min(0).max(100).default(0),
  bodyWeight: zod.coerce.number().min(50).max(150).default(50),
  some: zod.boolean(),
  date: zod.date(),
});

const getKeysEnum = <T extends UnknownObject>(object: T): Record<keyof T, keyof T> => {
  return Object.keys(object).reduce((acc, field: keyof T) => {
    acc[field] = field;
    return acc;
  }, {} as Record<keyof T, keyof T>);
}

const fields = getKeysEnum(schema.shape);

export const NewExerciseForm = () => {
  const onSubmit = (data: zod.infer<typeof schema>) => {
    console.log('data:', data)
  };

  return (
    <Form
      className="flex gap-6 flex-wrap"
      schema={schema}
      onSubmit={onSubmit}
    >
      <Form.Autocomplete name={fields.exercise} label="Exercise" className="w-64" />

      <Form.TextField name={fields.reps} label="Reps" />

      <Form.Select
        name={fields.targetedMuscleRegions}
        label="Targeted muscle regions"
        className="w-64"
      />

      <Form.TextField name={fields.extraWeight} label="Extra weight" />
      <Form.TextField name={fields.bodyWeight} label="Body weight" />
      <Form.Checkbox name={fields.some} label="Some" />

      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <Form.DatePicker
          name={fields.date}
          label="Date"
        />
      </LocalizationProvider>

      <div className="flex items-center">
        <Button type="submit" variant="contained">Add</Button>
      </div>
    </Form>
  );
}
