import * as file from './File';
import * as FileDefinition from './FileDefinition';
import * as metadata from './Metadata';
import { fileMetadataKeys } from './fileMetadataKeys';
import * as iMetadata from './IMetadata';

export namespace File {
  export const Object = file.File;
  export type Object = file.File;

  export const Definition = FileDefinition.FileDefinition;
  export type Definition = FileDefinition.FileDefinition;

  export const Metadata = metadata.Metadata;
  export type Metadata = metadata.Metadata;

  export const metadataKeys = fileMetadataKeys;

  export interface IMetadata extends iMetadata.IMetadata {};
  export type GetMetadataOptions = iMetadata.GetMetadataOptions;
  export type MetadataObject = iMetadata.MetadataObject;
}
