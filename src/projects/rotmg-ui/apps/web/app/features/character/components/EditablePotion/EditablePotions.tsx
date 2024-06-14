import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';
import { InputAdornment } from '@mui/material';
import { isNumber } from 'radash';

import { NumberInput } from '~/components/NumberInput';
import { Stat } from '~/data/stats';
import { isEven } from '~/utils/number';
import { IconComponent } from '~/utils/component-factory';

import { usePotionSize } from '../../hooks';
import { PotionSize } from '../../enums';

export const EditablePotion = ({ stat, disabled, value: defaultValue }: EditablePotionProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState(defaultValue);

  const potionSize = usePotionSize();

  const getValue = (): number => {
    switch (potionSize) {
      case PotionSize.Greater:
        return Math.ceil(value / 2);
      case PotionSize.Auto:
        return isEven(value) ? value / 2 : value;
    }

    return value;
  }

  const displayValue = getValue();

  const getIcon = (stat: Stat): JSX.Element => {
    let Icon: IconComponent = stat.potion.Small;

    switch (potionSize) {
      case PotionSize.Greater:
        Icon = stat.potion.Greater;
        return <stat.potion.Greater className="w-8" />;
      case PotionSize.Auto:
        Icon = isEven(value) ? stat.potion.Greater : stat.potion.Small;
    }

    return <Icon className="w-8" />
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const newValue = Number(event.target.value);

    if (isNumber(newValue)) {
      handleValue(newValue);
    }
  }

  const handleValue = (newValue: number) => {
    flushSync(() => {
      switch (potionSize) {
        case PotionSize.Small:
          setValue(newValue);
          break;
        case PotionSize.Greater:
          setValue(newValue * 2);
          break;
        case PotionSize.Auto:
          if (isEven(value)) {
            setValue(newValue * 2);
          } else {
            setValue(newValue);
          }
          break;
      }
    });

    inputRef.current?.form?.requestSubmit();
  }

  return (
    <>
      <input
        ref={inputRef}
        name={`potionsRemaining.${stat.name}`}
        value={value}
        hidden
        onChange={() => {}}
      />

      <NumberInput
        disabled={disabled}
        value={displayValue}
        onChange={handleChange}
        onUpArrow={() => handleValue(displayValue + 1)}
        onDownArrow={() => handleValue(displayValue - 1)}
        style={{ width: 100 }}
        color="warning"
        focused={value > 0}
        min={0}
        max={99}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" className="!mr-0" style={{ minWidth: 32, minHeight: 24 }}>
              {getIcon(stat)}
            </InputAdornment>
          ),
        }}
      />
    </>
  );
}

export interface EditablePotionProps {
  stat: Stat;
  value: number;
  disabled?: boolean;
}
