import { useRef } from 'react';
import { IconButton } from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';
import { range } from 'radash';

export const Stars = ({ value, max, onChange, disabled }: StarsProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = (newValue: number) => (event: React.MouseEvent) => {
    if (inputRef.current) {
      inputRef.current.value = String(newValue);
    }

    onChange?.(newValue);
    inputRef.current?.form?.requestSubmit();
  }

  return (
    <div className="flex">
      <input
        ref={inputRef}
        name="stars"
        defaultValue={value}
        hidden
      />

      {[...range(1, max)].map(number => (
        <IconButton
          key={number}
          onClick={handleClick(number)}
          disabled={disabled}
          className="!p-0"
        >
          <StarIcon
            className={number <= value ? 'text-orange-400' : 'text-gray-400'}
          />
        </IconButton>
      ))}
    </div>
  );
}

export interface StarsProps {
  value: number;
  max: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
}
