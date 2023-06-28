const optionalComponentIndicator = '?';
const dynamicComponentIndicator = ':';

export const validatePathName = (url: string, pathNameScheme: string): boolean => {
  const urlObject = new URL(url);
  const urlPathNameParts = splitPathName(urlObject.pathname);
  const pathNameSchemeParts = splitPathName(pathNameScheme);

  if (urlPathNameParts.length > pathNameSchemeParts.length) {
    return false;
  }

  return pathNameSchemeParts.every((pathNameScheme, index) => {
    const urlPathName = urlPathNameParts.at(index);

    if (urlPathName === undefined) {
      return pathNameScheme.endsWith(optionalComponentIndicator);
    }

    // the path name part is expected to be a dynamic value
    if (pathNameScheme.startsWith(dynamicComponentIndicator)) {
      return true;
    }

    return urlPathName === pathNameScheme;
  });
}

const splitPathName = (pathName: string): string[] => {
  return pathName.split('/').filter(Boolean);
}
