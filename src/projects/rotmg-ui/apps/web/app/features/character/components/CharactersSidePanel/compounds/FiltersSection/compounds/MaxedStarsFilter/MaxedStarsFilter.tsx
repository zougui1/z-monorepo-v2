import { useSearchParams } from '@remix-run/react';
import { RadioGroup } from '@mui/material';

import { LabelledRadio } from '~/components/LabelledRadio';

export const MaxedStarsFilter = () => {
  const [searchParams] = useSearchParams();

  return (
    <RadioGroup row name="maxedStars" defaultValue={searchParams.get('maxedStars') || 'all'}>
      <LabelledRadio label="Maxed Stars" value="yes" />
      <LabelledRadio label="Unmaxed Stars" value="no" />
      <LabelledRadio label="All" value="all" />
    </RadioGroup>
  );
}
