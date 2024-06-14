const defaultFractionDigits = 3;

export const toScientificNotation = (num: number, fractionDigits: number = defaultFractionDigits): string => {
  // Convert the number to scientific notation rounded up to the thousandth decimal point
  const scientificNotation = num.toExponential(fractionDigits);

  // remove the '+' after the 'e' indicator for a cleaner number formatting
  return scientificNotation.replace('e+', 'e');
}
