import { createContext, useContext, useState } from 'react';
import { Object3D, Object3DEventMap } from 'three';

export type SelectContextState = [
  state: Object3D<Object3DEventMap>[],
  setState: React.Dispatch<React.SetStateAction<Object3D<Object3DEventMap>[]>>,
];

export const SelectContext = createContext<SelectContextState | undefined>(undefined);

export const SelectProvider = ({ children }: SelectProviderProps) => {
  const state = useState<Object3D<Object3DEventMap>[]>([]);

  return (
    <SelectContext.Provider value={state}>
      {children}
    </SelectContext.Provider>
  )
}

export interface SelectProviderProps {
  children?: React.ReactNode;
}

export function useSelect(options: { required: false }): SelectContextState | undefined;
export function useSelect(options: { required: true }): SelectContextState;
export function useSelect(options: UseSelectOptions): SelectContextState | undefined {
  const context = useContext(SelectContext);

  if (!context && options.required) {
    throw new Error('Cannot use select outside of the SelectProvider tree');
  }

  return context;
}

export interface UseSelectOptions {
  required: boolean;
}
