import clsx from 'clsx';

import { Stat, stats } from '~/data/stats';
import type { Potions } from '~/types';

import { EditablePotion } from '../EditablePotion';

export const EditablePotions = ({ potions, disabled, className, ...rest }: EditablePotionsProps) => {
  return (
    <div {...rest} className={clsx('flex flex-wrap gap-2 items-center', className)}>
      {Object.values(stats).map(stat => (
        <EditablePotion
          key={stat.name}
          stat={stat as Stat}
          disabled={disabled}
          value={potions[stat.name]}
        />
      ))}
    </div>
  );
}

export interface EditablePotionsProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  potions: Potions;
  disabled?: boolean;
}
