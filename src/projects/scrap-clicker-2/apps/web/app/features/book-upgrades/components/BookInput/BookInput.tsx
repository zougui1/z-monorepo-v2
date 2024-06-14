import { TextField } from '@mui/material';

import { BookIcon } from '~/components/icons';

import './BookInput.css';

export const BookInput = ({ defaultValue, name, error, inputRef }: BookInputProps) => {
  return (
    <div className="BookInput-root flex justify-between items-center gap-4 pr-4">
      <BookIcon className="w-16" style={{ transform: 'translateX(-40%)' }} />
      <div style={{ transform: 'translateX(-40%)' }}>
        <TextField
          inputRef={inputRef}
          defaultValue={defaultValue}
          name={name}
          variant="standard"
          style={{ width: '150%' }}
          type="number"
          error={Boolean(error)}
          helperText={error}
          FormHelperTextProps={{
            className: 'absolute BookInput-helperText',
          }}
          InputProps={{
            inputProps: {
              className: '!text-3xl text-right !font-bold !py-0 !pr-1',
            },
          }}
        />
      </div>
    </div>
  );
}

export interface BookInputProps {
  defaultValue: unknown;
  name?: string;
  error?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}
