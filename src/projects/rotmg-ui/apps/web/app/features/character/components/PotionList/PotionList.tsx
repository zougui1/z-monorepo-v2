import clsx from 'clsx';

import { stats } from '~/data/stats';
import type { Potions } from '~/types';

export const PotionList = ({ potions }: PotionListProps) => {
  return (
    <ul className="grid grid-cols-2 lg:grid-cols-4 bg-gray-700">
      {Object.values(stats).map(stat => (
        <li
          key={stat.name}
          className={clsx('flex items-center', {
            'opacity-50': potions[stat.name] <= 0,
          })}
        >
          <stat.PotionIcon className="w-10" />
          <span>{potions[stat.name]}</span>
        </li>
      ))}
    </ul>
  );
}

export interface PotionListProps {
  potions: Potions;
}
