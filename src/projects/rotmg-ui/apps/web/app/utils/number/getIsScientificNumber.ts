const reScientificNumber = /^-?[0-9]+(\.[0-9]+)?e\+?[0-9]+$/i;

export const getIsScientificNumber = (value: string): boolean => {
  return reScientificNumber.test(value);
}
