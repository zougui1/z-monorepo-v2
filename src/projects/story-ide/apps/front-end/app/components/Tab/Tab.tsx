import React from 'react';
import { ButtonBase, type ButtonBaseProps } from '@mui/material';

export const Tab = React.forwardRef(function TabRef(props: TabProps, ref: React.ForwardedRef<HTMLButtonElement | null>) {
  const {
    children,
    value,
    selected,
    disabled,
    selectionFollowsFocus,
    onChange,
    onClick,
    onFocus,
    ...rest
  } = props;

  console.log('MyTab')

  const handleClick = (event: React.MouseEvent): void => {
    if (!selected) {
      onChange?.(event, value);
    }

    onClick?.(event);
  }

  const handleFocus = (event: React.FocusEvent): void => {
    if (selectionFollowsFocus && !selected) {
      onChange?.(event, value);
    }

    onFocus?.(event);
  }

  return (
    <ButtonBase
      className="shrink-0 overflow-hidden py-3 px-4 whitespace-normal text-center text-xs"
      style={{
        maxWidth: 360,
        minWidth: 90,
        position: 'relative',
        minHeight: 48,
      }}
      focusRipple
      ref={ref}
      role="tab"
      aria-selected={selected}
      disabled={disabled}
      onClick={handleClick}
      onFocus={handleFocus}
      tabIndex={selected ? 0 : -1}
      {...rest}
    >
      {children}
    </ButtonBase>
  );
});

export interface TabProps extends Omit<ButtonBaseProps, 'onChange' | 'onClick' | 'onFocus'> {
  value?: string | undefined;
  selected?: boolean | undefined;
  selectionFollowsFocus?: boolean | undefined;
  onChange?: ((event: React.MouseEvent | React.FocusEvent, value: string | undefined) => void) | undefined;
  onClick?: ((event: React.MouseEvent) => void) | undefined;
  onFocus?: ((event: React.FocusEvent) => void) | undefined;
}
