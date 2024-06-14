import { parse as parse_ } from './parse';
import * as format from './toString';
import * as types from './types';

export namespace MS {
  export type DurationString = types.DurationString;
  export type DurationFormat = format.DurationFormat;
  export type ToStringOptions = format.ToStringOptions;

  export const parse = parse_;
  export const toString = (value: DurationString | number, options?: ToStringOptions | undefined): string => {
    if (typeof value === 'string') {
      if (!validate(value)) {
        throw new Error('Invalid duration string.');
      }

      // if no format is specified we return the string as is, otherwise we reformat it to the desired format
      if (!options?.format) {
        return value;
      }
    }

    return format.toString(toNumber(value), options)
  }

  export const toNumber = (value: DurationString | number): number => {
    if (typeof value === 'number') {
      return value;
    }

    return parse(value);
  }

  export function toggle(string: DurationString): number;
  export function toggle(ms: number, options?: ToStringOptions | undefined): string;
  export function toggle(value: DurationString | number, options?: ToStringOptions | undefined): number | string {
    if (typeof value === 'string') {
      return parse(value);
    }

    return format.toString(value, options);
  }

  export const validate = (string: string): string is DurationString => {
    try {
      parse(string);
      return true;
    } catch {
      return false;
    }
  }
}
