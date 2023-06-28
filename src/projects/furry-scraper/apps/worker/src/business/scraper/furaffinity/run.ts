import { findNextSubmission } from './findNextSubmission';
import { throttleJob } from '../../common';
import { processExitScheduler } from '../../../utils';

export const run = async () => {
  await throttleJob(async () => {
    const document = await processExitScheduler.addTask(findNextSubmission());

    if (document) {
      console.log('submission found');
    } else {
      console.log('submission not found');
    }
  });
};
