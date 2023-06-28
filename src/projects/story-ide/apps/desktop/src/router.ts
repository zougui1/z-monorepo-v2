import { Router } from './utils';

import { fs, state } from './features';

export const router = new Router();
router.use(fs.router);
router.use(state.router);
