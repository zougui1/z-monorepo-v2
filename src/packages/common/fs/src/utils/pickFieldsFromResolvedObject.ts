import { pick } from '@zougui/common.object-utils';
import { includesSome } from '@zougui/common.array-utils';
import { AnyObject } from '@zougui/common.type-utils';

/**
 * @param func function from which to resolve the object from which to pick the fields
 * @param requiredFields fields required to be picked in order to execute the function and pick its resolved object
 * @param fields fields to pick from the resolved object
 */
export async function pickFieldsFromResolvedObject<T extends AnyObject, Field extends keyof T>(
  func: () => Promise<T>,
  requiredFields: Field[],
  fields: Field[],
): Promise<Pick<T, Field>>;
export async function pickFieldsFromResolvedObject<T extends AnyObject, Field extends keyof T>(
  func: () => Promise<T>,
  requiredFields: Field[],
  fields?: Field[] | undefined,
): Promise<T>;
export async function pickFieldsFromResolvedObject<T extends AnyObject, Field extends keyof T>(
  func: () => Promise<T>,
  requiredFields: Field[],
  fields: Field[] = [],
): Promise<Partial<T>> {
  if (!includesSome(requiredFields, fields)) {
    return {};
  }

  const obj = await func();
  return pick(obj, fields) as Partial<T>;
}
