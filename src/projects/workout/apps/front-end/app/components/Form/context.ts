import type { UseFormRegister, FormState as ReactFormState, Control } from 'react-hook-form';
import type zod from 'zod';

import { createContextStore, type PayloadAction } from '@zougui/common.react-context-store';
import type { UnknownObject } from '@zougui/common.type-utils';

// TODO import from @zougui/common.zod-def-parser
import type { ObjectZodDef } from '~/utils/zod/def/parsers';

export const {
  Provider: FormProvider,
  slice,
  useActions: useFormActions,
  useSelector: useFormSelector,
} = createContextStore<FormState>({
  name: 'Form',
  reducers: {
    updateForm: (state, action: PayloadAction<Pick<typeof state, 'register' | 'formState' | 'getControl'>>) => {
      state.register = action.payload.register;
      state.formState = action.payload.formState;
      state.getControl = action.payload.getControl;
    },

    updateSchema: (state, action: PayloadAction<{ schema: typeof state['schema'] }>) => {
      state.schema = action.payload.schema;
    },

    updateDefaultValues: (state, action: PayloadAction<{ defaultValues: UnknownObject }>) => {
      state.defaultValues = action.payload.defaultValues;
    },
  },
});

export interface FormState<TSchema extends zod.AnyZodObject = zod.AnyZodObject> {
  register: UseFormRegister<zod.infer<TSchema>>;
  formState: ReactFormState<zod.infer<TSchema>>;
  getControl: () => Control<zod.TypeOf<TSchema>, any>;
  schema: TSchema;
  schemaDef: ObjectZodDef;
  defaultValues: UnknownObject;
}
