import execa from 'execa';

export const checkIsVideoValid = async (filePath: string): Promise<boolean> => {
  try {
    await execa('ffmpeg', [
      '-v', 'error',
      '-i', filePath,
      '-f', 'null', '-',
    ], { windowsHide: true });

    return true;
  } catch (error) {
    return false;
  }
}
