import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import zod from 'zod';

const schema = zod.object({
  exercise: zod.string().nonempty(),
  targetedMuscleRegions: zod.array(zod.string()).min(1),
  weight: zod.coerce.number().min(0).max(100),
  bodyWeight: zod.coerce.number().min(50).max(150),
  reps: zod.coerce.number().min(1).max(99),
});

export const useNewExerciseForm = () => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      exercise: '',
      targetedMuscleRegions: [],
      weight: null,
      bodyWeight: null,
      reps: null,
    },
  });

  return form;
}
