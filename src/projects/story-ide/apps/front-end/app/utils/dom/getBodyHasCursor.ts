import { getWebValue } from '../platform';

export const getBodyHasCursor = (): boolean => {
  return getWebValue(() => {
    const { cursor } = document.body.style;

    return (
      !!cursor &&
      !['none', 'unset', 'default'].includes(cursor)
    );
  }, false);
}
