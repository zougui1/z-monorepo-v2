import { createUnitsSuggestions } from './createUnitsSuggestions';
import { filterSeriesUnits } from './filterSeriesUnits';
import { parseUnitName } from './parseUnitName';
import { parseListableNumber } from '../parsing';

export const findUnitsSuggestions = <T>(units: T[], options: FindUnitsSuggestionsOptions<T>): Suggestion[] => {
  const { search, seriesName, label, getUnitNumber, getUnitName } = options;

  const inputUnitsNumbers = parseListableNumber(search, { strict: false });
  const filteredChapters = filterSeriesUnits(units, {
    search,
    unitsNumbers: inputUnitsNumbers,
    getUnitNumber,
    getUnitName,
  });

  const chaptersOptions = createUnitsSuggestions(filteredChapters, {
    allUnits: units,
    inputNumbers: inputUnitsNumbers,
    label,
    getIndex: getUnitNumber,
    getName: options.addUnitNameToSuggestions && getUnitName
      ? unit => parseUnitName(seriesName, getUnitName(unit))
      : undefined,
  });

  return chaptersOptions;
}

export interface FindUnitsSuggestionsOptions<T> {
  search: string;
  seriesName: string;
  addUnitNameToSuggestions?: boolean | undefined;
  label: {
    singular: string;
    plural: string;
  };
  getUnitNumber: (unit: T) => number;
  getUnitName?: (unit: T) => string;
}

type Suggestion = {
  name: string;
  value: string;
}
