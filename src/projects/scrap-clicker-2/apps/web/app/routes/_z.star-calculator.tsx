import { useRef } from 'react';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { Typography, Divider } from '@mui/material';
import { json, type MetaFunction, type ActionFunctionArgs } from '@remix-run/node';
import { useDebouncedCallback } from 'use-debounce';

import { getData, updateData, Data, ErrorResponse } from '~/api/data';
import { MagnetIcon, GoldenScrapIcon, StarFragmentIcon, StarIcon, ScrapyardV2Icon } from '~/components/icons';
import { getStarUpgradeProgress } from '~/features/star-cost/utils';
import { ResourceInput } from '~/features/resource/components/ResourceInput';
import { ResourceGoal } from '~/features/resource/components/ResourceGoal';

export const meta: MetaFunction = () => {
  return [
    { title: 'Star Calculator' },
    { name: 'description', content: 'Scrap Clicker 2 Star Calculator!' },
  ];
};

export const loader = async () => {
  const data = await getData();
  return json(data);
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const stars = Number(body.get('stars'));
  const magnets = String(body.get('magnets'));
  const goldenScraps = String(body.get('goldenScraps'));
  const starFragments = String(body.get('starFragments'));
  const scrapyardV2 = Number(body.get('scrapyardV2'));
  const targetStar = Number(body.get('targetStar'));

  const response = await updateData({
    stars,
    scrapyardV2,
    targetStar,
    resources: {
      magnets,
      goldenScraps,
      starFragments,
    },
  });

  return json(response);
}

export default function StarCalculator() {
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

  const progress = getStarUpgradeProgress({
    currentStarLevel: data.stars,
    resources: data.resources,
    scrapyardLevel: data.scrapyardV2,
    targetStarLevel: data.targetStar,
  });

  return (
    <fetcher.Form ref={formRef} method="post" className="flex flex-col gap-6" onChange={handler}>
      <fieldset>
        <Typography variant="h3" gutterBottom>Current</Typography>

        <div className="flex flex-wrap gap-3">
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
        </div>
      </fieldset>

      <Divider />

      <fieldset>
        <Typography variant="h3" gutterBottom>Target</Typography>

        <div>
          <ResourceInput
            defaultValue={data.targetStar}
            icon={<StarIcon />}
            name="targetStar"
            error={getFormError('targetStar')}
          />
        </div>
      </fieldset>

      <Divider />

      <fieldset>
        <Typography variant="h3" gutterBottom>Goal</Typography>

        <div className="flex flex-wrap gap-6">
          <ResourceGoal
            icon={<GoldenScrapIcon />}
            amount={progress?.goldenScraps.goal ?? 'N/A'}
            remaining={progress?.goldenScraps.remaining ?? 'N/A'}
            progress={progress?.goldenScraps.progress ?? 'N/A'}
          />

          <ResourceGoal
            icon={<MagnetIcon />}
            amount={progress?.magnets.goal ?? 'N/A'}
            remaining={progress?.magnets.remaining ?? 'N/A'}
            progress={progress?.magnets.progress ?? 'N/A'}
          />

          <ResourceGoal
            icon={<StarFragmentIcon />}
            amount={progress?.starFragments.goal ?? 'N/A'}
            remaining={progress?.starFragments.remaining ?? 'N/A'}
            progress={progress?.starFragments.progress ?? 'N/A'}
          />
        </div>
      </fieldset>
    </fetcher.Form>
  );
}
