import { isAbsoluteUrl } from './isAbsoluteUrl';

describe('isAbsoluteUrl', () => {
  it('should return true when the URL starts with "http"', () => {
    const url = 'https://zougui.com';
    const result = isAbsoluteUrl(url);

    expect(result).toBe(true);
  });

  it('should return false when the URL does not start with "http"', () => {
    const url = '/some/path';
    const result = isAbsoluteUrl(url);

    expect(result).toBe(false);
  });
});
