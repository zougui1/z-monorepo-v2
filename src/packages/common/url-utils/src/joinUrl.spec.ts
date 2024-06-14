import { joinUrl } from './joinUrl';

describe('joinUrl', () => {
  it('should merge the path', () => {
    const urlComponents = [
      'https://zougui.com/some',
      'draconic',
      '/path/',
    ];
    const result = joinUrl(...urlComponents);

    expect(result).toBe('https://zougui.com/some/draconic/path');
  });

  it('should merge the query string of the different URL components', () => {
    const urlComponents = [
      'https://zougui.com?species=dragon',
      'name=zougui',
      '?rank=best',
    ];
    const result = joinUrl(...urlComponents);

    expect(result).toBe('https://zougui.com?species=dragon&name=zougui&rank=best');
  });
});
