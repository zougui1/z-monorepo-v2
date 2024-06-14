export const parseMongoUri = (uri: string): ParsedMongoUri => {
  const url = new URL(uri);
  // filter to remove splits from leading/trailing slash
  const dbName = url.pathname.split('/').filter(Boolean).shift();

  if (!dbName) {
    throw new Error('Missing database name from Mongo URI');
  }

  return { dbName };
}

export interface ParsedMongoUri {
  dbName: string;
}
