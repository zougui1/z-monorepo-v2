import { InputAdornment } from '@mui/material';
import clsx from 'clsx';

import { NumberInput } from '~/components/NumberInput';
import { stats } from '~/data/stats';
import type { Potions } from '~/types';

export const EditablePotions = ({ potions, disabled, className, ...rest }: EditablePotionsProps) => {
  return (
    <div {...rest} className={clsx('flex flex-wrap gap-2 items-center', className)}>
      {Object.values(stats).map(stat => (
        <NumberInput
          key={stat.name}
          disabled={disabled}
          defaultValue={potions[stat.name]}
          style={{ width: 100 }}
          color="warning"
          focused={potions[stat.name] > 0}
          min={0}
          max={99}
          name={`potionsRemaining.${stat.name}`}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" className="!mr-0" style={{ minWidth: 32, minHeight: 24 }}>
                <stat.PotionIcon style={{ width: 32 }} />
              </InputAdornment>
            ),
          }}
        />
      ))}
    </div>
  );
}

export interface EditablePotionsProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  potions: Potions;
  disabled?: boolean;
}
