import { useSearchParams } from '@remix-run/react';
import { RadioGroup } from '@mui/material';

import { LabelledRadio } from '~/components/LabelledRadio';

export const ExaltedFilter = () => {
  const [searchParams] = useSearchParams();

  return (
    <RadioGroup row name="exalted" value={searchParams.get('exalted') || 'all'}>
      <LabelledRadio label="Exalted" value="yes" />
      <LabelledRadio label="Unexalted" value="no" />
      <LabelledRadio label="All" value="all" />
    </RadioGroup>
  );
}
