import { getFullHref } from './href';

describe('getFullHref', () => {
  it('should return the URL as is when it is a complete URL using the HTTPS protocol', () => {
    const href = 'https://furaffinity.net/user/Zougui';
    const origin = 'https://furaffinity.net';
    const result = getFullHref(href, origin);

    expect(result).toBe(href);
  });

  it('should ensure that the URL is using the HTTPS protocol', () => {
    const href = 'http://furaffinity.net/user/Zougui';
    const origin = 'https://furaffinity.net';
    const result = getFullHref(href, origin);

    expect(result).toBe('https://furaffinity.net/user/Zougui');
  });

  it('should complete the URL when it is incomplete', () => {
    const href = '/user/Zougui';
    const origin = 'https://furaffinity.net';
    const result = getFullHref(href, origin);

    expect(result).toBe('https://furaffinity.net/user/Zougui');
  });

  it('should add the HTTPS protocol when the URL has no protocol', () => {
    const href = '//furaffinity.net/user/Zougui';
    const origin = 'https://furaffinity.net';
    const result = getFullHref(href, origin);

    expect(result).toBe('https://furaffinity.net/user/Zougui');
  });
});
