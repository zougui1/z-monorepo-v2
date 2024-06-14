import parsePdf_ from 'pdf-parse';

export const parsePdf = async (buffer: Buffer): Promise<string> => {
  const data = await parsePdf_(buffer);
  return data.text;
}
