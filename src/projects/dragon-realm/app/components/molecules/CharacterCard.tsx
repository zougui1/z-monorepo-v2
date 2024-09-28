import clsx from 'clsx';
import { tv, type VariantProps } from 'tailwind-variants';

import { Percent } from '@zougui/common.percent-utils';

import { CharacterData } from '~/types/CharacterData';
import { CharacterCardImage } from '~/components/atoms/CharacterCardImage';
import { Typography } from '~/components/atoms/Typography';

import { CharacterStatusBar } from './CharacterStatusBar';

const card = tv({
  base: 'flex h-[120px] box-border transition-transform',
  slots: {
    infoContainer: 'w-full flex flex-col justify-between px-2 py-2',
  },
  variants: {
    health: {
      high: {

      },
      medium: {
        base: 'text-yellow-500',
      },
      low: {
        base: 'text-orange-500',
      },
      dead: {
        base: 'text-red-600',
      },
    },

    focused: {
      true: {
        //infoContainer: 'border-y border-slate-200',
        base: 'rtl:-translate-x-6 translate-x-6 shadow shadow-slate-500',
      }
    },
  },
});

type StatusState = 'low' | 'medium' | 'high' | 'dead';

const getHealth = (percent: number): StatusState => {
  if (percent > 50) {
    return 'high';
  }

  if (percent > 25) {
    return 'medium';
  }

  if (percent <= 0) {
    return 'dead';
  }

  return 'low';
}

export const CharacterCard = ({ character, className, focused, ...rest }: CharacterCardProps) => {
  const progressValue = character.maxHp > 0 ? Percent.fromMultiplier(character.hp) / character.maxHp : 0;
  const health = getHealth(progressValue);
  const { base, infoContainer } = card({ health, focused });

  return (
    <div {...rest} className={base({ className })}>
      <div className="min-w-[120px] w-[120px]">
        <CharacterCardImage src={character.picture} name={character.name} />
      </div>

      <div className={infoContainer()}>
        <div className="flex flex-col">
          <Typography className="text-md">
            {character.name}
          </Typography>
          <Typography className="text-sm">
            Lvl {character.level}
          </Typography>
        </div>

        <div className="flex flex-col space-y-1">
          <CharacterStatusBar
            label="HP"
            value={character.hp}
            max={character.maxHp}
            classes={{
              bar: '*:bg-green-700',
            }}
          />

          <CharacterStatusBar
            label="MP"
            value={character.mp}
            max={character.maxMp}
            classes={{
              bar: '*:bg-blue-700'
            }}
          />
        </div>
      </div>
    </div>
  );
}

export const CharacterCard_V1 = ({ character, className, children, ...rest }: CharacterCardProps) => {
  const progressValue = character.maxHp > 0 ? Percent.fromMultiplier(character.hp) / character.maxHp : 0;
  const health = getHealth(progressValue);

  return (
    <div {...rest} className={card({ health, className })}>
      <div className="min-w-[118px] w-[118px]">
        <CharacterCardImage src={character.picture} name={character.name} />
      </div>

      <div className="w-full flex flex-col justify-between px-2 py-2">
        <div className="flex flex-col">
          <Typography className="text-md">
            {character.name}
          </Typography>
          <Typography className="text-sm">
            Lvl {character.level}
          </Typography>
        </div>

        <div className="flex flex-col space-y-1">
          <CharacterStatusBar
            label="HP"
            value={character.hp}
            max={character.maxHp}
            classes={{
              bar: '*:bg-green-700',
              //barLow: '*:bg-red-600',
              //barMedium: '*:bg-orange-600',
              //barHigh: '*:bg-green-700',
            }}
          />

          <CharacterStatusBar
            label="MP"
            value={character.mp}
            max={character.maxMp}
            classes={{
              bar: '*:bg-blue-700'
            }}
          />
        </div>
      </div>
    </div>
  );
}

export interface CharacterCardProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  character: CharacterData;
  focused?: boolean;
}
