export const createSingleUnitSuggestions = <T>(units: T[], options: CreateSingleUnitSuggestionsOptions<T>): Suggestion[] => {
  const { label, getIndex, getName } = options;

  const unitSuggestions = units.map(unit => {
    const number = getIndex(unit);
    const maybeName = getName?.(unit);
    const name = maybeName ? `${number}: ${maybeName}` : number;

    return {
      name: `${label} ${name}`,
      value: String(number),
    };
  });

  return unitSuggestions;
}

export interface CreateSingleUnitSuggestionsOptions<T> {
  label: string;
  getIndex: (unit: T) => number;
  getName?: ((unit: T) => string | undefined) | undefined;
}

type Suggestion = {
  name: string;
  value: string;
}
