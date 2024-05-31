import z from 'zod';

import { Option, OptionObject } from './Option';

export class OptionMap {
  readonly options: Record<string, Option> = {};

  add = (option: Option): this => {
    this.options[option.name] = option;
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

  toSchema(): z.ZodObject<any> {
    const options = this.asArray();

    const schemaShape = options.reduce((shape, option) => {
      shape[option.name] = option.schema;
      return shape;
    }, {} as z.ZodRawShape);

    return z.object(schemaShape);
  }
}
