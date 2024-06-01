export const wait = (timeout: number): Promise<void> => {
  return new Promise<void>(resolve => {
    setTimeout(resolve, timeout);
  });
}
