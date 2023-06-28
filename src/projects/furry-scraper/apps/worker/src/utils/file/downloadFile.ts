import axios from 'axios';
import fs from 'fs-extra';

export const downloadFile = async (url: string, output: string): Promise<void> => {
  const response = await axios.get(url, {
    responseType: 'stream',
  });

  const writeSubmission = fs.createWriteStream(output);
  response.data.pipe(writeSubmission);

  try {
    await new Promise((resolve, reject) => {
      writeSubmission.once('finish', resolve);
      writeSubmission.once('error', reject);
    });
  } finally {
    writeSubmission.removeAllListeners();
  }
}
