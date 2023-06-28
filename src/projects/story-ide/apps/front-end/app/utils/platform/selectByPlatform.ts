import { isElectron } from './isElectron';
import { isWeb } from './isWeb';

export type PlatformType = 'web' | 'electron';

export function selectByPlatform<T>(
  specifics:
    | ({ [platform in PlatformType]?: T } & { default: T })
    | { [platform in PlatformType]: T },
): T;
export function selectByPlatform<T>(specifics: { [platform in PlatformType]?: T }): T | undefined;
export function selectByPlatform<T>(specifics: { [platform in PlatformType]?: T } & { default?: T }): T | undefined {
  if (isElectron && specifics.electron) {
    return specifics.electron;
  }

  if (isWeb && specifics.web) {
    return specifics.web;
  }

  return specifics.default;
}
