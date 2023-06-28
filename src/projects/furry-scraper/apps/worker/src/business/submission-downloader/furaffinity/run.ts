import { downloadNextSubmission } from './downloadNextSubmission';
import { throttleJob } from '../../common';
import { processExitScheduler } from '../../../utils';

export const run = async () => {
  await throttleJob(async () => {
    const { downloaded } = await processExitScheduler.addTask(downloadNextSubmission());

    if (downloaded) {
      console.log('submission downloaded');
    } else {
      console.log('submission not downloaded');
    }
  });
};
