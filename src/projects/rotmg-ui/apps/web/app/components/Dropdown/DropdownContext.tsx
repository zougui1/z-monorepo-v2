import { createContext, useState, useContext, useMemo, useId } from 'react';

export interface DropdownContextState {
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  id: string;
}

export const DropdownContext = createContext<DropdownContextState | undefined>(undefined);

export const useDropdownContext = (): DropdownContextState => {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error('Cannot use a dropdown component outside of <Dropdown>');
  }

  return context;
}

export const DropdownContextProvider = ({ children }: DropdownContextProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const id = useId();

  const state = useMemo(() => {
    return {
      anchorEl,
      setAnchorEl,
      id,
    };
  }, [anchorEl, id]);

  return (
    <DropdownContext.Provider value={state}>
      {children}
    </DropdownContext.Provider>
  );
}

export interface DropdownContextProps {
  children?: React.ReactNode;
}
