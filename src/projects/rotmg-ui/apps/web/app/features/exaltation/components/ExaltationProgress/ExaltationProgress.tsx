import { useRef } from 'react';
import { LinearProgress, IconButton } from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import clsx from 'clsx';

import { toPercent } from '~/utils/number';
import { isNumber } from 'radash';

export const ExaltationProgress = (props: ExaltationProgressProps) => {
  const {
    potionIcon,
    statName,
    shortName,
    level,
    maxLevel,
    points,
    maxPoints,
    portalIcon,
  } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isExalted = level >= maxLevel;

  const handleNumeralButton = (getNewValue: (value: number) => number) => () => {
    if (inputRef.current) {
      const number = Number(inputRef.current.value);

      if (isNumber(number)) {
        inputRef.current.value = String(getNewValue(number));
        console.log('value:', inputRef.current.value)
        inputRef.current.form?.requestSubmit();
      }
    }
  }

  // update the input's value with new data
  if (inputRef.current) {
    inputRef.current.value = String(points);
  }

  return (
    <div
      className={clsx('flex flex-col gap-1.5 p-1.5', {
        'bg-blue-950': isExalted,
        'bg-gray-800': !isExalted,
      })}
    >
      <div className="flex justify-between">
        <div className="flex items-center">
          {potionIcon}
          <p className="text-2xl font-bold">{shortName} {level}/{maxLevel}</p>
        </div>

        <div className="flex items-center">
          {isExalted
            ? <p className="text-2xl font-bold text-blue-300 uppercase">Exalted</p>
            : <p className="text-2xl font-bold">{points}/{maxPoints}</p>
          }
          {portalIcon}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <LinearProgress
          value={isExalted ? 100 : toPercent(points, maxPoints)}
          classes={{ bar: clsx({ '!bg-green-500': isExalted }) }}
          className="!h-3"
          variant="determinate"
        />
      </div>

      <div className="flex justify-center gap-2">
        <IconButton
          onClick={handleNumeralButton(value => value - 1)}
          disabled={level === 0 && points === 0}
          className="!p-0"
        >
          <RemoveIcon />
        </IconButton>

        <IconButton
          onClick={handleNumeralButton(value => value + 1)}
          disabled={isExalted}
          className="!p-0"
        >
          <AddIcon />
        </IconButton>
      </div>

      <input
        ref={inputRef}
        defaultValue={points}
        name={`exaltation.${statName}.points`}
        type="number"
        hidden
      />
    </div>
  );
}

export interface ExaltationProgressProps {
  potionIcon: React.ReactNode;
  statName: string;
  shortName: string;
  level: number;
  maxLevel: number;
  points: number;
  maxPoints: number;
  portalIcon: React.ReactNode;
}
