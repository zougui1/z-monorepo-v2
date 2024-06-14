import { useRef, useState } from 'react';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { Typography, Divider } from '@mui/material';
import { json, type MetaFunction, type ActionFunctionArgs } from '@remix-run/node';
import { useDebouncedCallback } from 'use-debounce';
import { isNumber, pick } from 'radash';
import zod from 'zod';
import type { Paths } from 'type-fest';

import { getData, updateData, Data, ErrorResponse } from '~/api/data';
import { MagnetIcon, GoldenScrapIcon, StarFragmentIcon, WrenchIcon, IronScrapIcon, XPIcon } from '~/components/icons';
import { BookUpgradePercent } from '~/features/book-upgrades/components/BookUpgradePercent';
import { BookUpgradeExponent } from '~/features/book-upgrades/components/BookUpgradeExponent';
import { findAmountOfBooksToSave, findOptimalXpLevel, getBookUpgradeCost } from '~/features/book-upgrades/utils';
import { BookInput } from '~/features/book-upgrades/components/BookInput';
import { ResourceInput } from '~/features/resource/components/ResourceInput';
import { TooltipTextField } from '~/components/TooltipTextField';
import { NumberInputArrows } from '~/components/NumberInputArrows';
import { getFlatErrorMessages } from '~/utils/zod';

// TODO needs refactoring

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
  const bookLevel = Number(body.get('bookLevel'));
  const xpBookLevelRatio = Number(body.get('xpBookLevelRatio'));
  const books = Number(body.get('resources.books'));
  const magnets = Number(body.get('bookUpgrades.magnets'));
  const goldenScraps = Number(body.get('bookUpgrades.goldenScraps'));
  const starFragments = Number(body.get('bookUpgrades.starFragments'));
  const xp = Number(body.get('bookUpgrades.xp'));
  const wrenches = Number(body.get('bookUpgrades.wrenches'));
  const ironScraps = Number(body.get('bookUpgrades.ironScraps'));

  const response = await updateData({
    bookLevel,
    xpBookLevelRatio,

    resources: {
      books,
    },

    bookUpgrades: {
      magnets,
      goldenScraps,
      starFragments,
      xp,
      wrenches,
      ironScraps,
    },
  });

  return json(response);
}

const getFormValues = (form: HTMLFormElement): Record<string, string> => {
  const inputs = form.querySelectorAll('input');

  const values: Record<string, string> = {};

  for (const input of inputs) {
    values[input.name] = input.value;
  }

  return values;
}

const formSchema = zod.object({
  bookLevel: zod.coerce.number().positive().int(),
  xpBookLevelRatio: zod.coerce.number().min(0).max(100),
  'resources.books': zod.coerce.number(),
  'bookUpgrades.magnets': zod.coerce.number(),
  'bookUpgrades.goldenScraps': zod.coerce.number(),
  'bookUpgrades.starFragments': zod.coerce.number(),
  'bookUpgrades.xp': zod.coerce.number(),
  'bookUpgrades.wrenches': zod.coerce.number(),
  'bookUpgrades.ironScraps': zod.coerce.number(),
});

export interface ClientErrorResponse {
  invalidValues: {
    [key in Paths<Data>]?: string;
  };

  errors: {
    [key in Paths<Data>]?: string;
  };
}

export default function BookUpgrades() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const bookLevelInputRef = useRef<HTMLInputElement | null>(null);
  const booksInputRef = useRef<HTMLInputElement | null>(null);
  const [, forceUpdate] = useState<unknown>();

  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher<Data | ErrorResponse | ClientErrorResponse>();
  const handler = useDebouncedCallback(() => {
    if (formRef.current) {
      const values = getFormValues(formRef.current);

      const data = formSchema.safeParse(values);

      if (data.success) {
        return fetcher.submit(formRef.current);
      }

      const errors = getFlatErrorMessages(data.error);

      fetcher.data = {
        // take invalid values only
        invalidValues: pick(values, Object.keys(errors)),
        errors,
      };
      forceUpdate({});
    }
  }, 500);

  const getFormError = (key: keyof ErrorResponse['errors']): string | undefined => {
    return fetcher.data && 'errors' in fetcher.data
      ? fetcher.data.errors[key]
      : undefined;
  }

  const getInvalidFormValue = (key: keyof ClientErrorResponse['invalidValues']): string | undefined => {
    return fetcher.data && 'invalidValues' in fetcher.data
      ? fetcher.data.invalidValues[key]
      : undefined;
  }

  const optimalXpRatio = data.xpBookLevelRatio / 100;

  const predictedOptimalLevel = findOptimalXpLevel({
    books: data.resources.books,
    bookLevel: data.bookLevel,
    xpLevel: data.bookUpgrades.xp,
    optimalXpRatio,
  });
  const booksToSave = findAmountOfBooksToSave({
    bookLevel: data.bookLevel,
    xpLevel: data.bookUpgrades.xp,
    optimalXpRatio,
  });
  const optimalXpLevel = Math.round(data.bookLevel * optimalXpRatio);


  const handleBookLevelUp = () => {
    if (bookLevelInputRef.current && booksInputRef.current) {
      const newBookLevel = Number(bookLevelInputRef.current.value) + 1;
      const books = Number(booksInputRef.current.value);

      if (isNumber(newBookLevel) && isNumber(books)) {
        bookLevelInputRef.current.value = newBookLevel.toString();
        booksInputRef.current.value = String(books + newBookLevel);
        bookLevelInputRef.current?.form?.requestSubmit();
      }
    }
  }

  const handleBookLevelDown = () => {
    if (bookLevelInputRef.current && booksInputRef.current) {
      const bookLevel = Number(bookLevelInputRef.current.value);
      const books = Number(booksInputRef.current.value);

      if (isNumber(bookLevel) && isNumber(books)) {
        bookLevelInputRef.current.value = String(bookLevel - 1);
        booksInputRef.current.value = String(Math.max(0, books - bookLevel));
        bookLevelInputRef.current?.form?.requestSubmit();
      }
    }
  }

  const handleUpgrade = (upgradeName: keyof Data['bookUpgrades']) => () => {
    if (booksInputRef.current) {
      const cost = getBookUpgradeCost(data.bookUpgrades[upgradeName]);
      const books = Number(booksInputRef.current.value);

      if (isNumber(books)) {
        booksInputRef.current.value = String(books - cost);
      }
    }
  }

  return (
    <fetcher.Form ref={formRef} method="post" className="flex flex-col gap-6" onChange={handler}>
      <fieldset>
        <Typography variant="h3" gutterBottom>Current</Typography>

        <div className="flex justify-center">
          <div style={{ maxWidth: 474 }} className="flex flex-col items-center gap-6">
            <ResourceInput
              inputRef={bookLevelInputRef}
              icon={<XPIcon />}
              defaultValue={getInvalidFormValue('bookLevel') ?? data.bookLevel}
              name="bookLevel"
              label="Level"
              error={getFormError('bookLevel')}
              // add those arrows to the BookUpgradeInput and make them functional
              endAdornment={(
                <NumberInputArrows
                  onUp={handleBookLevelUp}
                  onDown={handleBookLevelDown}
                />
              )}
            />

            <div className="flex flex-wrap gap-3">
              <BookUpgradePercent
                level={data.bookUpgrades.magnets}
                invalidLevel={getInvalidFormValue('bookUpgrades.magnets')}
                icon={<MagnetIcon />}
                upgradePerLevel={2}
                inputName="bookUpgrades.magnets"
                error={getFormError('bookUpgrades.magnets')}
                onUpgrade={handleUpgrade('magnets')}
              />

              <BookUpgradePercent
                level={data.bookUpgrades.goldenScraps}
                invalidLevel={getInvalidFormValue('bookUpgrades.goldenScraps')}
                icon={<GoldenScrapIcon />}
                upgradePerLevel={3}
                inputName="bookUpgrades.goldenScraps"
                error={getFormError('bookUpgrades.goldenScraps')}
                onUpgrade={handleUpgrade('goldenScraps')}
              />

              <BookUpgradePercent
                level={data.bookUpgrades.starFragments}
                invalidLevel={getInvalidFormValue('bookUpgrades.starFragments')}
                icon={<StarFragmentIcon />}
                upgradePerLevel={5}
                inputName="bookUpgrades.starFragments"
                error={getFormError('bookUpgrades.starFragments')}
                onUpgrade={handleUpgrade('starFragments')}
              />

              <BookUpgradePercent
                level={data.bookUpgrades.xp}
                invalidLevel={getInvalidFormValue('bookUpgrades.xp')}
                icon={<XPIcon />}
                upgradePerLevel={10}
                inputName="bookUpgrades.xp"
                error={getFormError('bookUpgrades.xp')}
                onUpgrade={handleUpgrade('xp')}
              />

              <BookUpgradePercent
                level={data.bookUpgrades.wrenches}
                invalidLevel={getInvalidFormValue('bookUpgrades.wrenches')}
                icon={<WrenchIcon />}
                upgradePerLevel={10}
                inputName="bookUpgrades.wrenches"
                error={getFormError('bookUpgrades.wrenches')}
                onUpgrade={handleUpgrade('wrenches')}
              />

              <BookUpgradeExponent
                level={data.bookUpgrades.ironScraps}
                invalidLevel={getInvalidFormValue('bookUpgrades.ironScraps')}
                icon={<IronScrapIcon />}
                upgradePerLevel={1.4}
                inputName="bookUpgrades.ironScraps"
                error={getFormError('bookUpgrades.ironScraps')}
                onUpgrade={handleUpgrade('ironScraps')}
              />
            </div>

            <div className="flex items-center gap-2 pb-4">
              <BookInput
                inputRef={booksInputRef}
                defaultValue={getInvalidFormValue('resources.books') ?? data.resources.books}
                name="resources.books"
                error={getFormError('resources.books')}
              />

              <div>
                <p className="text-md">+{data.bookLevel + 1}</p>
              </div>
            </div>
          </div>
        </div>
      </fieldset>

      <Divider />

      <div>
        <div className="flex items-center gap-2">
          <span>XP/book level ratio:</span>
          <TooltipTextField
            defaultValue={getInvalidFormValue('xpBookLevelRatio') ?? data.xpBookLevelRatio}
            variant="standard"
            style={{ width: 40 }}
            tooltipError={getFormError('xpBookLevelRatio')}
            name="xpBookLevelRatio"
            InputProps={{
              endAdornment: '%',
            }}
          />
          <span>= optimal XP level: {optimalXpLevel}</span>
        </div>

        {predictedOptimalLevel && predictedOptimalLevel.xpLevel > data.bookUpgrades.xp && (
          <p>You will be able to reach the optimal XP level ({predictedOptimalLevel.xpLevel}) on level {predictedOptimalLevel.bookLevel} with {predictedOptimalLevel.remainingBooks} books remaining</p>
        )}

        {!predictedOptimalLevel && (
          <p className="text-red-500">Could not find level at which you will be able to reach the optimal XP level</p>
        )}

        {booksToSave > 0 && (
          <p>Save at least {booksToSave} books to upgrade the XP on the next level.</p>
        )}
      </div>

    </fetcher.Form>
  );
}
