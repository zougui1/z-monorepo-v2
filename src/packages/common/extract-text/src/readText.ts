import path from 'node:path';

import fileType from 'file-type';
import fs from 'fs-extra';

import {
  parseOpenOffice,
  parsePdf,
  parseRtf,
  parseText,
  parseWord,
} from './parsers';

const parsers: Record<Extension, Parser | undefined> = {
  '.txt': parseText,
  '.csv': parseText,
  '.doc': parseWord,
  '.docx': parseWord,
  '.pdf': parsePdf,
  '.rtf': parseRtf,
  '.odt': parseOpenOffice,
  '.odp': parseOpenOffice,
  '.ods': parseOpenOffice,
};

export const readText = async (filePath: string): Promise<string> => {
  const buffer = await fs.readFile(filePath);
  const extension = await getFileExtension(filePath, buffer);
  const parse = parsers[extension];

  if (!parse) {
    throw new Error(`Cannot parse files of type ${extension}`);
  }

  return await parse(buffer);
}

const getFileExtension = async (filePath: string, buffer: Buffer): Promise<Extension> => {
  const result = await fileType.fromBuffer(buffer);

  if (!result) {
    return path.extname(filePath) as Extension;
  }

  return `.${result.ext}`;
}

type Extension = `.${string}`;
type Parser = (buffer: Buffer) => Promise<string> | string;
