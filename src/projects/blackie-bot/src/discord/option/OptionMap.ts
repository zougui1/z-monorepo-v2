import z from 'zod';

import { Option, OptionObject } from './Option';

export class OptionMap<T extends Record<string, Option> = {}> {
  readonly options: T = {} as T;

  add = (option: Option): this => {
    (this.options as Record<string, Option>)[option.name] = option;
    return this;
  }

  get = (name: string): Option | undefined => {
    return this.options[name];
  }

  /**
   * @returns the options in an array
   */
  asArray(): Option[] {
    return Object.values(this.options);
  }

  /**
   * @returns the options converted to objects
   */
  toArray(): OptionObject[] {
    return this.asArray().map(option => option.toObject());
  }

  isEmpty(): boolean {
    return this.asArray().length === 0;
  }

  toSchema(): z.ZodObject<OptionsToSchemaShape<T>> {
    const options = this.asArray();

    const schemaShape = options.reduce((shape, option) => {
      shape[option.name] = option.schema;
      return shape;
    }, {} as z.ZodRawShape);

    return z.object(schemaShape) as z.ZodObject<OptionsToSchemaShape<T>>;
  }
}

export type OptionsToSchemaShape<T extends Record<string, Option>> = {
  [Key in keyof T]: T[Key]['schema'];
}
