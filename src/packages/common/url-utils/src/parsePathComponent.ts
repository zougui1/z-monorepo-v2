export const parsePathComponent = (pathComponent: string): ParsedPathComponent => {
  const isDynamic = pathComponent.startsWith(':');
  const isOptional = pathComponent.endsWith('?');
  const name = pathComponent.slice(
    isDynamic ? 1 : 0,
    isOptional ? -1 : pathComponent.length,
  );

  return {
    name,
    isDynamic,
    isOptional,
  };
}

export interface ParsedPathComponent {
  name: string;
  isDynamic: boolean;
  isOptional: boolean;
}
