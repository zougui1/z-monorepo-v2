export function selectByPlatform<T>(select: PlatformSelect<T> & { default: T }): T;
export function selectByPlatform<T>(select: PlatformSelect<T> & { default?: undefined }): T | undefined;
export function selectByPlatform<T>(select: PlatformSelect<T> & { default?: undefined }, required: true): T;
export function selectByPlatform<T>(select: PlatformSelect<T> & { default?: undefined }, required?: false | undefined): T | undefined;
export function selectByPlatform<T>(select: PlatformSelect<T> & { default?: T | undefined }, required?: boolean | undefined): T | undefined {
  if (process.platform in select) {
    return select[process.platform];
  }

  if (required) {
    throw new Error('Unsupported OS');
  }

  return select.default;
}

export type PlatformSelect<T> = Partial<Record<NodeJS.Platform, T>>;
