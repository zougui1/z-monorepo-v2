const reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g

export const getAsciiWords = (string: string): string[] => {
  return string.match(reAsciiWord) || []
}
