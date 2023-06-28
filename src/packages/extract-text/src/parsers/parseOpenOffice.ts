import { XMLParser } from 'fast-xml-parser';
import decompress from 'decompress';

export const parseOpenOffice = async (buffer: Buffer): Promise<string> => {
  const [doc] = await decompress(buffer, {
    filter: file => file.path === 'content.xml',
  });

  if (!doc) {
    throw new Error('Could not parse the open office file.');
  }

  const xmlParser = new XMLParser({ ignoreAttributes: true });
  const data = xmlParser.parse(doc.data);

  return extractTextFromOpenOfficeXmlObjectList(data).join(' ');
}

const extractTextFromOpenOfficeXmlObjectList = (xmlObjects: unknown): string[] => {
  if (!xmlObjects || typeof xmlObjects !== 'object') {
    return [];
  }

  const xmlObjectList = Array.isArray(xmlObjects)
    ? xmlObjects
    : Object.values(xmlObjects);

  return xmlObjectList.flatMap(extractTextFromOpenOfficeXmlObject);
}

const extractTextFromOpenOfficeXmlObject = (xmlObject: unknown): string[] => {
  if (typeof xmlObject === 'string' && xmlObject !== '') {
    return [xmlObject];
  }

  return extractTextFromOpenOfficeXmlObjectList(xmlObject);
}
