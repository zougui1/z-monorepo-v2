import { tryStringifyRange } from './number';

export const getItemActionMessage = (options: GetItemActionMessageOptions): string => {
  const { itemName, numbers, actionLabel = '', itemLabels } = options;

  if (!numbers.length) {
    return `${actionLabel} "${itemName}"`.trim();
  }

  const range = tryStringifyRange(numbers);

  const pluralizedLabel = (numbers.length > 1) || range
    ? itemLabels.plural.toLowerCase()
    : itemLabels.singular.toLowerCase();

  if (range) {
    return `${actionLabel} the ${pluralizedLabel} ${range} of "${itemName}"`.trim();
  }

  const chapterNumbersJoined = numbers.join(', ');

  return `${actionLabel} the ${pluralizedLabel} ${chapterNumbersJoined} of "${itemName}"`.trim();
}

export interface GetItemActionMessageOptions {
  itemName: string;
  numbers: number[];
  actionLabel?: string;
  itemLabels: {
    singular: string;
    plural: string;
  };
}
