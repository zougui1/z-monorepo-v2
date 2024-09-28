import { Select as BaseSelect } from '@react-three/drei';

import { SelectProvider, useSelect } from './context';

export const SelectRoot = ({ children }: SelectProps) => {
  const [, setSelected] = useSelect({ required: true });

  return (
    <BaseSelect box onChange={setSelected}>
      {children}
    </BaseSelect>
  );
}

export const Select = ({ children }: SelectProps) => {
  return (
    <SelectProvider>
      <SelectRoot>
        {children}
      </SelectRoot>
    </SelectProvider>
  );
}

export interface SelectProps {
  children?: React.ReactNode;
}
