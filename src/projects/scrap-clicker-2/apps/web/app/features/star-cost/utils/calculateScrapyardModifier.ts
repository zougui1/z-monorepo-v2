export const calculateScrapyardModifier = (level: number): number => {
  let modifier = level;

  if (level > 200) {
    modifier = (level - 200) * 4 + 300;
  } else if (level > 100) {
    modifier = (level - 100) * 2 + 100;
  }

  return modifier - 1;
}
