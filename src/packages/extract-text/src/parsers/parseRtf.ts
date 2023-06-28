import parser, { RTFNode, RTFDocument } from 'rtf-parser';

export const parseRtf = async (buffer: Buffer): Promise<string> => {
  const nodes = await parseString(buffer.toString());
  return extractText(nodes).join(' ');
}

const parseString = (raw: string): Promise<RTFDocument> => {
  return new Promise((resolve, reject) => {
    parser.string(raw, (error, result) => {
      if (error) {
        return reject(error);
      }

      // this should not happen. just for type-safety
      if (!result) {
        return reject(new Error('Could not parse the RTF.'));
      }

      resolve(result);
    });
  });
}

const extractText = (node: RTFDocument | RTFNode): string[] => {
  if ('content' in node) {
    return node.content.flatMap(extractText);
  }

  if('value' in node) {
    return [node.value];
  }

  // this should not happen. but because the types are defined locally this ensures type-safety
  return [];
}
