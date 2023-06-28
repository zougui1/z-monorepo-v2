import path from 'node:path';

import fs from 'fs-extra';
import { parallel } from 'radash';

import { FS } from '@zougui/story-ide.types';

export const getNodes = async (dirPath: string): Promise<FS.Node[]> => {
  const nodeNames = await fs.readdir(dirPath);

  const nodes = await parallel(nodeNames.length, nodeNames, async nodeName => {
    const nodePath = path.join(dirPath, nodeName);
    const stats = await fs.stat(nodePath);
    const type = getNodeType(stats);

    return {
      path: nodePath,
      name: nodeName,
      type,
    };
  });

  return nodes.filter<FS.Node>((node): node is FS.Node => Boolean(node.type))
}

const getNodeType = (stats: fs.Stats): FS.NodeType | undefined => {
  if (stats.isDirectory()) {
    return 'dir';
  }

  if (stats.isFile()) {
    return 'file';
  }
}

export const getFileContent = async (filePath: string): Promise<string> => {
  return await fs.readFile(filePath, 'utf8');
}

export const deleteNodes = async (nodesPaths: string[]): Promise<void> => {
  await parallel(nodesPaths.length, nodesPaths, async nodePath => {
    try {
      await fs.remove(nodePath);
    } catch {}
  });
}

export const renameNode = async (oldPath: string, newPath: string): Promise<void> => {
  await fs.ensureDir(path.dirname(newPath));
  await fs.rename(oldPath, newPath);
}
