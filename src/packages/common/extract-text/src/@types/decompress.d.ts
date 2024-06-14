declare module 'decompress' {
  export default function decompress(
    filePath: string,
    output?: string | undefined,
    options?: DecompressOptions | undefined,
  ): Promise<File[]>;
  export default function decompress(
    filePath: string,
    options: DecompressOptions,
  ): Promise<File[]>;
  export default function decompress(
    buffer: Buffer,
    output?: string | undefined,
    options?: DecompressOptions | undefined,
  ): Promise<File[]>;
  export default function decompress(
    buffer: Buffer,
    options: DecompressOptions,
  ): Promise<File[]>;

  export declare interface DecompressOptions {
    filter?: ((file: File) => any) | undefined;
  }

  export interface File {
    mode: number;
    mtime: Date;
    path: string;
    type: string;
    data: Buffer;
  }
}
