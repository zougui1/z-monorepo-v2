import { Switch } from '@mui/material';
import { createBooleanInput, type BooleanInputProps } from '~/utils/component-factory';

export const LabelledSwitch = createBooleanInput('LabelledSwitch', <Switch />);

export interface LabelledSwitchProps extends BooleanInputProps {

}
