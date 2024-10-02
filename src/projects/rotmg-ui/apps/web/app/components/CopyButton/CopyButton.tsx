import { IconButton, type IconButtonProps } from '@mui/material';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';

import { copyToClipboard } from '~/utils/copyToClipboard';

export const CopyButton = ({ content, onClick, ...rest }: CopyButtonProps) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (!event.defaultPrevented) {
      const text = typeof content === 'function'
        ? content(event)
        : content;

      copyToClipboard(text);
    }
  }

  return (
    <IconButton {...rest} onClick={handleClick} className="relative">
      <ContentCopyIcon />
    </IconButton>
  );
}

export interface CopyButtonProps extends Omit<IconButtonProps, 'content'> {
  content: string | ((event: React.MouseEvent<HTMLButtonElement>) => string);
}
