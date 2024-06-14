import path from 'node:path';

import sharp from 'sharp';
import fs from 'fs-extra';
import type OBSWebSocket from 'obs-websocket-js';
import type Tesseract from 'tesseract.js';

import {
  profileDimensions,
  locationDimensions,
  corrections,
} from './constants';
import { deleteVideoIfUnwanted } from './utils';
import { createTempScreenshot, wait } from '../../utils';

export class Manager {
  readonly obs: OBSWebSocket;
  readonly worker: Tesseract.Worker;
  readonly recordDir: string | undefined;
  #recordLocation: string | undefined;

  constructor(context: ManagerOptions) {
    this.obs = context.obs;
    this.worker = context.worker;
    this.recordDir = context.recordDir;
  }

  async checkIsLoadingScreen(): Promise<boolean> {
    // takes a screenshot of a small section of the top left corner
    // of the main monitor
    return await createTempScreenshot(profileDimensions, async file => {
      const data = await sharp(file).raw().toBuffer();
      // if all pixels are black then the game is loading
      return data.every(rgb => rgb === 0);
    });
  }

  async getLocation(): Promise<string> {
    const text = await createTempScreenshot(locationDimensions, async file => {
      const { data } = await this.worker.recognize(file);
      return data.text.toLowerCase();
    });

    // remove people number
    const [dirtyLocationName] = text.split('(');
    const locationName = dirtyLocationName.trim();
    return corrections.get(locationName) || locationName;
  }

  /**
   * try to find the location on an interval until it is found
   */
  async findLocation(): Promise<string> {
    const locationName = await this.getLocation();

    if (locationName) {
      return locationName;
    }

    await wait(200);
    return await this.findLocation();
  }

  async stopRecord(): Promise<{ outputPath?: string | undefined; }> {
    const { outputActive } = await this.obs.call('GetRecordStatus');
    const { outputPath } = outputActive
      ? await this.obs.call('StopRecord')
      : { outputPath: undefined };

    if (outputPath) {
      console.log('stopping record');
      await this.waitRecordStopped();
    }

    this.#recordLocation = undefined;
    return { outputPath };
  }

  async startRecord(): Promise<void> {
    const { outputActive } = await this.obs.call('GetRecordStatus');

    if (outputActive) {
      console.log('already recording');
    }

    console.log('starting record');
    await this.obs.call('StartRecord');

    if (this.recordDir) {
      this.#recordLocation = await this.findLocation();
      console.log('location found:', this.#recordLocation);
    }
  }

  async restartRecord(): Promise<void> {
    const { outputPath } = await this.stopRecord();

    await Promise.all([
      this.startRecord(),
      outputPath ? deleteVideoIfUnwanted(outputPath) : null,
    ]);
  }

  async waitRecordStopped(): Promise<void> {
    const { outputActive } = await this.obs.call('GetRecordStatus');

    if (outputActive) {
      await wait(1500);
      await this.waitRecordStopped();
    }
  }
}

export interface ManagerOptions {
  obs: OBSWebSocket;
  worker: Tesseract.Worker;
  recordDir?: string | undefined;
}
