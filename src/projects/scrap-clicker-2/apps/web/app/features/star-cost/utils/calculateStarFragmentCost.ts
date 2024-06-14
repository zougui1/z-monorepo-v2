export const calculateStarFragmentCost = (starLevel: number, scrapyardMul: number): number => {
  // adjust for first 10 stars
  let cost = 4 + (starLevel - 10);

  if (starLevel >= 60) cost *= 1.05;
  if (starLevel >= 70) cost *= 1.05;
  if (starLevel >= 75) cost *= 1.05;
  if (starLevel >= 80) cost *= 1.05;
  if (starLevel >= 85) cost *= 1.05;
  if (starLevel >= 90) cost *= 1.05;
  if (starLevel >= 94) cost *= 1.05;
  if (starLevel >= 96) cost *= 1.05;
  if (starLevel >= 98) cost *= 1.05;
  if (starLevel >= 100) cost *= 1.1;
  if (starLevel >= 110) cost *= 1.05;
  if (starLevel >= 115) cost *= 1.05;
  if (starLevel >= 120) cost *= 1.05;
  if (starLevel >= 125) cost *= 1.05;
  if (starLevel >= 130) cost *= 1.05;
  if (starLevel >= 140) cost *= 1.05;
  if (starLevel >= 150) cost *= 1.05;
  if (starLevel >= 160) cost *= 1.05;
  if (starLevel >= 170) cost *= 1.05;
  if (starLevel >= 180) cost *= 1.05;
  if (starLevel >= 190) cost *= 1.05;
  if (starLevel >= 200) cost *= 1.05;
  if (starLevel >= 210) cost *= 1.3;
  if (starLevel >= 260) cost *= 1.3;
  if (starLevel >= 310) cost *= 1.4;
  if (starLevel >= 410) cost *= 1.4;
  if (starLevel >= 510) cost *= 1.4;
  if (starLevel >= 610) cost *= 1.2;
  if (starLevel >= 710) cost *= 1.1;
  if (starLevel >= 810) cost *= 1.1;
  if (starLevel >= 910) cost *= 1.1;
  if (starLevel >= 1010) cost *= 1.1;

  return Math.floor((cost * 100) / (scrapyardMul + 100));
}
