import { type TextFieldProps } from '@mui/material';
import type { ZodStringCheck } from 'zod';

import type { ZodDef } from '~/utils';

export const getFieldType = (def: ZodDef): TextFieldProps['type'] => {
  if (def.type === 'number') {
    return 'number';
  }

  if (def.type !== 'string') {
    return;
  }

  const checks = def.checks.reduce((acc, check) => {
    acc[check.kind] = check;
    return acc;
  }, {} as Record<ZodStringCheck['kind'], ZodStringCheck>);

  if (checks.email) {
    return 'email';
  }

  if (checks.url) {
    return 'url';
  }
}
