import { useRef } from 'react';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { Typography, Divider } from '@mui/material';
import { EmojiEvents as EmojiEventsIcon } from '@mui/icons-material';
import { json, type MetaFunction, type ActionFunctionArgs } from '@remix-run/node';
import { useDebouncedCallback } from 'use-debounce';

import { getData, updateData, Data, ErrorResponse } from '~/api/data';
import { MagnetIcon, GoldenScrapIcon, StarFragmentIcon, StarIcon, ScrapyardV2Icon, MasteryTokenIcon } from '~/components/icons';
import { getStarUpgradeProgress, findAvailableStar } from '~/features/star-cost/utils';
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
  const reducedStarCost = Number(body.get('achievements.reducedStarCost'));
  const masteryBoostLevel = Number(body.get('masteryBoostLevel'));

  const response = await updateData({
    stars,
    scrapyardV2,
    targetStar,
    masteryBoostLevel,
    resources: {
      magnets,
      goldenScraps,
      starFragments,
    },
    achievements: {
      reducedStarCost,
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

  const options = {
    currentStarLevel: data.stars,
    resources: data.resources,
    scrapyardLevel: data.scrapyardV2,
    targetStarLevel: data.targetStar,
    achievements: data.achievements,
    masteryBoostLevel: data.masteryBoostLevel,
  };

  const progress = getStarUpgradeProgress(options);
  const availableStar = findAvailableStar(options);

  const getGoalColor = (progress: string | undefined): string | undefined => {
    if (!progress) {
      return;
    }

    if (progress === '100%') {
      return 'border-green-700';
    }

    return 'border-red-800';
  }

  return (
    <fetcher.Form ref={formRef} method="post" className="flex flex-col gap-4" onChange={handler}>
      <fieldset>
        <Typography variant="h4" gutterBottom>Current</Typography>

        <div className="flex flex-wrap gap-x-3">
          <ResourceInput
            label="Stars"
            defaultValue={data.stars}
            icon={<StarIcon />}
            name="stars"
            error={getFormError('stars')}
          />

          <ResourceInput
            label="Magnets"
            defaultValue={data.resources.magnets}
            icon={<MagnetIcon />}
            name="magnets"
            error={getFormError('resources.magnets')}
          />

          <ResourceInput
            label="Golden scraps"
            defaultValue={data.resources.goldenScraps}
            icon={<GoldenScrapIcon />}
            name="goldenScraps"
            error={getFormError('resources.goldenScraps')}
          />

          <ResourceInput
            label="Star fragments"
            defaultValue={data.resources.starFragments}
            icon={<StarFragmentIcon />}
            name="starFragments"
            error={getFormError('resources.starFragments')}
          />

          <ResourceInput
            label="Scrapyard V2 level"
            defaultValue={data.scrapyardV2}
            icon={<ScrapyardV2Icon />}
            name="scrapyardV2"
            error={getFormError('scrapyardV2')}
          />

          <ResourceInput
            label="Achievement level"
            helperText="Affecting the star cost"
            defaultValue={data.achievements.reducedStarCost}
            icon={<EmojiEventsIcon />}
            name="achievements.reducedStarCost"
            error={getFormError('achievements.reducedStarCost')}
          />

          <ResourceInput
            label="Mastery 17+ barrels"
            helperText="Affecting the star cost"
            defaultValue={data.masteryBoostLevel}
            icon={<MasteryTokenIcon />}
            name="masteryBoostLevel"
            error={getFormError('masteryBoostLevel')}
          />
        </div>
      </fieldset>

      <Divider />

      <div className="flex gap-4">
        <fieldset>
          <ResourceInput
            label="Target"
            defaultValue={data.targetStar}
            icon={<StarIcon />}
            name="targetStar"
            error={getFormError('targetStar')}
          />
        </fieldset>

        <div>
          <ResourceInput
            label="Available"
            value={availableStar}
            icon={<StarIcon />}
            readOnly
          />
        </div>
      </div>

      <Divider />

      <div>
        <Typography variant="h4" gutterBottom>Goal</Typography>

        <div className="flex flex-wrap gap-2 md:gap-4">
          <div>
            <ResourceGoal
              icon={<GoldenScrapIcon />}
              amount={progress?.goldenScraps.goal ?? 'N/A'}
              remaining={progress?.goldenScraps.remaining ?? 'N/A'}
              progress={progress?.goldenScraps.progress ?? 'N/A'}
              className={getGoalColor(progress?.goldenScraps.progress)}
            />
          </div>

          <div>
            <ResourceGoal
              icon={<MagnetIcon />}
              amount={progress?.magnets.goal ?? 'N/A'}
              remaining={progress?.magnets.remaining ?? 'N/A'}
              progress={progress?.magnets.progress ?? 'N/A'}
              className={getGoalColor(progress?.magnets.progress)}
            />
          </div>

          <div>
            <ResourceGoal
              icon={<StarFragmentIcon />}
              amount={progress?.starFragments.goal ?? 'N/A'}
              remaining={progress?.starFragments.remaining ?? 'N/A'}
              progress={progress?.starFragments.progress ?? 'N/A'}
              className={getGoalColor(progress?.starFragments.progress)}
            />
          </div>
        </div>
      </div>
    </fetcher.Form>
  );
}
