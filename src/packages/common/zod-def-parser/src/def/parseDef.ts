import { type ZodSchema, type ZodTypeDef, ZodFirstPartyTypeKind } from 'zod';

import { getRefs, type Seen, type Refs } from './Refs';
import {
  parseStringDef,
  parseOptionalDef,
  parseNullableDef,
  parseObjectDef,
  parseAnyDef,
  parseArrayDef,
  parseBigIntDef,
  parseBooleanDef,
  parseBrandedDef,
  parseCatchDef,
  parseDateDef,
  parseDefaultDef,
  parseEffectsDef,
  parseEnumDef,
  parseIntersectionDef,
  parseLiteralDef,
  parseMapDef,
  parseNativeEnumDef,
  parseNeverDef,
  parseNullDef,
  parseNumberDef,
  parsePipelineDef,
  parsePromiseDef,
  parseSetDef,
  parseUndefinedDef,
  parseUnknownDef,
  parseNaNDef,
  parseSymbolDef,
  parseVoidDef,
  parseRecordDef,
  parseUnionDef,
  parseTupleDef,
  parseLazyDef,
  parseFunctionDef,
  type StringZodDef,
  type ObjectZodDef,
  type AnyZodDef,
  type ArrayZodDef,
  type BigIntZodDef,
  type BooleanZodDef,
  type DateZodDef,
  type EnumZodDef,
  type IntersectionZodDef,
  type LiteralZodDef,
  type MapZodDef,
  type NativeEnumZodDef,
  type NeverZodDef,
  type NullZodDef,
  type NumberZodDef,
  type PipelineZodDef,
  type SetZodDef,
  type UndefinedZodDef,
  type UnknownZodDef,
  type NaNZodDef,
  type SymbolZodDef,
  type VoidZodDef,
  type RecordZodDef,
  type UnionZodDef,
  type TupleZodDef,
  type LazyZodDef,
  type FunctionZodDef,
} from './parsers';

export interface ZodDefMeta {
  nullable: boolean;
  optional: boolean;
  description?: string | undefined;
  defaultValue?: unknown;
}

export type ZodDef = (
  | StringZodDef
  | ObjectZodDef
  | AnyZodDef
  | ArrayZodDef
  | BigIntZodDef
  | BooleanZodDef
  | DateZodDef
  | EnumZodDef
  | IntersectionZodDef<any, any>
  | LiteralZodDef<any>
  | MapZodDef
  | NativeEnumZodDef
  | NeverZodDef
  | NullZodDef
  | NumberZodDef
  | PipelineZodDef<any, any>
  | SetZodDef
  | UndefinedZodDef
  | UnknownZodDef
  | NaNZodDef
  | SymbolZodDef
  | VoidZodDef
  | RecordZodDef
  | UnionZodDef
  | TupleZodDef
  | LazyZodDef
  | FunctionZodDef
);

export const getDef = (schema: ZodSchema<any>): ZodDef => {
  return parseDef(schema._def, getRefs());
}

/**
 * ! missing types: tuple, union, discriminated union, function and lazy
 * @param def
 * @param refs
 * @returns
 */
export const parseDef = (def: ZodTypeDef, refs: Refs) => {
  const seenItem = refs.seen.get(def);

  if (seenItem) {
    return getRef(seenItem, refs);
  }

  const newItem: Seen = {
    def,
    path: refs.currentPath,
  };

  refs.seen.set(def, newItem);
  const description = selectParser(def, (def as any).typeName, refs);

  return description;
}

const getRef = (item: Seen, refs: Refs) => {
  if (item.path.length === 0) {
    return { ref: '' };
  }

  if (item.path.length === 1) {
    return { ref: `${item.path[0]}/` };
  }

  return { ref: item.path.join('/') };
}

const selectParser = (def: any, typeName: ZodFirstPartyTypeKind, refs: Refs): any => {
  switch (typeName) {
    case ZodFirstPartyTypeKind.ZodString:
      return parseStringDef(def);
    case ZodFirstPartyTypeKind.ZodAny:
      return parseAnyDef(def);
    case ZodFirstPartyTypeKind.ZodObject:
      return parseObjectDef(def, refs);
    case ZodFirstPartyTypeKind.ZodOptional:
      return parseOptionalDef(def, refs);
    case ZodFirstPartyTypeKind.ZodNullable:
      return parseNullableDef(def, refs);
    case ZodFirstPartyTypeKind.ZodArray:
      return parseArrayDef(def, refs);
    case ZodFirstPartyTypeKind.ZodBigInt:
      return parseBigIntDef(def);
    case ZodFirstPartyTypeKind.ZodBoolean:
      return parseBooleanDef(def);
    case ZodFirstPartyTypeKind.ZodBranded:
      return parseBrandedDef(def, refs);
    case ZodFirstPartyTypeKind.ZodCatch:
      return parseCatchDef(def, refs);
    case ZodFirstPartyTypeKind.ZodDate:
      return parseDateDef(def);
    case ZodFirstPartyTypeKind.ZodDefault:
      return parseDefaultDef(def, refs);
    case ZodFirstPartyTypeKind.ZodEffects:
      return parseEffectsDef(def, refs);
    case ZodFirstPartyTypeKind.ZodEnum:
      return parseEnumDef(def);
    case ZodFirstPartyTypeKind.ZodIntersection:
      return parseIntersectionDef(def, refs);
    case ZodFirstPartyTypeKind.ZodLiteral:
      return parseLiteralDef(def);
    case ZodFirstPartyTypeKind.ZodMap:
      return parseMapDef(def, refs);
    case ZodFirstPartyTypeKind.ZodNativeEnum:
      return parseNativeEnumDef(def);
    case ZodFirstPartyTypeKind.ZodNever:
      return parseNeverDef(def);
    case ZodFirstPartyTypeKind.ZodNull:
      return parseNullDef(def);
    case ZodFirstPartyTypeKind.ZodNumber:
      return parseNumberDef(def);
    case ZodFirstPartyTypeKind.ZodPipeline:
      return parsePipelineDef(def, refs);
    case ZodFirstPartyTypeKind.ZodPromise:
      return parsePromiseDef(def, refs);
    case ZodFirstPartyTypeKind.ZodSet:
      return parseSetDef(def, refs);
    case ZodFirstPartyTypeKind.ZodUndefined:
      return parseUndefinedDef(def);
    case ZodFirstPartyTypeKind.ZodUnknown:
      return parseUnknownDef(def);
    case ZodFirstPartyTypeKind.ZodNaN:
      return parseNaNDef(def);
    case ZodFirstPartyTypeKind.ZodSymbol:
      return parseSymbolDef(def);
    case ZodFirstPartyTypeKind.ZodVoid:
      return parseVoidDef(def);
    case ZodFirstPartyTypeKind.ZodRecord:
      return parseRecordDef(def, refs);
    case ZodFirstPartyTypeKind.ZodUnion:
    case ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
      return parseUnionDef(def, refs);
    case ZodFirstPartyTypeKind.ZodTuple:
      return parseTupleDef(def, refs);
    case ZodFirstPartyTypeKind.ZodLazy:
      return parseLazyDef(def, refs);
    case ZodFirstPartyTypeKind.ZodFunction:
      return parseFunctionDef(def, refs);
  }
}

interface SchemaDescription {
  type: string;
  label?: string;
  meta: object | undefined;
  oneOf: unknown[];
  notOneOf: unknown[];
  default?: unknown;
  nullable: boolean;
  optional: boolean;
  tests: Array<{ name?: string; params: any | undefined }>;

  // Present on object schema descriptions
  fields: Record<string, SchemaFieldDescription>;

  // Present on array schema descriptions
  innerType?: SchemaFieldDescription;
}

type SchemaFieldDescription =
  | SchemaDescription
  | SchemaRefDescription
  | SchemaLazyDescription;

interface SchemaRefDescription {
  type: 'ref';
  key: string;
}

interface SchemaLazyDescription {
  type: string;
  label?: string;
  meta: object | undefined;
}
