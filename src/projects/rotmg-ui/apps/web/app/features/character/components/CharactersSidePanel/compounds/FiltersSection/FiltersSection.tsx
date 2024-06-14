import { useRef } from 'react';
import { useFetcher, useSearchParams } from '@remix-run/react';

import { ExaltedFilter } from './compounds/ExaltedFilter';
import { MaxedFilter } from './compounds/MaxedFilter';
import { MaxedStarsFilter } from './compounds/MaxedStarsFilter';
import { SeasonalFilter } from './compounds/SeasonalFilter';
import { SideSection } from '../../../../../../components/SideSection';

export const FiltersSection = ({ children }: FiltersSectionProps) => {
  const fetchers = useFetcher();
  const filterFormRef = useRef<HTMLFormElement | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilter = () => {
    if (filterFormRef.current) {
      const formData = new FormData(filterFormRef.current);
      const formParams = new URLSearchParams(formData);

      setSearchParams(new URLSearchParams({
        ...Object.fromEntries(searchParams),
        ...Object.fromEntries(formParams),
      }));
    }
  }

  return (
    <SideSection title="Filters">
      <fetchers.Form ref={filterFormRef} onChange={handleFilter}>
        {children}
      </fetchers.Form>
    </SideSection>
  );
}

export interface FiltersSectionProps {
  children?: React.ReactNode;
}

FiltersSection.Exalted = ExaltedFilter;
FiltersSection.Maxed = MaxedFilter;
FiltersSection.MaxedStars = MaxedStarsFilter;
FiltersSection.Seasonal = SeasonalFilter;
