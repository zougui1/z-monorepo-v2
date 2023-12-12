import fs from 'fs-extra';
import execa from 'execa';
import sharp from 'sharp';

const file = '/tmp/rotmg-screenshot.png';

export const checkIsLoadingScreen = async (): Promise<boolean> => {
  // make sure the file doesn't already exist
  // as scrot will create the file with another name otherwise
  await fs.remove(file);

  try {
    // takes a screenshot of a small section of the top left corner
    // of the main monitor
    await execa('scrot', ['-a', '3890,55,70,70', file]);
    const data = await sharp(file).raw().toBuffer();
    // if all pixels are black then the game is loading
    return data.every(rgb => rgb === 0);
  } finally {
    await fs.remove(file);
  }
}
