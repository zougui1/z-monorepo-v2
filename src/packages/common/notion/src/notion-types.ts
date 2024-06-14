import type { ClientOptions as NotionClientOptions } from '@notionhq/client/build/src/Client';
import type {
  QueryDatabaseParameters as RawQueryDatabaseParameters,
  QueryDatabaseResponse as RawQueryDatabaseResponse,
  PageObjectResponse as RawPageObjectResponse,
  CreatePageParameters as RawCreatePageParameters,
  CreatePageResponse as RawCreatePageResponse,
  PartialPageObjectResponse as RawPartialPageObjectResponse,
  UpdatePageParameters as RawUpdatePageParameters,
  GetDatabaseParameters as RawGetDatabaseParameters,
  GetDatabaseResponse as RawGetDatabaseResponse,
  DatabaseObjectResponse as RawDatabaseObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

export type WithAuth<T> = T & { auth?: string; };

export type {
  NotionClientOptions,
  RawQueryDatabaseParameters,
  RawQueryDatabaseResponse,
  RawPageObjectResponse,
  RawCreatePageParameters,
  RawCreatePageResponse,
  RawPartialPageObjectResponse,
  RawUpdatePageParameters,
  RawGetDatabaseParameters,
  RawGetDatabaseResponse,
  RawDatabaseObjectResponse,
};

export type NumberFormat = "number" | "number_with_commas" | "percent" | "dollar" | "canadian_dollar" | "singapore_dollar" | "euro" | "pound" | "yen" | "ruble" | "rupee" | "won" | "yuan" | "real" | "lira" | "rupiah" | "franc" | "hong_kong_dollar" | "new_zealand_dollar" | "krona" | "norwegian_krone" | "mexican_peso" | "rand" | "new_taiwan_dollar" | "danish_krone" | "zloty" | "baht" | "forint" | "koruna" | "shekel" | "chilean_peso" | "philippine_peso" | "dirham" | "colombian_peso" | "riyal" | "ringgit" | "leu" | "argentine_peso" | "uruguayan_peso" | "peruvian_sol";
