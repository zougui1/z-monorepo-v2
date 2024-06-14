import { useState } from 'react';
import { FormControlLabel, type FormControlLabelProps } from '@mui/material';

export const createBooleanInput = (displayName: string, control: React.ReactElement) => {
  const BooleanInput = (props: BooleanInputProps) => {
    const [checked, setChecked] = useState(props.defaultChecked);

    const handleChange = (event: React.SyntheticEvent<Element, Event>, newChecked: boolean) => {
      props.onChange?.(event, newChecked);

      if (typeof props.checked !== 'boolean' && typeof checked === 'boolean' && !event.defaultPrevented) {
        setChecked(newChecked);
      }
    }

    return (
      <FormControlLabel
        {...props}
        checked={props.checked ?? checked}
        control={control}
        onChange={handleChange}
      />
    );
  }

  BooleanInput.displayName = displayName;

  return BooleanInput;
}


export interface BooleanInputProps extends Omit<FormControlLabelProps, 'control'> {

}
