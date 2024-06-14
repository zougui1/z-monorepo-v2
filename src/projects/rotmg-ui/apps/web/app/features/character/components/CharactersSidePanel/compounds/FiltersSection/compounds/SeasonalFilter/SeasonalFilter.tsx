import { useSearchParams } from '@remix-run/react';
import { RadioGroup } from '@mui/material';

import { LabelledRadio } from '~/components/LabelledRadio';
import type { FilterTernary } from '~/types';

export const SeasonalFilter = ({ defaultValue }: SeasonalFilterProps) => {
  const [searchParams] = useSearchParams();

  return (
    <RadioGroup row name="seasonal" value={searchParams.get('seasonal') || defaultValue}>
      <LabelledRadio label="Seasonal" value="yes" />
      <LabelledRadio label="Non-Seasonal" value="no" />
      <LabelledRadio label="All" value="all" />
    </RadioGroup>
  );
}

export interface SeasonalFilterProps {
  defaultValue: FilterTernary;
}
