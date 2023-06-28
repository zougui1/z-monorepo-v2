const defaultLevel = 2;
const defaultCharacter = ' ';


export const indent = (text: string, options: IndentOptions = {}): string => {
  const { level = defaultLevel, character = defaultCharacter } = options;
  const indentation = character.repeat(level);
  const indentedText = text
    .split('\n')
    .map(line => `${indentation}${line}`)
    .join('\n');

  return indentedText;
}

export interface IndentOptions {
  level?: number | undefined;
  character?: string | undefined;
}
