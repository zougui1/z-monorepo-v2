import WordExtractor from 'word-extractor';

export const parseWord = async (buffer: Buffer): Promise<string> => {
  const extractor = new WordExtractor();
  const doc = await extractor.extract(buffer);

  return doc.getBody();
}
