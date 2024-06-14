export const sum = (numbers: number[]): number => {
  return numbers.reduce((acc, number) => acc + number, 0);
}
