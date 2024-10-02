import { useEffect, useRef } from 'react';
import { useFetcher } from '@remix-run/react';
import { Typography } from '@mui/material';

import { classes as classesData } from '~/data/classes';
import { ErrorResponse } from '~/api/classes';
import { Class } from '~/api/classes/schema';
import { useDebouncedCallback } from 'use-debounce';
import { ExaltationList } from '~/features/exaltation/components/ExaltationList/ExaltationList';

export const CharacterExaltations = ({ class: classData }: CharacterExaltationsProps) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const fetcher = useFetcher<Class | ErrorResponse>();

  const handler = useDebouncedCallback(() => {
    if (formRef.current) {
      fetcher.submit(formRef.current);
    }
  }, 500);

  const { SkinIcon } = classesData[classData.name];

  useEffect(() => {
    formRef.current?.scroll();
    console.log(Boolean(formRef.current))
  }, [classData.name])

  return (
    <fetcher.Form
      ref={formRef}
      onChange={handler}
      method="post"
      className="flex justify-center"
    >
      <div className="flex flex-col gap-2" style={{ minWidth: 400 }}>
        <div className="flex flex-col items-center">
          <SkinIcon className="w-16" />
          <Typography variant="h4" className="capitalize !font-bold text-shadow">
            {classData.name}
          </Typography>
        </div>

        <ExaltationList exaltations={classData.exaltations} />
      </div>
    </fetcher.Form>
  );
}

export interface CharacterExaltationsProps {
  class: Class;
}
