export const validateProtocol = (url: string, allowedProtocols: string[]): boolean => {
  const urlObject = new URL(url);
  // removes the trailing ':'
  const protocol = urlObject.protocol.slice(0, -1);

  return allowedProtocols.includes(protocol);
}
