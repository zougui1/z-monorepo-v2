import type { Manager } from './Manager';
import { wait } from '../../utils';
import { Game } from '../../Game';

export const manageRecord = async (manager: Manager): Promise<void> => {
  const isGameRunning = await Game.getIsRunning();

  if (!isGameRunning) {
    await wait(10_000);
    return;
  }

  const isLoading = await manager.checkIsLoadingScreen();

  if (!isLoading) {
    await wait(200);
    await manageRecord(manager);
    return;
  }

  await manager.restartRecord();

  // wait 5 seconds before restarting the record management to
  // prevent the record from being restarted more than once
  await wait(200);
  await manageRecord(manager);
}
