import type { ZodError } from 'zod';

export const getFlatErrorMessages = (error: ZodError): Record<string, string> => {
  const errors: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = issue.path.join('.');

    if (key && !errors[key]) {
      errors[key] = issue.message;
    }
  }

  return errors;
}
