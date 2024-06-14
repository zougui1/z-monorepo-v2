import { joinUrlQuery } from './joinUrlQuery';

describe('joinUrlQuery', () => {
  it('should join the query parts together', () => {
    const queryParts = ['species=dragon', 'name=zougui'];
    const result = joinUrlQuery(...queryParts);

    expect(result).toBe('species=dragon&name=zougui');
  });
});
