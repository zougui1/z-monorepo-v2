import clsx from 'clsx';

import { DropdownMenuItem, type DropdownMenuItemProps } from '../DropdownMenuItem';

export const DropdownButtonItem = (props: DropdownButtonItemProps) => {
  const {
    children,
    className,
    buttonProps,
    value,
    name,
    type,
    onClick,
    onMenuItemClick,
    ...rest
  } = props;

  return (
    <DropdownMenuItem
      {...rest}
      onClick={onMenuItemClick}
      className={clsx('!p-0', className)}
    >
      <button
        {...buttonProps}
        value={value}
        name={name}
        type={type}
        onClick={onClick}
        className={clsx('flex w-full py-1.5 px-4 text-left', buttonProps?.className)}
      >
        {children}
      </button>
    </DropdownMenuItem>
  );
}

export interface DropdownButtonItemProps extends Omit<DropdownMenuItemProps, 'onClick'> {
  name?: NativeButtonProps['name'];
  type?: NativeButtonProps['type'];
  buttonProps?: NativeButtonProps;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMenuItemClick?: (event: React.MouseEvent<HTMLLIElement>) => void;
}

type NativeButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
