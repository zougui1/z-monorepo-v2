import { Radio } from '@mui/material';
import { createBooleanInput, type BooleanInputProps } from '~/utils/component-factory';

export const LabelledRadio = createBooleanInput('LabelledRadio', <Radio />);

export interface LabelledRadioProps extends BooleanInputProps {

}
