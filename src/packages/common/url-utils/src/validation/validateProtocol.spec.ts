import { validateProtocol } from './validateProtocol';

describe('validateProtocol', () => {
  it('should return true when the protocol of the URL is in the list of allowed protocols', () => {
    const url = 'https://zougui.com/some/path/name/koezshfezhjfouziehjiuazeh/edit';
    const allowedProtocols = ['http', 'https'];

    const result = validateProtocol(url, allowedProtocols);

    expect(result).toBe(true);
  });

  it('should return false when the protocol of the URL is not in the list of allowed protocols', () => {
    const url = 'ws://zougui.com/some/path/name/koezshfezhjfouziehjiuazeh/edit';
    const allowedProtocols = ['http', 'https'];

    const result = validateProtocol(url, allowedProtocols);

    expect(result).toBe(false);
  });
});
