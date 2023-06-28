import { electronApi } from '@zougui/story-ide.electron-api';

import { getState } from './state.business';
import { Router } from '../../utils';

export const router = new Router();

router.on(electronApi.state.get, async req => {
  return getState(req.sender.id);
});
