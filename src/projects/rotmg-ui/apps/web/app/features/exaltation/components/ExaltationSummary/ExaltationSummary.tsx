import clsx from 'clsx';

import { stats, type StatName } from '~/data/stats';
import { maxExaltationLevel, statOrdering } from '~/data/exaltation';
import type { Class } from '~/api/classes';

export const ExaltationSummary = ({ name, skinIcon, classData, onClick }: ExaltationSummaryProps) => {
  const getExaltationLevel = (statName: StatName): number => {
    return classData.exaltations[statName].level;
  }

  return (
    <div
      className="flex items-center py-1 px-2 gap-1"
      onClick={onClick}
      role="button"
      onKeyDown={() => { }}
      tabIndex={0}
    >
      <div className="w-10">
        {skinIcon}
      </div>

      <div style={{ width: 100 }}>
        <p className="capitalize">{name}</p>
      </div>

      <div className="flex gap-4">
        {statOrdering.map(statName => stats[statName]).map(stat => (
          <div key={stat.name} className="flex items-center">
            <stat.PotionIcon />
            <span
              className={clsx({
                'text-yellow-300': getExaltationLevel(stat.name) >= maxExaltationLevel,
              })}
            >+{getExaltationLevel(stat.name)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface ExaltationSummaryProps {
  name: string;
  skinIcon: React.ReactNode;
  classData: Class;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}
