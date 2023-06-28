import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import zod from 'zod';

import type { FS } from '@zougui/story-ide.types';

import { useAppDispatch, store } from '~/store';

import { cancelRenaming, renameNode } from '../slice';

// this regex is imperfect. it does not allow the following paths
// - some../thing
// - some/..thing
const reNoDirectoryUpPath = /^((?!\/?\.\.\/?)[\s\S])*$/;
const reNoLeadingSlash = /^(?!\/).*$/;

const schema = zod.object({
  newSubPath: zod
    .string()
    .regex(reNoDirectoryUpPath, 'The name is not valid as a file or folder')
    .regex(reNoLeadingSlash, 'A file or folder cannot start with a slash')
    .nonempty(),
});

export const useRenameForm = (node: FS.Node) => {
  const dispatch = useAppDispatch();

  const form = useForm<zod.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      newSubPath: node.name,
    },
    mode: 'onChange',
  });

  const handleSubmit = form.handleSubmit(data => {
    const { renamingPath } = store.getState().explorer;

    if (renamingPath) {
      dispatch(renameNode({
        oldPath: renamingPath,
        newPath: data.newSubPath,
      }));
      form.reset();
    }
  });

  const cancel = () => {
    dispatch(cancelRenaming());
    form.reset();
  }

  return {
    handleSubmit,
    control: form.control,
    cancel,
    formState: form.formState,
  };
}
