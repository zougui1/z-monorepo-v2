import { useSearchParams } from '@remix-run/react';
import { DateTime } from 'luxon';

export const useStartDate = (): DateTime => {
  const [searchParams] = useSearchParams();

  const startDateString = searchParams.get('startDate');

  if (!startDateString) {
    throw new Error('Missing start date');
  }

  const startDate = DateTime.fromISO(startDateString);

  if (!startDate.isValid) {
    throw new Error('Invalid start date');
  }

  return startDate;
}
