declare module 'rtf-parser' {
  declare function parseString(raw: string, callback: (error: unknown, result: RTFDocument | undefined) => void): void;

  export default {
    string: parseString,
  };

  export type RTFNode = RTFParagraph | RTFSpan;

  export interface RTFDocument {
    content: RTFNode[];
  }

  export interface RTFParagraph {
    style: unknown;
    content: RTFNode[];
  }

  export interface RTFSpan {
    style: unknown;
    value: string;
  }
}
