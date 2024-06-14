import sharp from 'sharp';
import apng from 'sharp-apng';

const apngExtensions = [
  '.png',
  '.apng',
];

export const getAnimatedImageMetadata = async (filePath: string, extension: string) => {
  const metadata = apngExtensions.includes(extension)
    ? await getApngMetadata(filePath)
    : await sharp(filePath).metadata();

  const { width, height } = metadata;

  if (width === undefined || height === undefined) {
    throw new Error('Could not find image size');
  }

  const frameCount = metadata.pages || 0;
  const delay = metadata.delay || [];
  const duration = delay.reduce((acc, d) => acc + d, 0) / 1000;

  return {
    width,
    height,
    duration,
    frameCount,
    frameRate: frameCount / (duration || 1)
  };
}

const getApngMetadata = async (filePath: string) => {
  const result = apng.framesFromApng(filePath, true);

  // should not happen; the types of sharp-apng isn't very elaborated
  if (Array.isArray(result)) {
    throw new Error('could not parse APNG file');
  }

  const frames = result.frames || [];
  const metadata = await Promise.all(frames.map(f => f.metadata()));
  // delay is poorly typed as Number[] instead of number[]
  const delay = result.delay as number[];

  const width = Math.max(...metadata.map(f => f.width || 0), 0);
  const height = Math.max(...metadata.map(f => f.height || 0), 0);

  return {
    width,
    height,
    delay,
    pages: frames.length,
  };
}
