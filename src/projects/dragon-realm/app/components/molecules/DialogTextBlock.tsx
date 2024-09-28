import { useState } from 'react';
import { Play } from 'lucide-react';
import clsx from 'clsx';

import { ProgressiveText } from '~/components/atoms/ProgressiveText';

import { useTextSpeed } from '~/hooks';

export const DialogTextBlock = ({ text, label, onContinue }: DialogTextBlockProps) => {
  const { speed, increaseSpeed } = useTextSpeed(text);
  const [isTextFullyDisplayed, setIsTextFullyDisplayed] = useState(false);

  const handleClick = (): void => {
    // call this click handler only when the text
    // is fully displayed
    if (isTextFullyDisplayed) {
      onContinue?.();
    }

    increaseSpeed();
  }

  return (
    <div
      tabIndex={0}
      onKeyDown={() => { }}
      role="button"
      onClick={handleClick}
      className="w-full relative text-lg h-[170px] border border-slate-100 rounded p-5 tracking-wider"
    >
      {label && (
        <span className="absolute -translate-y-1/2 top-0 left-[10px] p-1.5 bg-[hsl(var(--background))]">{label}</span>
      )}

      <div className="h-full overflow-auto">
        <ProgressiveText
          text={text}
          speed={speed}
          onDone={() => setIsTextFullyDisplayed(true)}
        />
      </div>

      <Play
        className={clsx('absolute bottom-2 right-8 fill-current animate-pulse w-4', {
          'animate-pulse': isTextFullyDisplayed,
          hidden: !isTextFullyDisplayed,
        })}
      />
    </div>
  );
}

export interface DialogTextBlockProps {
  label?: string | undefined;
  text: string;
  onContinue?: (() => void) | undefined;
}
