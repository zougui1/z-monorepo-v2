import type { SVGProps } from 'react';

import type { FS } from '@zougui/story-ide.types';

import DefaultFolderOpen from '~/icons/DefaultFolderOpen';
import DefaultFolder from '~/icons/DefaultFolder';
import { getFileTypeIcon } from '~/utils';

export const getNodeTypeIcon = (name: string, type: FS.NodeType, isOpen: boolean): SvgComponent => {
  if (type === 'file') {
    return getFileTypeIcon(name);
  }

  if (isOpen) {
    return DefaultFolderOpen;
  }

  return DefaultFolder;
}

type SvgComponent = (props: SVGProps<SVGSVGElement>) => JSX.Element;
