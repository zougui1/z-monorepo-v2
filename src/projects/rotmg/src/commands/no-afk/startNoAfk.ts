import { Socket } from 'node:net';

import { tryit } from 'radash';

import { Random } from '@zougui/common.random-utils';

import { maxDelay, minDelay, movementKeys, keyboardInputSocket } from './constants';
import { Game } from '../../Game';
import { Xdotool } from '../../Xdotool';
import { connectToSocket } from '../../utils';

const simulateActivity = async (): Promise<void> => {
  const isGameRunning = await Game.getIsRunning();

  if (!isGameRunning) {
    console.log('Game not running');
    return;
  }

  const activeWindowId = await Xdotool.getActiveWindow();

  const gamePid = await Game.getPid();

  console.log('activating game...');
  const gameWindowId = await Xdotool.getWindowIdFromPid(gamePid);

  const key = Random.item(movementKeys);

  try {
    await Xdotool.activateByWindowIdAndPressKey(gameWindowId, key);
  } finally {
    console.log('reseting activated window...');
    await Xdotool.activateByWindowId(activeWindowId);
  }
}

const getRandomDelay = (): number => {
  return Random.integer(minDelay, maxDelay);
}

const preventAfkKickOut = async (socket: Socket): Promise<void> => {
  const delayedSimulateActivity = (): NodeJS.Timeout => {
    const delay = getRandomDelay();
    console.log('delay:', delay)

    return setTimeout(async () => {
      console.log('timeout');

      try {
        await simulateActivity();
      } finally {
        socket.off('data', handleData);
        await preventAfkKickOut(socket);
      }
    }, delay);
  }

  let timeoutId = delayedSimulateActivity();

  const handleData = async () => {
    const activeWindowId = await Xdotool.getActiveWindow();
    const activePid = await Xdotool.getPidFromWindowId(activeWindowId);
    const gamePid = await Game.getPid();
    const isGameActive = activePid === gamePid;

    if (isGameActive) {
      clearTimeout(timeoutId);
      timeoutId = delayedSimulateActivity();
    }
  }

  socket.on('data', handleData);
}

export const startNoAfk = async (): Promise<void> => {
  const { host, port } = keyboardInputSocket;
  const [error, socket] = await tryit(connectToSocket)(host, port);

  if (error) {
    throw new Error(`Could not connect to server: ${host}:${port}`);
  }

  await preventAfkKickOut(socket);
}
