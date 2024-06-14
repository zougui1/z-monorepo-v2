declare module 'pdf-parse' {
  export default function parsePdf(buffer: Buffer): Promise<PDF>;

  export declare interface PDF {
    text: string;
  }
}
