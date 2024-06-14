export enum MongoTypeName {
  MongoString = 'MongoString',
  MongoNumber = 'MongoNumber',
  MongoBoolean = 'MongoBoolean',
  MongoObject = 'MongoObject',
  MongoArray = 'MongoArray',
  MongoDate = 'MongoDate',
  MongoBigInt = 'MongoBigInt',
  MongoObjectId = 'MongoObjectId',
  MongoEnum = 'MongoEnum',
  MongoOptional = 'MongoOptional',
  MongoDefault = 'MongoDefault',
  MongoUnion = 'MongoUnion',
  MongoUndefined = 'MongoUndefined',
  MongoNull = 'MongoNull',
}

export enum BsonTypeName {
  String = 'string',
  Number = 'number',
  BigInt = 'bigInt',
  Boolean = 'boolean',
  Date = 'date',
  Object = 'object',
  Array = 'array',
  Null = 'null',
}

export enum MongoComprisonOperator {
  // common
  Equal = '==',
  NotEqual = '!=',
  In = 'in',
  Nin = 'nin',

  // arithmetic
  GreaterThan = '>',
  GreaterThanOrEqual = '>=',
  LowerThan = '<',
  LowerThanOrEqual = '<=',

  // string
  Regex = 'regex',

  // array
  All = 'all',
  Size = 'size',
}
