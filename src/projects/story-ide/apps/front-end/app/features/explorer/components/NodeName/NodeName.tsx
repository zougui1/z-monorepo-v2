import { TextField, Tooltip } from '@mui/material';
import { Controller } from 'react-hook-form';

import type { FS } from '@zougui/story-ide.types';

import { useAppSelector } from '~/store';
import { preventEvent } from '~/utils';

import { selectIsRenamingNode } from '../../slice';
import { useRenameForm } from '../../hooks';

export const NodeName = ({ node }: NodeNameProps) => {
  const isRenaming = useAppSelector(selectIsRenamingNode(node.path));

  const { control, handleSubmit, cancel, formState } = useRenameForm(node);

  const createBlurHandler = (handleBlur: () => void) => () => {
    cancel();
    handleBlur();
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      preventEvent(event);
      cancel();
    }
  }

  const handleInputRef = (input: HTMLInputElement | null) => {
    // the function is called on every formState change
    // and we don't want a selection to be made when
    // the input is no longer valid so we check is the form
    // has been touched or not
    if (!input || formState.isDirty) {
      return;
    }

    const lastDotIndex = input.value.lastIndexOf('.');
    const selectionRange = lastDotIndex <= 1
      ? input.value.length
      : lastDotIndex;

    input.setSelectionRange(0, selectionRange);
  }

  if (!isRenaming) {
    return (
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">{node.name}</span>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Controller
        name="newSubPath"
        control={control}
        render={({ field }) => (
          <Tooltip
            open={!!formState.errors.newSubPath}
            title={`${formState.errors.newSubPath?.message}`}
            classes={{
              tooltip: '!text-lg max-w-full border-2 border-solid border-red-500',
            }}
          >
            <TextField
              {...field}
              inputRef={handleInputRef}
              fullWidth
              autoFocus
              inputProps={{
                className: '!p-0',
              }}
              error={!!formState.errors.newSubPath}
              onBlur={createBlurHandler(field.onBlur)}
              onKeyDown={handleKeyDown}
            />
          </Tooltip>
        )}
      />
    </form>
  );
}

export interface NodeNameProps {
  node: FS.Node;
}
