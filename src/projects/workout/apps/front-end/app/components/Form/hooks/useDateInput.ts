import { useRef, useContext } from 'react';
import { MuiPickersAdapterContext } from '@mui/x-date-pickers/LocalizationProvider';

export const useDateInput = (): UseDateInputResult => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const context = useContext(MuiPickersAdapterContext);

  const getDate = (value: unknown): number | undefined => {
    return context?.utils?.date(value);
  }

  const onChange = (handler: (event: unknown) => void) => (value: unknown) => {
    const target = inputRef.current;

    if (target) {
      handler({
        type: 'change',
        // give the parsed value from MUI's date picker to react-hook-form
        target: {
          ...target,
          value,
        },
      });
    }
  }

  return {
    inputRef,
    getDate,
    onChange,
  };
}

export interface UseDateInputResult {
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  getDate: (value: unknown) => unknown;
  onChange: (handler: (event: unknown) => void) => ((value: unknown) => void);
}
