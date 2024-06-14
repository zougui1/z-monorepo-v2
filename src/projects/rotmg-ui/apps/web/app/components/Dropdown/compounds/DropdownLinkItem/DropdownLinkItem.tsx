import { Link, type LinkProps } from '@remix-run/react';
import clsx from 'clsx';

import { DropdownMenuItem, type DropdownMenuItemProps } from '../DropdownMenuItem';

export const DropdownLinkItem = (props: DropdownLinkItemProps) => {
  const {
    children,
    to,
    className,
    LinkProps,
    ...rest
  } = props;

  return (
    <DropdownMenuItem
      {...rest}
      className={clsx('!p-0', className)}
    >
      <Link
        {...LinkProps}
        to={to}
        className={clsx('flex w-full py-1.5 px-4', LinkProps?.className)}
      >
        {children}
      </Link>
    </DropdownMenuItem>
  );
}

export interface DropdownLinkItemProps extends DropdownMenuItemProps {
  to: string;
  LinkProps?: LinkProps;
}
