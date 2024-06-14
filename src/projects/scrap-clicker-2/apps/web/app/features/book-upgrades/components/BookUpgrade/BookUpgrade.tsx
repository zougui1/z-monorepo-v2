import clsx from 'clsx';
import { Divider } from '@mui/material';
import { useLoaderData } from '@remix-run/react';

import { BookIcon } from '~/components/icons';
import type { Data } from '~/api/data';

import './BookUpgrade.css';
import { BookUpgradeInput } from '../BookUpgradeInput';
import { getBookUpgradeCost } from '../../utils';

export const BookUpgrade = (props: BookUpgradeProps) => {
  const {
    level,
    invalidLevel,
    icon,
    upgradeTotal,
    upgradePerLevel,
    highlight,
    inputName,
    error,
    onUpgrade,
  } = props;
  const data = useLoaderData<Data>();
  const canUpgrade = data.resources.books >= getBookUpgradeCost(level);

  return (
    <div
      className={clsx(
        'flex flex-col justify-between items-center text-white pt-2 font-bold BookUpgrade-root',
        {
          'BookUpgrade-highlighted': highlight,
        },
      )}
    >
      <div className="text-center flex items-center gap-2">
        <span>Level</span>
        <BookUpgradeInput
          defaultValue={invalidLevel || level}
          name={inputName}
          error={error}
          onUpArrow={onUpgrade}
          disabledUpArrow={!canUpgrade}
        />
      </div>

      <div className="flex justify-center items-center gap-2">
        <div className="w-8">
          {icon}
        </div>
        <span>{upgradeTotal}</span>
      </div>

      <div className="flex flex-col gap-1 w-full text-center p-1 BookUpgrade-contrast-background text-sm">
        <div>
          <p>{upgradePerLevel}/Level</p>
        </div>

        <Divider />

        <div className="flex justify-center items-center">
          <p>Next level:</p>
          <BookIcon className="w-6" />
          {/* replace NaN (if that is the result) with 0  */}
          <p>{error ? 0 : getBookUpgradeCost(level)}</p>
        </div>
      </div>
    </div>
  );
}

export interface BookUpgradeProps {
  level: number;
  icon: React.ReactNode;
  upgradeTotal: string;
  upgradePerLevel: string;
  highlight?: boolean;
  inputName?: string;
  error?: string;
  invalidLevel?: string;
  onUpgrade?: React.MouseEventHandler;
}
