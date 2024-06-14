import { validatePathName } from './validatePathName';

describe('validatePathName', () => {
  it('should return true when the path name corresponds to the path name scheme', () => {
    const url = 'https://zougui.com/some/path/name/koezshfezhjfouziehjiuazeh/edit';
    const pathNameScheme = '/some/path/name/:param/edit'

    const result = validatePathName(url, pathNameScheme);

    expect(result).toBe(true);
  });

  it('should return true when the url is missing an optional component', () => {
    const url = 'https://zougui.com/some/path/name/koezshfezhjfouziehjiuazeh';
    const pathNameScheme = '/some/path/name/:param/edit?'

    const result = validatePathName(url, pathNameScheme);

    expect(result).toBe(true);
  });

  it('should return false when the path name does not have the same number of components than the path name scheme', () => {
    const url = 'https://zougui.com/some/path/name/koezshfezhjfouziehjiuazeh';
    const pathNameScheme = '/some/path/name/:param/edit'

    const result = validatePathName(url, pathNameScheme);

    expect(result).toBe(false);
  });

  it('should return false when one of the path name\'s components is not the same as in the path name scheme', () => {
    const url = 'https://zougui.com/some/incorrect/name/koezshfezhjfouziehjiuazeh/edit';
    const pathNameScheme = '/some/path/name/:param/edit'

    const result = validatePathName(url, pathNameScheme);

    expect(result).toBe(false);
  });
});
