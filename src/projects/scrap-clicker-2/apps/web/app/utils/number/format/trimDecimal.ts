/**
 *
 * @param num
 * @param fractionDigits Number of digits after the first zero after the decimal point. Must be greater than 0
 */
export const trimDecimal = (num: number, fractionDigits: number): string => {
  if (fractionDigits <= 0) {
    throw new Error('The fraction digit must be greater than 0')
  }

  if (!Number.isFinite(fractionDigits)) {
    throw new Error('The fraction digit must be an integer');
  }


  const reTrimDigitsAfterZeros = new RegExp(`^0*[0-9]{${fractionDigits}}`);
  const numStr = num.toFixed(8);

  const [wholeStr, decimalStr] = numStr.split('.');
  const [trimmedDecimalStr] = decimalStr?.match(reTrimDigitsAfterZeros) || [];

  // return no decimal if the decimal is only 0's
  const recomposedNumber = trimmedDecimalStr && Number(trimmedDecimalStr) !== 0
    ? `${wholeStr}.${trimmedDecimalStr}`
    : wholeStr;

  return recomposedNumber;
}
