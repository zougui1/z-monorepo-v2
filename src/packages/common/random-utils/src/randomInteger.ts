export const randomInteger = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const random = Math.floor(Math.random() * (max - min + 1)) + min;

  // because if `Math.random` return 0.999999999999 the above formula will
  // go above max by 1
  return Math.min(random, max);
}
