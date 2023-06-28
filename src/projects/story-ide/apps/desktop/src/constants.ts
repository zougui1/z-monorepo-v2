import os from 'node:os';
import path from 'node:path';

import { Percent } from '@zougui/common.percent-utils';

export const defaultUrl = 'http://localhost:3000/workspaces';
export const widthPercent: Percent.StringType = '35%';
export const heightPercent: Percent.StringType = '35%';
export const appDir = path.join(os.homedir(), '.config', 'Story IDE');
export const appCacheDir = path.join(appDir, 'Cache');
