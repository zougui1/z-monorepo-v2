import { Button, ButtonProps } from '@mui/material';
import clsx from 'clsx';

export const Seasonal = ({ isSeasonal, ...rest }: SeasonalProps) => {
  return (
    <Button
      {...rest}
      className={clsx(
        '!px-2 !pt-1 !pb-0 !rounded-3xl !text-white !text-xs !font-bold text-shadow',
        {
          '!bg-gray-400': !isSeasonal,
          '!bg-cyan-400': isSeasonal,
        },
      )}
    >
      {isSeasonal ? 'seasonal' : 'non-seasonal'}
    </Button>
  );
}

export interface SeasonalProps extends ButtonProps {
  isSeasonal: boolean;
}
