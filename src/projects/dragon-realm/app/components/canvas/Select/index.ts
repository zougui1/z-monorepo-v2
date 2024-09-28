import { Select as SelectRoot, type SelectProps as SelectRootProps } from './Select';
import { SelectItem, type SelectItemProps } from './compounds';

export const Select = {
  Root: SelectRoot,
  Item: SelectItem,
};

export type {
  SelectRootProps,
  SelectItemProps,
};
