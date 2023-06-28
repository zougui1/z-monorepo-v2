import {
  NumberRawPropertyConfig,
  UrlRawPropertyConfig,
  SelectRawPropertyConfig,
  MultiSelectRawPropertyConfig,
  StatusRawPropertyConfig,
  DateRawPropertyConfig,
  EmailRawPropertyConfig,
  PhoneNumberRawPropertyConfig,
  CheckboxRawPropertyConfig,
  FilesRawPropertyConfig,
  CreatedByRawPropertyConfig,
  CreatedTimeRawPropertyConfig,
  LastEditedByRawPropertyConfig,
  LastEditedTimeRawPropertyConfig,
  FormulaRawPropertyConfig,
  TitleRawPropertyConfig,
  RichTextRawPropertyConfig,
  PeopleRawPropertyConfig,
  RelationRawPropertyConfig,
  RollupRawPropertyConfig,
} from './raw-types';

export interface RawPropertyConfigTypeMap {
  number: NumberRawPropertyConfig;
  url: UrlRawPropertyConfig;
  select: SelectRawPropertyConfig;
  multi_select: MultiSelectRawPropertyConfig;
  status: StatusRawPropertyConfig;
  date: DateRawPropertyConfig;
  email: EmailRawPropertyConfig;
  phone_number: PhoneNumberRawPropertyConfig;
  checkbox: CheckboxRawPropertyConfig;
  files: FilesRawPropertyConfig;
  created_by: CreatedByRawPropertyConfig;
  created_time: CreatedTimeRawPropertyConfig;
  last_edited_by: LastEditedByRawPropertyConfig;
  last_edited_time: LastEditedTimeRawPropertyConfig;
  formula: FormulaRawPropertyConfig;
  title: TitleRawPropertyConfig;
  rich_text: RichTextRawPropertyConfig;
  people: PeopleRawPropertyConfig;
  relation: RelationRawPropertyConfig;
  rollup: RollupRawPropertyConfig;
}
