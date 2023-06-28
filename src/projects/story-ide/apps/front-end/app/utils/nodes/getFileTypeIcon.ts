import type { SVGProps } from 'react';

import FileTypeMarkdown from '~/icons/FileTypeMarkdown';
import FileTypeJson from '~/icons/FileTypeJson';
import DefaultFile from '~/icons/DefaultFile';
import FileTypeGit from '~/icons/FileTypeGit';

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
