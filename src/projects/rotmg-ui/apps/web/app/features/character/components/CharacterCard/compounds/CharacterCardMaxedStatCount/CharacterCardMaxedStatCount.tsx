import clsx from 'clsx';

import { stats } from '~/data/stats';

import { useCharacterCardContext } from '../../CharacterCardContext';

const statCount = Object.keys(stats).length;

export const CharacterCardMaxedStatCount = ({ className, ...rest }: CharacterCardMaxedStatCountProps) => {
  const [state] = useCharacterCardContext();

  const maxedStats = Object
    .values(state.character.potionsRemaining)
    .filter(remaining => remaining <= 0);

  const isMaxed = maxedStats.length === statCount;

  return (
    <span
      {...rest}
      className={clsx('text-lg font-bold', className, { 'text-yellow-400': isMaxed })}
    >
      {maxedStats.length}/{statCount}
    </span>
  );
}

export interface CharacterCardMaxedStatCountProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {

}
