import { useId } from 'react';
import { Link } from '@remix-run/react';
import { tv } from 'tailwind-variants'

import { Button } from './Button';

const link = tv({
  variants: {
    disabled: {
      true: 'cursor-default',
    },
  },
});

export const LinkButton = ({ children, to, disabled, disabledReason, className, ...rest }: LinkButtonProps) => {
  const id = useId();

  const isDisabledWithReason = Boolean(disabled && disabledReason);

  return (
    <Link
      aria-describedby={isDisabledWithReason ? id : undefined}
      to={disabled ? '#' : to}
      {...rest}
      className={link({ disabled, className })}
      title={disabled ? disabledReason : undefined}
    >
      <Button disabled={disabled}>
        {children}
      </Button>
    </Link>
  );
}

export interface LinkButtonProps {
  to: string;
  children?: React.ReactNode;
  className?: string;
  component?: string;
  disabled?: boolean;
  disabledReason?: string;
}
