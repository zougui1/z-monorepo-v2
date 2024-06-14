import fileType from 'file-type';
import fs from 'fs-extra';

import { readText } from './readText';
import * as parsers from './parsers';

const parsersMocks = {
  parseOpenOffice: jest.fn().mockName('parseOpenOffice'),
  parsePdf: jest.fn().mockName('parsePdf'),
  parseRtf: jest.fn().mockName('parseRtf'),
  parseText: jest.fn().mockName('parseText'),
  parseWord: jest.fn().mockName('parseWord'),
};

jest.mock('./parsers', () => {
  const mockParser = (name: keyof typeof parsersMocks): jest.Mock => {
    return jest
      .fn()
      .mockName(name)
      .mockImplementation((...args) => parsersMocks[name](...args))
  }

  return {
    parseOpenOffice: mockParser('parseOpenOffice'),
    parsePdf: mockParser('parsePdf'),
    parseRtf: mockParser('parseRtf'),
    parseText: mockParser('parseText'),
    parseWord: mockParser('parseWord'),
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('readText', () => {
  afterEach(() => {
    parsersMocks.parseOpenOffice.mockReset();
    parsersMocks.parsePdf.mockReset();
    parsersMocks.parseRtf.mockReset();
    parsersMocks.parseText.mockReset();
    parsersMocks.parseWord.mockReset();
  });

  describe('text files', () => {
    it('should read a plain text file', async () => {
      const text = 'Dragons are superior';
      const buffer = Buffer.from(text);

      jest.spyOn(fileType, 'fromBuffer');
      jest.spyOn(fs, 'readFile').mockImplementation(async () => buffer);
      parsersMocks.parseText.mockReturnValue(text);

      const filePath = 'file.txt';

      const result = await readText(filePath);

      expect(result).toBe(text);
      expect(fs.readFile).toHaveBeenCalledTimes(1);
      expect(fs.readFile).toHaveBeenCalledWith(filePath);
      expect(fileType.fromBuffer).toHaveBeenCalledTimes(1);
      expect(fileType.fromBuffer).toHaveBeenCalledWith(buffer);
      expect(parsers.parseText).toHaveBeenCalledTimes(1);
      expect(parsers.parseText).toHaveBeenCalledWith(buffer);
    });

    it('should read a CSV file', async () => {
      const text = 'Dragons;are;superior';
      const buffer = Buffer.from(text);

      jest.spyOn(fileType, 'fromBuffer');
      jest.spyOn(fs, 'readFile').mockImplementation(async () => buffer);
      parsersMocks.parseText.mockReturnValue(text);

      const filePath = 'file.csv';

      const result = await readText(filePath);

      expect(result).toBe(text);
      expect(fs.readFile).toHaveBeenCalledTimes(1);
      expect(fs.readFile).toHaveBeenCalledWith(filePath);
      expect(fileType.fromBuffer).toHaveBeenCalledTimes(1);
      expect(fileType.fromBuffer).toHaveBeenCalledWith(buffer);
      expect(parsers.parseText).toHaveBeenCalledTimes(1);
      expect(parsers.parseText).toHaveBeenCalledWith(buffer);
    });
  });

  describe('word files', () => {
    it('should read a doc file', async () => {
      const text = 'Dragons are superior';
      const buffer = Buffer.from(text);

      jest.spyOn(fileType, 'fromBuffer');
      jest.spyOn(fs, 'readFile').mockImplementation(async () => buffer);
      parsersMocks.parseWord.mockResolvedValue(text);

      const filePath = 'file.doc';

      const result = await readText(filePath);

      expect(result).toBe(text);
      expect(fs.readFile).toHaveBeenCalledTimes(1);
      expect(fs.readFile).toHaveBeenCalledWith(filePath);
      expect(fileType.fromBuffer).toHaveBeenCalledTimes(1);
      expect(fileType.fromBuffer).toHaveBeenCalledWith(buffer);
      expect(parsers.parseWord).toHaveBeenCalledTimes(1);
      expect(parsers.parseWord).toHaveBeenCalledWith(buffer);
    });

    it('should read a docx file', async () => {
      const text = 'Dragons are superior';
      const buffer = Buffer.from(text);

      jest.spyOn(fileType, 'fromBuffer').mockResolvedValue({ ext: 'docx', mime: 'application/xml' });
      jest.spyOn(fs, 'readFile').mockImplementation(async () => buffer);
      parsersMocks.parseWord.mockResolvedValue(text);

      const filePath = 'file.docx';

      const result = await readText(filePath);

      expect(result).toBe(text);
      expect(fs.readFile).toHaveBeenCalledTimes(1);
      expect(fs.readFile).toHaveBeenCalledWith(filePath);
      expect(fileType.fromBuffer).toHaveBeenCalledTimes(1);
      expect(fileType.fromBuffer).toHaveBeenCalledWith(buffer);
      expect(parsers.parseWord).toHaveBeenCalledTimes(1);
      expect(parsers.parseWord).toHaveBeenCalledWith(buffer);
    });
  });

  describe('PDF files', () => {
    it('should read a PDF file', async () => {
      const text = 'Dragons are superior';
      const buffer = Buffer.from(text);

      jest.spyOn(fileType, 'fromBuffer').mockResolvedValue({ ext: 'pdf', mime: 'application/xml' });
      jest.spyOn(fs, 'readFile').mockImplementation(async () => buffer);
      parsersMocks.parsePdf.mockResolvedValue(text);

      const filePath = 'file.pdf';

      const result = await readText(filePath);

      expect(result).toBe(text);
      expect(fs.readFile).toHaveBeenCalledTimes(1);
      expect(fs.readFile).toHaveBeenCalledWith(filePath);
      expect(fileType.fromBuffer).toHaveBeenCalledTimes(1);
      expect(fileType.fromBuffer).toHaveBeenCalledWith(buffer);
      expect(parsers.parsePdf).toHaveBeenCalledTimes(1);
      expect(parsers.parsePdf).toHaveBeenCalledWith(buffer);
    });
  });

  describe('RTF files', () => {
    it('should read an RTF file', async () => {
      const text = 'Dragons are superior';
      const buffer = Buffer.from(text);

      jest.spyOn(fileType, 'fromBuffer').mockResolvedValue({ ext: 'rtf', mime: 'application/xml' });
      jest.spyOn(fs, 'readFile').mockImplementation(async () => buffer);
      parsersMocks.parseRtf.mockResolvedValue(text);

      const filePath = 'file.rtf';

      const result = await readText(filePath);

      expect(result).toBe(text);
      expect(fs.readFile).toHaveBeenCalledTimes(1);
      expect(fs.readFile).toHaveBeenCalledWith(filePath);
      expect(fileType.fromBuffer).toHaveBeenCalledTimes(1);
      expect(fileType.fromBuffer).toHaveBeenCalledWith(buffer);
      expect(parsers.parseRtf).toHaveBeenCalledTimes(1);
      expect(parsers.parseRtf).toHaveBeenCalledWith(buffer);
    });
  });

  describe('open office files', () => {
    it('should read an ODT file', async () => {
      const text = 'Dragons are superior';
      const buffer = Buffer.from(text);

      jest.spyOn(fileType, 'fromBuffer').mockResolvedValue({ ext: 'odt', mime: 'application/xml' });
      jest.spyOn(fs, 'readFile').mockImplementation(async () => buffer);
      parsersMocks.parseOpenOffice.mockResolvedValue(text);

      const filePath = 'file.odt';

      const result = await readText(filePath);

      expect(result).toBe(text);
      expect(fs.readFile).toHaveBeenCalledTimes(1);
      expect(fs.readFile).toHaveBeenCalledWith(filePath);
      expect(fileType.fromBuffer).toHaveBeenCalledTimes(1);
      expect(fileType.fromBuffer).toHaveBeenCalledWith(buffer);
      expect(parsers.parseOpenOffice).toHaveBeenCalledTimes(1);
      expect(parsers.parseOpenOffice).toHaveBeenCalledWith(buffer);
    });

    it('should read an ODP file', async () => {
      const text = 'Dragons are superior';
      const buffer = Buffer.from(text);

      jest.spyOn(fileType, 'fromBuffer').mockResolvedValue({ ext: 'odp', mime: 'application/xml' });
      jest.spyOn(fs, 'readFile').mockImplementation(async () => buffer);
      parsersMocks.parseOpenOffice.mockResolvedValue(text);

      const filePath = 'file.odp';

      const result = await readText(filePath);

      expect(result).toBe(text);
      expect(fs.readFile).toHaveBeenCalledTimes(1);
      expect(fs.readFile).toHaveBeenCalledWith(filePath);
      expect(fileType.fromBuffer).toHaveBeenCalledTimes(1);
      expect(fileType.fromBuffer).toHaveBeenCalledWith(buffer);
      expect(parsers.parseOpenOffice).toHaveBeenCalledTimes(1);
      expect(parsers.parseOpenOffice).toHaveBeenCalledWith(buffer);
    });

    it('should read an ODS file', async () => {
      const text = 'Dragons are superior';
      const buffer = Buffer.from(text);

      jest.spyOn(fileType, 'fromBuffer').mockResolvedValue({ ext: 'ods', mime: 'application/xml' });
      jest.spyOn(fs, 'readFile').mockImplementation(async () => buffer);
      parsersMocks.parseOpenOffice.mockResolvedValue(text);

      const filePath = 'file.ods';

      const result = await readText(filePath);

      expect(result).toBe(text);
      expect(fs.readFile).toHaveBeenCalledTimes(1);
      expect(fs.readFile).toHaveBeenCalledWith(filePath);
      expect(fileType.fromBuffer).toHaveBeenCalledTimes(1);
      expect(fileType.fromBuffer).toHaveBeenCalledWith(buffer);
      expect(parsers.parseOpenOffice).toHaveBeenCalledTimes(1);
      expect(parsers.parseOpenOffice).toHaveBeenCalledWith(buffer);
    });
  });

  describe('unknown files', () => {
    it('should throw an error', async () => {
      const text = 'Dragons are superior';
      const buffer = Buffer.from(text);

      jest.spyOn(fileType, 'fromBuffer').mockResolvedValue(undefined);
      jest.spyOn(fs, 'readFile').mockImplementation(async () => buffer);

      const filePath = 'file.png';

      const getResult = () => readText(filePath);

      await expect(getResult).rejects.toThrowError('Cannot parse files of type .png');
      expect(fs.readFile).toHaveBeenCalledTimes(1);
      expect(fs.readFile).toHaveBeenCalledWith(filePath);
      expect(fileType.fromBuffer).toHaveBeenCalledTimes(1);
      expect(fileType.fromBuffer).toHaveBeenCalledWith(buffer);
    });
  });
});
