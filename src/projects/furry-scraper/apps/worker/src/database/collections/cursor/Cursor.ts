import { prop, getModelForClass } from '@typegoose/typegoose';

import { enumProp } from '../../utils';
import { DocumentType } from '../../types';
import { Source } from '../../../enums';
import { WeakEnum } from '../../../types';

export enum CursorStatus {
  Idle = 'idle',
  Running = 'running',
  Error = 'error',
}

class CursorReport {
  @prop({ type: String })
  error?: string | undefined;
}

export class Cursor {
  @enumProp({ enum: Source, required: true, unique: true })
  source!: WeakEnum<Source>;

  @prop({ required: true })
  lastSubmissionId!: string;

  @enumProp({ enum: CursorStatus, required: true })
  status!: WeakEnum<CursorStatus>;

  @prop({ type: CursorReport, _id: false })
  report?: CursorReport | undefined;
}

// istanbul ignore next for some reason the namespace is marked as untested
export namespace Cursor {
  export const Model = getModelForClass(Cursor);
  export type Document = DocumentType<Cursor>;
  export type Report = CursorReport;
  export type Object = Cursor & { _id: string };
}
