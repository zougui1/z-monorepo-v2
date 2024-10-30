import { useRef } from 'react';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { json, type MetaFunction, type ActionFunctionArgs } from '@remix-run/node';
import { useDebouncedCallback } from 'use-debounce';

import { getData, updateData, Data, ErrorResponse } from '~/api/data';
import { ResourceInput } from '~/features/resource/components/ResourceInput';
import {
  MagnetIcon,
  GoldenScrapIcon,
  StarFragmentIcon,
  StarIcon,
  ScrapyardV2Icon,
} from '~/components/icons';

export const meta: MetaFunction = () => {
  return [
    { title: 'Scrap Clicker 2' },
    { name: 'description', content: 'Scrap Clicker 2 utilities!' },
  ];
};

export const loader = async () => {
  return await getData();
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const stars = Number(body.get('stars'));
  const magnets = String(body.get('magnets'));
  const goldenScraps = String(body.get('goldenScraps'));
  const starFragments = String(body.get('starFragments'));
  const scrapyardV2 = Number(body.get('scrapyardV2'));

  const response = await updateData({
    stars,
    scrapyardV2,
    resources: {
      magnets,
      goldenScraps,
      starFragments,
    },
  });

  return json(response);
}

export default function Index() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher<Data | ErrorResponse>();
  const handler = useDebouncedCallback(() => {
    if (formRef.current) {
      fetcher.submit(formRef.current);
    }
  }, 500);

  const getFormError = (key: keyof ErrorResponse['errors']): string | undefined => {
    return fetcher.data && 'errors' in fetcher.data
      ? fetcher.data.errors[key]
      : undefined;
  }

  return (
    <div>
      <fetcher.Form ref={formRef} method="post" className="flex flex-wrap gap-3" onChange={handler}>
        <ResourceInput
          defaultValue={data.stars}
          icon={<StarIcon />}
          name="stars"
          error={getFormError('stars')}
        />

        <ResourceInput
          defaultValue={data.resources.magnets}
          icon={<MagnetIcon />}
          name="magnets"
          error={getFormError('resources.magnets')}
        />

        <ResourceInput
          defaultValue={data.resources.goldenScraps}
          icon={<GoldenScrapIcon />}
          name="goldenScraps"
          error={getFormError('resources.goldenScraps')}
        />

        <ResourceInput
          defaultValue={data.resources.starFragments}
          icon={<StarFragmentIcon />}
          name="starFragments"
          error={getFormError('resources.starFragments')}
        />

        <ResourceInput
          defaultValue={data.scrapyardV2}
          icon={<ScrapyardV2Icon />}
          name="scrapyardV2"
          error={getFormError('scrapyardV2')}
        />
      </fetcher.Form>
    </div>
  );
}
