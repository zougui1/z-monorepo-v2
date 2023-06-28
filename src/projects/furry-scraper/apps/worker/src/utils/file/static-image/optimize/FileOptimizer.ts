import path from 'node:path';

import sharp from 'sharp';

import { findOptimalSize, FindOptimalSizeOptions, OptimalSize } from './findOptimalSize';

export class FileOptimizer {
  #file: string;
  #resizeOptions: FindOptimalSizeOptions = { width: '100%' };
  #jpeg: sharp.JpegOptions | undefined;
  #webp: sharp.WebpOptions | undefined;
  #avif: sharp.AvifOptions | undefined;

  constructor(file: string) {
    this.#file = file;
  }

  resize(options: FindOptimalSizeOptions): this {
    this.#resizeOptions = options;
    return this;
  }

  jpeg(options: sharp.JpegOptions = {}): this {
    this.#jpeg = options;
    return this;
  }

  webp(options: sharp.WebpOptions = {}): this {
    this.#webp = options;
    return this;
  }

  avif(options: sharp.AvifOptions = {}): this {
    this.#avif = options;
    return this;
  }

  async toFile({ dir }: { dir: string }): Promise<FileOptimizerOutput> {
    const genericFileName = this.getGenericFileName();
    const file = path.join(dir, genericFileName);
    const optimalSize = await findOptimalSize(this.#file, this.#resizeOptions);

    const jpegFile = `${file}.jpg`;
    const webpFile = `${file}.webp`;
    const avifFile = `${file}.avif`;

    const [jpegOutput, webpOutput, avifOutput] = await Promise.all([
      this.#jpeg && this.toJpeg(jpegFile, optimalSize),
      this.#webp && this.toWebp(webpFile, optimalSize),
      this.#avif && this.toAvif(avifFile, optimalSize),
    ]);

    return {
      jpeg: jpegOutput && { file: jpegFile, details: jpegOutput },
      webp: webpOutput && { file: webpFile, details: webpOutput },
      avif: avifOutput && { file: avifFile, details: avifOutput },
    };
  }

  private async toJpeg(output: string, size: OptimalSize): Promise<sharp.OutputInfo> {
    return await sharp(this.#file)
      .resize(size.width, size.height)
      .jpeg(this.#jpeg)
      .toFile(output);
  }

  private async toWebp(output: string, size: OptimalSize): Promise<sharp.OutputInfo> {
    return await sharp(this.#file)
      .resize(size.width, size.height)
      .webp(this.#webp)
      .toFile(output);
  }

  private async toAvif(output: string, size: OptimalSize): Promise<sharp.OutputInfo> {
    return await sharp(this.#file)
      .resize(size.width, size.height)
      .avif(this.#avif)
      .toFile(output);
  }

  private getGenericFileName(): string {
    const fileName = path.basename(this.#file);
    return fileName.split('.').slice(0, -1).join('.');
  }
}

export interface FileOptimizerOutput {
  jpeg?: FormatOutput | undefined;
  webp?: FormatOutput | undefined;
  avif?: FormatOutput | undefined;
}

export interface FormatOutput {
  file: string;
  details: sharp.OutputInfo;
}
