export const getIsMessageObject = (value: unknown): value is { message: string } => {
  return !!(
    value &&
    typeof value === 'object' &&
    'message' in value &&
    typeof value.message === 'string'
  );
}
