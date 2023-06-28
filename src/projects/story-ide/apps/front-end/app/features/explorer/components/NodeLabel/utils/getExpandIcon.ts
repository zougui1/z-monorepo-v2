import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import type { FS } from '@zougui/story-ide.types';

export const getExpandIcon = (type: FS.NodeType, isOpen: boolean): SvgComponent | undefined => {
  if (type === 'file') {
    return;
  }

  if (isOpen) {
    return KeyboardArrowDownIcon;
  }

  return KeyboardArrowRightIcon;
}

type SvgComponent = typeof KeyboardArrowRightIcon | typeof KeyboardArrowDownIcon;
