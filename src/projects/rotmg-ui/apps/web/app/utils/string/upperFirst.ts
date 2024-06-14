export const upperFirst = (input: string): string => {
  // Handle empty string
  if (!input) return input;

  return input.charAt(0).toUpperCase() + input.slice(1);
}
