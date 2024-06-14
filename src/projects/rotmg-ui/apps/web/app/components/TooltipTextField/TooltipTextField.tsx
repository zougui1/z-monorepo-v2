import { Tooltip, TextField, type TextFieldProps } from '@mui/material';

export const TooltipTextField = ({ error, tooltipError, helperText, ...rest }: TooltipTextFieldProps) => {
  const content = (
    <TextField
      {...rest}
      error={Boolean(error || tooltipError)}
      helperText={error || helperText}
    />
  );

  if (!tooltipError) {
    return content;
  }

  return (
    <Tooltip arrow title={tooltipError}>
      {content}
    </Tooltip>
  );
}

export type TooltipTextFieldProps = {
  error?: string;
  tooltipError?: string;
} & Omit<TextFieldProps, 'error'>;
