import { EmptyObject } from '@zougui/common.type-utils';

import { PropertyType } from '../../../PropertyType';
import { NumberFormat } from '../../../notion-types';
import { SelectPropertyRawResponse } from '../../../page';
import { RollupFunction, SelectColor } from '../../../types';

export interface BaseRawPropertyConfig {
  id: string;
  type: PropertyType;
  name: string;
}

export interface NumberRawPropertyConfig extends BaseRawPropertyConfig {
  type: 'number';
  number: {
    format: NumberFormat;
  };
}


export interface FormulaRawPropertyConfig extends BaseRawPropertyConfig {
  type: 'formula';
  formula: {
    expression: string;
  };
}


export interface SelectRawPropertyConfig extends BaseRawPropertyConfig {
  type: 'select';
  select: {
    options: SelectPropertyRawResponse[];
  };
}


export interface MultiSelectRawPropertyConfig extends BaseRawPropertyConfig {
  type: 'multi_select';
  multi_select: {
    options: SelectPropertyRawResponse[];
  };
}

//#region status
export interface StatusRawPropertyConfigResponse {
  id: string;
  name: string;
  color: SelectColor;
}

export interface StatusGroupRawPropertyConfigResponse {
  id: string;
  name: string;
  color: SelectColor;
  option_ids: string[];
}

export interface StatusRawPropertyConfig extends BaseRawPropertyConfig {
  type: 'status';
  status: {
    options: StatusRawPropertyConfigResponse[];
    groups: StatusGroupRawPropertyConfigResponse[];
  };
}
//#endregion

//#region relation
export interface SinglePropertyRawPropertyRelationConfigResponse {
  type: 'single_property';
  single_property: EmptyObject;
  database_id: string;
}

export interface DualPropertyRawPropertyRelationConfigResponse {
  type: 'dual_property';
  dual_property: {
    synced_property_id: string;
    synced_property_name: string;
  };
  database_id: string;
}

export type RelationRawPropertyConfigResponse = SinglePropertyRawPropertyRelationConfigResponse | DualPropertyRawPropertyRelationConfigResponse;

export interface RelationRawPropertyConfig extends BaseRawPropertyConfig {
  type: 'relation';
  relation: RelationRawPropertyConfigResponse;
}
//#endregion

export interface RollupRawPropertyConfig extends BaseRawPropertyConfig {
  type: 'rollup';
  rollup: {
    rollup_property_name: string;
    relation_property_name: string;
    rollup_property_id: string;
    relation_property_id: string;
    function: RollupFunction;
  };
}

export interface TitleRawPropertyConfig extends BaseRawPropertyConfig {
  type: 'title';
  title: EmptyObject;
}

export interface RichTextRawPropertyConfig extends BaseRawPropertyConfig {
  type: 'rich_text';
  rich_text: EmptyObject;
}

export interface UrlRawPropertyConfig extends BaseRawPropertyConfig {
  type: 'url';
  url: EmptyObject;
}

export interface PeopleRawPropertyConfig extends BaseRawPropertyConfig {
  type: 'people';
  people: EmptyObject;
}

export interface FilesRawPropertyConfig extends BaseRawPropertyConfig {
  type: 'files';
  files: EmptyObject;
}

export interface EmailRawPropertyConfig extends BaseRawPropertyConfig {
  type: 'email';
  email: EmptyObject;
}

export interface PhoneNumberRawPropertyConfig extends BaseRawPropertyConfig {
  type: 'phone_number';
  phone_number: EmptyObject;
}

export interface DateRawPropertyConfig extends BaseRawPropertyConfig {
  type: 'date';
  date: EmptyObject;
}

export interface CheckboxRawPropertyConfig extends BaseRawPropertyConfig {
  type: 'checkbox';
  checkbox: EmptyObject;
}

export interface CreatedByRawPropertyConfig extends BaseRawPropertyConfig {
  type: 'created_by';
  created_by: EmptyObject;
}

export interface CreatedTimeRawPropertyConfig extends BaseRawPropertyConfig {
  type: 'created_time';
  created_time: EmptyObject;
}

export interface LastEditedByRawPropertyConfig extends BaseRawPropertyConfig {
  type: 'last_edited_by';
  last_edited_by: EmptyObject;
}

export interface LastEditedTimeRawPropertyConfig extends BaseRawPropertyConfig {
  type: 'last_edited_time';
  last_edited_time: EmptyObject;
}
