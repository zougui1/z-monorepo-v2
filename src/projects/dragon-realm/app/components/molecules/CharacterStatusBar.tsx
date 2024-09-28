import { Percent } from '@zougui/common.percent-utils';

import { Progress } from '~/components/atoms/Progress';
import { Typography } from '~/components/atoms/Typography';
import { cn } from '~/utils';

export const CharacterStatusBar = ({ label, value, max, classes }: CharacterStatusBarProps) => {
  const progressValue = max > 0 ? Percent.fromMultiplier(value) / max : 0;

  return (
    <div className="relative w-full h-[23px]">
      <Progress
        value={progressValue}
        className={cn('absolute top-[10px] left-0 h-[13px] w-full', classes?.bar)}
      />

      <div className="absolute top-0 left-0 w-full flex justify-between px-2">
        <Typography className="text-sm text-shadow-lg">{label}</Typography>
        <Typography className="text-sm text-shadow-lg">{value}</Typography>
      </div>
    </div>
  );
}

export interface CharacterStatusBarProps {
  label: string;
  value: number;
  max: number;
  classes?: Partial<Record<'bar' | 'barLow' | 'barMedium' | 'barHigh', string>>;
}
