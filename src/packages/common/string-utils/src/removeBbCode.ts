const reBbCodeTag = /\[\/?[a-z0-9=_-]+\]/gi;

export const removeBbCode = (text: string): string => {
  return text.replaceAll(reBbCodeTag, '');
}
