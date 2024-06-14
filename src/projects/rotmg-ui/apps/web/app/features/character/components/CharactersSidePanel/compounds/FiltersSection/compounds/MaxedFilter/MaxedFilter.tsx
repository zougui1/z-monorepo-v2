import { useSearchParams } from '@remix-run/react';
import { RadioGroup } from '@mui/material';

import { LabelledRadio } from '~/components/LabelledRadio';

export const MaxedFilter = () => {
  const [searchParams] = useSearchParams();

  return (
    <RadioGroup row name="maxed" defaultValue={searchParams.get('maxed') || 'all'}>
      <LabelledRadio label="Maxed" value="yes" />
      <LabelledRadio label="Unmaxed" value="no" />
      <LabelledRadio label="All" value="all" />
    </RadioGroup>
  );
}
