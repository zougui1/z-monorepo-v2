import type zod from 'zod';

// potential types: 'string' | 'number' | 'bigint' | 'array' | 'set' | 'date'

const errorMap: Map<string, string> = new Map([
  ['missing_value', 'Value required'],
  ['too_small', 'There must be at least {minimum} values'],
  ['too_big', 'There must be less than {maximum} values'],
  ['string_too_small', 'There must be at least {minimum} characters'],
  ['string_too_big', 'There must be less than {maximum} characters'],
  ['number_too_small', 'Must be greater than {minimum}'],
  ['number_too_big', 'Must be less than {maximum}'],
  ['bigint_too_small', 'Must be greater than {minimum}'],
  ['bigint_too_big', 'Must be less than {maximum}'],
  ['date_too_small', 'Must be greater than {minimum}'],
  ['date_too_big', 'Must be less than {maximum}'],
  ['checkbox_untrue', 'The checkbox must be checked'],
]);

//const defaultErrorMap = zod.getErrorMap();

export const defaultGetErrorMap = (issue: zod.ZodIssueOptionalMessage, context: zod.ErrorMapCtx) => {
  const customCode = getCustomCode(issue, context);
  // use a custom code if it exists in the map, otherwise just use the regular code
  const message = errorMap.get(customCode) || errorMap.get(issue.code);
  console.log(issue, context, customCode)

  if (!message) {
    return { message: context.defaultError };
  }

  const actualMessage = Object.entries(issue).reduce((acc, [key, value]) => {
    return acc.replaceAll(`{${key}}`, String(value));
  }, message);

  return {
    message: actualMessage,
  };
};

const getCustomCode = (issue: zod.ZodIssueOptionalMessage, context: zod.ErrorMapCtx): string => {
  if (issue.code === 'custom' && issue.message && errorMap.has(issue.message)) {
    return issue.message;
  }

  if (issue.code === 'invalid_type' && [null, undefined].includes(context.data)) {
    return 'missing_value';
  }

  if ('type' in issue) {
    return `${issue.type}_${issue.code}`;
  }

  return issue.code;
}
