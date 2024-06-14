export const formatExponent = (upgrade: number): string => {
  // parse back into a number to remove any unecessary decimal zero
  const num = Number(upgrade.toFixed(2));
  return `x${num}`;
}
