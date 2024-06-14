import type { SVGProps } from 'react';

import FileTypeMarkdown from 'app/icons/FileTypeMarkdown';
import FileTypeJson from 'app/icons/FileTypeJson';
import DefaultFile from 'app/icons/DefaultFile';
import FileTypeGit from 'app/icons/FileTypeGit';

const iconMap = new Map<string, SvgComponent | undefined>([
  ['md', FileTypeMarkdown],
  ['json', FileTypeJson],
  ['gitignore', FileTypeGit],
]);

export const getFileTypeIcon = (name: string): SvgComponent => {
  const extension = name.split('.').at(-1) || '';
  return iconMap.get(extension) || DefaultFile;
}

type SvgComponent = (props: SVGProps<SVGSVGElement>) => JSX.Element;
