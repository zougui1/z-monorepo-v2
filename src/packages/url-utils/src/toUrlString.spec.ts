import { toUrlString } from './toUrlString';

describe('toUrlString', () => {
  it('should return the URL as is when there is no query', () => {
    const url = 'https://zougui.com';
    const result = toUrlString(url);

    expect(result).toBe(url);
  });

  it('should return the URL the query string', () => {
    const url = 'https://zougui.com';
    const query = {
      species: 'dragon',
      name: 'zougui',
    };
    const result = toUrlString(url, query);

    expect(result).toBe(`${url}?species=dragon&name=zougui`);
  });

  it('should merge the query string from the raw URL with the object query stringified ', () => {
    const url = 'https://zougui.com?rank=best';
    const query = {
      species: 'dragon',
      name: 'zougui',
    };
    const result = toUrlString(url, query);

    expect(result).toBe(`${url}&species=dragon&name=zougui`);
  });
});
