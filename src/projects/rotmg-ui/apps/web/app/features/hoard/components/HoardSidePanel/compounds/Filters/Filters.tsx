import { useRef, useState } from 'react';
import { useFetcher, useSearchParams } from '@remix-run/react';
import { IconButton, InputAdornment, RadioGroup, TextField } from '@mui/material';
import { useDebouncedCallback } from 'use-debounce';
import { Close as CloseIcon } from '@mui/icons-material';

import { LabelledRadio } from '~/components/LabelledRadio';
import { SideSection } from '~/components/SideSection';

export const Filters = ({ }: FiltersProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const fetchers = useFetcher();
  const filterFormRef = useRef<HTMLFormElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const handleFilter = () => {
    if (filterFormRef.current) {
      const formData = new FormData(filterFormRef.current);
      setSearchParams(new URLSearchParams(formData));
    }
  }

  const debouncedFilterHandler = useDebouncedCallback(handleFilter, 300);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();
    debouncedFilterHandler();
    setSearch(event.currentTarget.value);
  }

  const handleRemoveSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
      setSearchParams('');
      debouncedFilterHandler();
    }
  }

  return (
    <SideSection title="Filters">
      <fetchers.Form ref={filterFormRef} onChange={handleFilter}>
        <TextField
          inputRef={searchInputRef}
          label="Search"
          name="search"
          onChange={handleSearch}
          defaultValue={searchParams.get('search')}
          InputProps={{
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton onClick={handleRemoveSearch}>
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <RadioGroup row name="complete" defaultValue={searchParams.get('complete') || 'all'}>
          <LabelledRadio label="Complete" value="yes" />
          <LabelledRadio label="Incomplete" value="no" />
          <LabelledRadio label="All" value="all" />
        </RadioGroup>
      </fetchers.Form>
    </SideSection>
  )
}

export interface FiltersProps {

}
