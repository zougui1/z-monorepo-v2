import { parsePathComponent, ParsedPathComponent } from './parsePathComponent';

export const parsePathPattern = (path: string): ParsedPathComponent[] => {
  const pathComponents = path.split('/').filter(Boolean);
  return pathComponents.map(parsePathComponent);
}

export type { ParsedPathComponent };
