import { fork } from 'radash';

import { FS } from '@zougui/story-ide.types';

import { getSafePath, getIsPathWithinRootDir } from './utils';
import * as database from './fs.database';
import { normalizePath } from '../../utils';

export const getNodes = async (rootDir: string, subDir: string): Promise<FS.Node[]> => {
  const dir = getSafePath(rootDir, subDir);
  const nodes = await database.getNodes(dir);

  return nodes.map(node => {
    const subPath = node.path.slice(rootDir.length + 1);

    return {
      ...node,
      path: normalizePath(subPath, { noLeadingSlash: true }),
    };
  });
}

export const getFileContent = async (rootDir: string, subFilePath: string): Promise<string> => {
  const filePath = getSafePath(rootDir, subFilePath);
  return await database.getFileContent(filePath);
}

export const deleteNodes = async (rootDir: string, subPaths: string[]): Promise<DeleteNodesResult> => {
  const [validPaths, invalidPaths] = fork(subPaths, subPath => {
    return getIsPathWithinRootDir(rootDir, subPath);
  });

  await database.deleteNodes(validPaths.map(path => getSafePath(rootDir, path)));

  return {
    preservedPaths: invalidPaths,
  };
}

export const renameNode = async (rootDir: string, oldPath: string, newPath: string): Promise<void> => {
  const validOldPath = getSafePath(rootDir, oldPath);
  const validNewPath = getSafePath(rootDir, newPath);

  await database.renameNode(validOldPath, validNewPath);
}

export interface DeleteNodesResult {
  // paths that couldn't be deleted
  preservedPaths: string[];
}
