import path from 'node:path';

export class FileDefinition {
  readonly extension: string;
  readonly dir: string;
  readonly path: string;
  readonly fileName: string;
  readonly withoutExtension: Readonly<{ path: string; fileName: string; }>;

  constructor(filePath: string) {
    this.path = filePath;
    this.extension = path.extname(filePath);
    this.dir = path.dirname(filePath);
    this.fileName = path.basename(filePath);

    const filePathWithoutExtension = filePath.slice(0, -this.extension.length);

    this.withoutExtension = {
      path: filePathWithoutExtension,
      fileName: path.basename(filePathWithoutExtension),
    };
  }
}
