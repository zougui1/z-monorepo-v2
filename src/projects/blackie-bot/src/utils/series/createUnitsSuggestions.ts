import { createSingleUnitSuggestions } from './createSingleUnitSuggestions';
import { createListableOptions } from '../options';

export const createUnitsSuggestions = <T>(units: T[], options: CreateUnitsSuggestionsOptions<T>): Suggestion[] => {
  const { allUnits, label, getIndex, getName, inputNumbers } = options;

  const unitSuggestions = createSingleUnitSuggestions(units, {
    label: label.singular,
    getIndex,
    getName,
  });

  if (allUnits.length <= 1) {
    return unitSuggestions;
  }

  const allUnitsNumbers = allUnits.map(getIndex);
  const listableSuggestions = createListableOptions(label.plural, inputNumbers, allUnitsNumbers);

  return [...unitSuggestions, ...listableSuggestions];
}

export interface CreateUnitsSuggestionsOptions<T> {
  allUnits: T[];
  inputNumbers: number[];
  label: {
    singular: string;
    plural: string;
  };
  getIndex: (unit: T) => number;
  getName?: ((unit: T) => string | undefined) | undefined;
}

type Suggestion = {
  name: string;
  value: string;
}
