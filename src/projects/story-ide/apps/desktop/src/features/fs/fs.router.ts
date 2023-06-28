import { electronApi } from '@zougui/story-ide.electron-api';

import {
  getNodes,
  getFileContent,
  deleteNodes,
  renameNode,
} from './fs.business';
import { Router } from '../../utils';
import { globals } from '../../globals';

export const router = new Router();

router.on(electronApi.fs.index, async req => {
  return await getNodes(globals.dir, req.body.path);
});

router.on(electronApi.fs.file, async req => {
  return await getFileContent(globals.dir, req.body.path);
});

router.on(electronApi.fs.delete, async req => {
  await deleteNodes(globals.dir, req.body.paths);
  return {};
});

router.on(electronApi.fs.rename, async req => {
  const { oldPath, newPath } = req.body;

  await renameNode(globals.dir, oldPath, newPath);
  return {};
});
